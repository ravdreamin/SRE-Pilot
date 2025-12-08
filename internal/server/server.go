package server

import (
	"log"
	"net/http"

	"github.com/prometheus/client_golang/prometheus/promhttp"
)

// Start launches the observability server in a blocking manner
func Start(addr string) {
	mux := http.NewServeMux()

	// Liveness Probe
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	})

	// Prometheus Metrics
	mux.Handle("/metrics", promhttp.Handler())

	log.Printf("🔭 Observability Server started on %s", addr)
	if err := http.ListenAndServe(addr, mux); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
