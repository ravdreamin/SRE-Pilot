package server

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sre-pilot/internal/ai"
	"sre-pilot/internal/monitor"
	"time"

	"github.com/prometheus/client_golang/prometheus/promhttp"
)

type Server struct {
	AI      *ai.Client
	Monitor *monitor.Client
}

func NewServer(aiClient *ai.Client, monitorClient *monitor.Client) *Server {
	return &Server{
		AI:      aiClient,
		Monitor: monitorClient,
	}
}

// Start launches the observability server in a blocking manner
func (s *Server) Start(addr string) {
	mux := http.NewServeMux()

	// Liveness Probe
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		enableCors(w)
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	})

	// Prometheus Metrics
	mux.Handle("/metrics", promhttp.Handler())

	// Chat API
	mux.HandleFunc("/api/chat", s.handleChat)

	log.Printf("🔭 Observability Server started on %s", addr)
	if err := http.ListenAndServe(addr, mux); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
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
			// We don't fail the request, but we might want to annotate the response
			// or maybe we just return the error in a field?
			// For now let's just log it and maybe append to payload or separate field.
			// The original main.go logic did a follow-up explanation.
			// Let's keep it simple for now: return the result as part of the response if possible,
			// or let the client handle it.
			// Actually, the main.go logic:
			// 1. Analyze -> Resp
			// 2. Query -> Result
			// 3. Analyze(Result) -> Explanation

			// To keep the API simple (request/response), maybe we should do the full loop here?
			// Yes, let's do the full loop if it's a QUERY.

			// But wait, the previous main.go logic did a SECOND analyze call.
			// Let's replicate that logic here for a "smart" response.
		} else {
			// Query successful, let's get the explanation
			explanationReq := ai.Request{
				UserPrompt: fmt.Sprintf("The query result was: %s. Explain this briefly to the user who asked: %s", val, req.UserPrompt),
				Context:    "Evaluation Phase",
				History:    append(req.History, fmt.Sprintf("Action: QUERY, Payload: %s", resp.Payload)),
			}
			explanation, err := s.AI.Analyze(r.Context(), explanationReq)
			if err == nil && explanation.Action == "EXPLAIN" {
				// Replace the original response with the explanation, but maybe keep the query info?
				// For the API, let's return the final explanation as the main payload,
				// or maybe we return a structured response?
				// The ai.Response struct has Action/Payload/Confidence.
				// Let's stick to returning the AI response JSON, but modify it to contain the explanation.
				resp = explanation
			}
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

func enableCors(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
}
