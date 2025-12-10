package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"os"
	"sre-pilot/internal/ai"
	"sre-pilot/internal/billing"
	"sre-pilot/internal/monitor"
	"sre-pilot/internal/server"
	"sre-pilot/internal/ui"
	"sre-pilot/internal/watchtower"
	"time"

	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {

	}

	dryRun := flag.Bool("dry-run", false, "Enable dry-run mode (no changes applied)")
	watch := flag.Bool("watch", false, "Run in Watchtower mode")
	ask := flag.String("ask", "", "Ask Aegis a question")
	flag.Parse()

	ui.Header("Aegis | SRE-PILOT ")

	if *dryRun {
		ui.Warning("Running in DRY-RUN mode")
	} else {
		ui.Success("System Online")
	}

	config, err := billing.LoadConfig()
	if err != nil {
		log.Printf("Initializing new user config...")
	}

	key := os.Getenv("GROQ_API_KEY")
	if key == "" {
		ui.Error("Missing GROQ_API_KEY. Please set it in your .env file.")
		ui.Info("Get your free key at: https://console.groq.com")
		os.Exit(1)
	}

	aiClient, err := ai.NewClient(key, "openai/gpt-oss-120b")
	if err != nil {
		log.Fatal("Failed to initialize AI client: ", err)
	}

	if *ask != "" {
		ui.Info("Thinking ...")
		resp, err := aiClient.Analyze(context.Background(), ai.Request{
			UserPrompt: *ask,
			Context:    "Interactive CLI",
			History:    []string{},
		})
		if err != nil {
			log.Fatal("Failed to get response: ", err)
		}

		config.QueryCount++
		billing.SaveConfig(config)

		logAction(resp.Action, resp.Payload)

		handleAction(resp, aiClient, *ask)
		return
	}

	ui.Info("Initializing Components...")

	promClient, err := monitor.NewClient("http://localhost:9090")
	if err != nil {
		log.Fatal("Failed to connect to Prometheus: ", err)
	}

	if *watch {
		ui.Header("WATCHTOWER MODE ACTIVE")

		srv := server.NewServer(aiClient, promClient)
		go srv.Start(":8080")

		engine := watchtower.NewEngine(promClient)
		engine.Run(context.Background())
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	result, err := promClient.Query(ctx, "up", time.Now())
	if err != nil {
		log.Fatalf("Connectivity Check Failed: %v", err)
	}

	ui.Success("Connectivity Check: OK")
	fmt.Printf("%s\n", result)
}

func handleAction(resp *ai.Response, aiClient *ai.Client, userAsk string) {
	switch resp.Action {
	case "QUERY":
		ui.Box("Action Proposed", fmt.Sprintf("Type: QUERY\nPayload: %s", resp.Payload))

		pClient, _ := monitor.NewClient("http://localhost:9090")
		val, err := pClient.Query(context.Background(), resp.Payload, time.Now())
		if err != nil {
			ui.Error("Execution failed: %v", err)
			return
		}

		ui.Success("Result: %s", val)

		ui.Info("Analyzing result...")
		explanation, _ := aiClient.Analyze(context.Background(), ai.Request{
			UserPrompt: fmt.Sprintf("The query result was: %s. Explain this briefly to the user who asked: %s", val, userAsk),
			Context:    "Evaluation Phase",
		})

		if explanation != nil {
			ui.Box("Aegis Analysis", explanation.Payload)
		}

	case "EXPLAIN", "FIX":
		ui.Box("Aegis Explanation", resp.Payload)
	default:
		ui.Error("Unknown action: %s", resp.Action)
	}
}

func logAction(action, payload string) {
	f, err := os.OpenFile("data/audit.log", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		return
	}
	defer f.Close()
	fmt.Fprintf(f, "[%s] Action: %s | Payload: %s\n", time.Now().Format(time.RFC3339), action, payload)
}
