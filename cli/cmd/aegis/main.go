package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"os"
	"sre-pilot/internal/ai"
	"sre-pilot/internal/monitor"
	"sre-pilot/internal/server"
	"sre-pilot/internal/ui"
	"time"

	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		// .env file is optional
	}

	dryRun := flag.Bool("dry-run", false, "Enable dry-run mode (no changes applied)")
	ask := flag.String("ask", "", "Ask QryPilot a question")
	watch := flag.Bool("watch", false, "Start API server mode")
	flag.Parse()

	ui.Header("QryPilot")

	if *dryRun {
		ui.Warning("Running in DRY-RUN mode")
	} else {
		ui.Success("System Online")
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

	promURL := os.Getenv("PROMETHEUS_URL")
	if promURL == "" {
		promURL = "http://127.0.0.1:9090"
	}

	promClient, err := monitor.NewClient(promURL)
	if err != nil {
		log.Fatal("Failed to connect to Prometheus: ", err)
	}

	// Server mode
	if *watch {
		ui.Info("Starting API Server...")

		port := os.Getenv("PORT")
		if port == "" {
			port = "8081"
		}

		events := make(chan string, 100)
		srv := server.NewServer(aiClient, promClient, events)

		ui.Success("API Server starting on :%s", port)
		if err := srv.Start(":" + port); err != nil {
			log.Fatal("Server error: ", err)
		}
		return
	}

	// Ask mode
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

		logAction(resp.Action, resp.Payload)
		handleAction(resp, aiClient, promClient, *ask)
		return
	}

	// Default: connectivity check
	ui.Info("Initializing Components...")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	val, err := promClient.Query(ctx, "up{instance=~'.+:8080'}", time.Now())
	if err != nil {
		ui.Error("Connectivity Check Failed: %v", err)
		ui.Info("Ensure Prometheus is running at %s and scraping localhost:8080", promURL)
	} else {
		if val.String() == "" || val.String() == "()" {
			ui.Warning("Prometheus is active but NOT scraping localhost:8080 yet")
			ui.Info("Please restart your Prometheus server to apply the configuration changes")
		} else {
			ui.Success("Connectivity Check: OK (Prometheus is scraping Aegis)")
		}
	}

	ui.Info("Use --ask \"question\" to query, or --watch to start server mode")
}

func handleAction(resp *ai.Response, aiClient *ai.Client, promClient monitor.Client, userAsk string) {
	switch resp.Action {
	case "QUERY":
		ui.Box("Action Proposed", fmt.Sprintf("Type: QUERY\nPayload: %s", resp.Payload))

		val, err := promClient.Query(context.Background(), resp.Payload, time.Now())
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
