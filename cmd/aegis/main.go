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

	if *dryRun {
		fmt.Println("Aegis starting in DRY-RUN mode")
	} else {
		fmt.Println("Aegis starting in LIVE mode")
	}

	if *ask != "" {

		config, err := billing.LoadConfig()
		if err != nil {
			log.Printf("Warning: Could not load subscription: %v", err)
		}

		if !config.CanQuery() {
			log.Fatal("🚫 Quota Exceeded. Upgrade to Pro for unlimited access.")
		}

		key := os.Getenv("GEMINI_KEY")

		aiClient, err := ai.NewClient(key, config.GetModel())
		if err != nil {
			log.Fatal("Failed to initialize AI client: ", err)
		}
		resp, err := aiClient.Analyze(context.Background(), ai.Request{
			UserPrompt: *ask,
			Context:    "",
			History:    []string{},
		})
		if err != nil {
			log.Fatal("Failed to Response", err)
		}
		fmt.Println("AI Response:", resp)

		config.QueryCount++
		billing.SaveConfig(config)

		logAction(resp.Action, resp.Payload)

		switch resp.Action {
		case "QUERY":
			fmt.Printf("Aegis executing: %s\n", resp.Payload)

			pClient, err := monitor.NewClient("http://localhost:9090")
			if err != nil {
				log.Fatal("Failed to connect to Prometheus: %v", err)
			}

			val, err := pClient.Query(context.Background(), resp.Payload, time.Now())
			if err != nil {
				log.Fatalf("Execution failed: %v", err)
			}
			fmt.Printf("Result: %s\n", val)

			fmt.Println("Analyzing result...")
			explanation, err := aiClient.Analyze(context.Background(), ai.Request{
				UserPrompt: fmt.Sprintf("The query result was: %s. Explain this briefly to the user who asked: %s", val, *ask),
				Context:    "Evaluation Phase",
				History:    []string{fmt.Sprintf("Action: QUERY, Payload: %s", resp.Payload)},
			})
			if err == nil && explanation.Action == "EXPLAIN" {
				fmt.Printf("💡 Aegis Analysis: %s\n", explanation.Payload)
			}

		case "EXPLAIN", "FIX":
			fmt.Printf("Aegis Explaination: %s\n", resp.Payload)
		default:
			fmt.Println("Unknown action:", resp.Action)
		}
		return

	}

	// TODO: Initialize components
	fmt.Println("Aegis CLI initialized (Phase 0 Skeleton)")

	client, err := monitor.NewClient("http://localhost:9090")
	if err != nil {
		log.Fatal("Failed to initialize Prometheus client: ", err)
	}
	if *watch {
		fmt.Println("Aegis starting in Watchtower mode")

		// Start Observability Server
		go server.Start(":8080")

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

	fmt.Printf("Success! Prometheus Response:\n%s\n", result)

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
