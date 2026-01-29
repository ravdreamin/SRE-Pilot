package server

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sre-pilot/internal/ai"
	"sre-pilot/internal/monitor"
	"time"

	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
	"github.com/prometheus/client_golang/prometheus/promhttp"
)

var (
	httpRequestsTotal = promauto.NewCounterVec(
		prometheus.CounterOpts{
			Name: "http_requests_total",
			Help: "Total number of HTTP requests",
		},
		[]string{"path", "method", "status"},
	)
	httpRequestDuration = promauto.NewHistogramVec(
		prometheus.HistogramOpts{
			Name:    "http_request_duration_seconds",
			Help:    "HTTP request duration in seconds",
			Buckets: prometheus.DefBuckets,
		},
		[]string{"path", "method"},
	)
)

type Server struct {
	AI      *ai.Client
	Monitor monitor.Client
	Events  <-chan string
}

func NewServer(aiClient *ai.Client, monitorClient monitor.Client, events <-chan string) *Server {
	return &Server{
		AI:      aiClient,
		Monitor: monitorClient,
		Events:  events,
	}
}

// Start launches the observability server in a blocking manner
func (s *Server) Start(addr string) error {
	mux := http.NewServeMux()

	// Liveness Probe
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		enableCors(w)
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	})

	mux.Handle("/metrics", promhttp.Handler())

	// Wrap handlers with instrumentation
	mux.Handle("/api/chat", s.instrumentHandler("/api/chat", http.HandlerFunc(s.handleChat)))
	mux.Handle("/api/metrics", s.instrumentHandler("/api/metrics", http.HandlerFunc(s.handleMetrics)))
	mux.Handle("/api/events", s.instrumentHandler("/api/events", http.HandlerFunc(s.handleEvents)))

	log.Printf("🔭 Observability Server started on %s", addr)
	return http.ListenAndServe(addr, mux)
}

func (s *Server) instrumentHandler(path string, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		// Wrap ResponseWriter to capture status code
		ww := &responseWriter{ResponseWriter: w, status: http.StatusOK}

		next.ServeHTTP(ww, r)

		duration := time.Since(start).Seconds()

		httpRequestsTotal.WithLabelValues(path, r.Method, fmt.Sprintf("%d", ww.status)).Inc()
		httpRequestDuration.WithLabelValues(path, r.Method).Observe(duration)
	})
}

// responseWriter wrapper to capture status code
type responseWriter struct {
	http.ResponseWriter
	status int
}

func (rw *responseWriter) WriteHeader(code int) {
	rw.status = code
	rw.ResponseWriter.WriteHeader(code)
}

func (s *Server) handleMetrics(w http.ResponseWriter, r *http.Request) {
	enableCors(w)
	if r.Method == "OPTIONS" {
		return
	}

	ctx := r.Context()
	result := map[string]interface{}{
		"timestamp": time.Now().Unix(),
	}

	// Query CPU usage
	cpuQuery := `100 - (avg(rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)`
	if cpuVal, err := s.Monitor.Query(ctx, cpuQuery, time.Now()); err == nil {
		result["cpu"] = cpuVal.String()
	}

	// Query Memory usage
	memQuery := `(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100`
	if memVal, err := s.Monitor.Query(ctx, memQuery, time.Now()); err == nil {
		result["memory"] = memVal.String()
	}

	// Query Disk usage
	diskQuery := `(1 - (node_filesystem_avail_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"})) * 100`
	if diskVal, err := s.Monitor.Query(ctx, diskQuery, time.Now()); err == nil {
		result["disk"] = diskVal.String()
	}

	// Query App RPS
	rpsQuery := `sum(rate(http_requests_total[1m]))`
	if rpsVal, err := s.Monitor.Query(ctx, rpsQuery, time.Now()); err == nil {
		result["rps"] = rpsVal.String()
	}

	// Query App Latency
	latQuery := `sum(rate(http_request_duration_seconds_sum[1m])) / sum(rate(http_request_duration_seconds_count[1m]))`
	if latVal, err := s.Monitor.Query(ctx, latQuery, time.Now()); err == nil {
		result["latency"] = latVal.String()
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}

func (s *Server) handleChat(w http.ResponseWriter, r *http.Request) {
	enableCors(w)
	if r.Method == "OPTIONS" {
		return
	}
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req ai.Request
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// 1. Analyze with AI
	resp, err := s.AI.Analyze(r.Context(), req)
	if err != nil {
		log.Printf("AI Analysis failed: %v", err)
		http.Error(w, "AI Analysis failed", http.StatusInternalServerError)
		return
	}

	// 2. If Action is QUERY, execute it (Agentic behavior)
	if resp.Action == "QUERY" && s.Monitor != nil {
		val, err := s.Monitor.Query(r.Context(), resp.Payload, time.Now())
		if err != nil {
			log.Printf("Monitor Query failed: %v", err)
		} else {
			// Query successful, let's get the explanation
			explanationReq := ai.Request{
				UserPrompt: fmt.Sprintf("The query result was: %s. Explain this briefly to the user who asked: %s", val, req.UserPrompt),
				Context:    "Evaluation Phase",
				History:    append(req.History, fmt.Sprintf("Action: QUERY, Payload: %s", resp.Payload)),
			}
			explanation, err := s.AI.Analyze(r.Context(), explanationReq)
			if err == nil && explanation.Action == "EXPLAIN" {
				resp = explanation
			}
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

func (s *Server) handleEvents(w http.ResponseWriter, r *http.Request) {
	enableCors(w)
	if r.Method == "OPTIONS" {
		return
	}

	// Non-blocking read of up to 10 events
	var events []string
	for i := 0; i < 10; i++ {
		select {
		case event := <-s.Events:
			events = append(events, event)
		default:
			// No more events
			goto Encode
		}
	}

Encode:
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"events": events,
	})
}

func enableCors(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
}
