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
	// Load .env file if it exists
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, relying on system environment variables")
	}

	dryRun := flag.Bool("dry-run", false, "Enable dry-run mode (no changes applied)")
	watch := flag.Bool("watch", false, "Run in Watchtower mode")
	ask := flag.String("ask", "", "Ask Aegis a question")
	flag.Parse()

	ui.Header("AEGIS SRE COPILOT")

	if *dryRun {
		ui.Warning("Running in DRY-RUN mode")
	} else {
		ui.Success("System Online")
	}

	if *ask != "" {

		config, err := billing.LoadConfig()
		if err != nil {
			log.Printf("Warning: Could not load subscription: %v", err)
		}

		if !config.CanQuery() {
			ui.Error("Quota Exceeded. Upgrade to Pro for unlimited access.")
			os.Exit(1)
		}

		key := os.Getenv("GEMINI_KEY")

		aiClient, err := ai.NewClient(key, config.GetModel())
		if err != nil {
			log.Fatal("Failed to initialize AI client: ", err)
		}

		ui.Info("Thinking...")
		resp, err := aiClient.Analyze(context.Background(), ai.Request{
			UserPrompt: *ask,
			Context:    "",
			History:    []string{},
		})
		if err != nil {
			log.Fatal("Failed to Response", err)
		}

		config.QueryCount++
		billing.SaveConfig(config)

		logAction(resp.Action, resp.Payload)

		switch resp.Action {
		case "QUERY":
			ui.Box("Action Proposed", fmt.Sprintf("Type: QUERY\nPayload: %s", resp.Payload))

			pClient, err := monitor.NewClient("http://localhost:9090")
			if err != nil {
				log.Fatal("Failed to connect to Prometheus: %v", err)
			}

			val, err := pClient.Query(context.Background(), resp.Payload, time.Now())
			if err != nil {
				log.Fatalf("Execution failed: %v", err)
			}

			ui.Success("Result: %s", val)

			// Follow-up: Ask AI to explain the result
			ui.Info("Analyzing result...")
			explanation, err := aiClient.Analyze(context.Background(), ai.Request{
				UserPrompt: fmt.Sprintf("The query result was: %s. Explain this briefly to the user who asked: %s", val, *ask),
				Context:    "Evaluation Phase",
				History:    []string{fmt.Sprintf("Action: QUERY, Payload: %s", resp.Payload)},
			})
			if err == nil && explanation.Action == "EXPLAIN" {
				ui.Box("Aegis Analysis", explanation.Payload)
			}

		case "EXPLAIN", "FIX":
			ui.Box("Aegis Explanation", resp.Payload)
		default:
			ui.Error("Unknown action: %s", resp.Action)
		}
		return

	}

	// TODO: Initialize components
	ui.Info("Initializing Components...")

	client, err := monitor.NewClient("http://localhost:9090")
	if err != nil {
		log.Fatal("Failed to initialize Prometheus client: ", err)
	}
	if *watch {
		ui.Header("WATCHTOWER MODE ACTIVE")

		// Load config for AI (needed for API server)
		config, err := billing.LoadConfig()
		if err != nil {
			log.Printf("Warning: Could not load subscription: %v", err)
		}
		key := os.Getenv("GEMINI_KEY")
		aiClient, err := ai.NewClient(key, config.GetModel())
		if err != nil {
			log.Printf("Warning: Failed to initialize AI client for server: %v", err)
		}

		// Start Observability Server with AI and Monitor clients
		srv := server.NewServer(aiClient, client)
		go srv.Start(":8080")

		engine := watchtower.NewEngine(client)
		engine.Run(context.Background())
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	result, err := client.Query(ctx, "up", time.Now())
	if err != nil {
		log.Fatal("Query failed: %v", err)
	}

	ui.Success("Connectivity Check: OK")
	fmt.Printf("%s\n", result)

}
func logAction(action, payload string) {
	f, err := os.OpenFile("data/audit.log", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		log.Println("Failed to open audit log:", err)
		return
	}
	defer f.Close()

	entry := fmt.Sprintf("[%s] Action: %s | Payload: %s\n", time.Now().Format(time.RFC3339), action, payload)
	if _, err := f.WriteString(entry); err != nil {
		log.Println("Failed to write to edit log", err)
	}
}
