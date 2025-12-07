package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"sre-pilot/internal/monitor"
	"sre-pilot/internal/watchtower"
	"time"
)

func main() {
	dryRun := flag.Bool("dry-run", false, "Enable dry-run mode (no changes applied)")
	watch := flag.Bool("watch", false, "Run in Watchtower mode")
	flag.Parse()

	if *dryRun {
		fmt.Println("Aegis starting in DRY-RUN mode")
	} else {
		fmt.Println("Aegis starting in LIVE mode")
	}

	// TODO: Initialize components
	fmt.Println("Aegis CLI initialized (Phase 0 Skeleton)")

	client, err := monitor.NewClient("http://localhost:9090")
	if err != nil {
		log.Fatal("Failed to initialize Prometheus client: ", err)
	}
	if *watch {
		fmt.Println("Aegis starting in Watchtower mode")
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
