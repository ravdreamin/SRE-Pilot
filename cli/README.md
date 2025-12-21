# Aegis CLI

**Aegis** is the command-line interface and core intelligence engine for SRE-Pilot. It runs as a background daemon ("Watchtower") or an interactive tool to monitor your infrastructure, detect anomalies, and help you resolve incidents using natural language.

## 🏗 Architecture

The CLI is built in Go and follows a modular architecture:

```
cli/
├── cmd/aegis/           # Main CLI entrypoint
│   └── main.go          # Argument parsing & initialization
├── internal/
│   ├── ai/              # LLM integration
│   │   ├── client.go    # AI client wrapper  
│   │   └── router.go    # Multi-provider routing (Groq/Gemini)
│   ├── billing/         # Usage & cost tracking
│   ├── memory/          # Conversation context management
│   ├── monitor/         # Prometheus client integration
│   ├── server/          # HTTP API handlers for Web Console
│   ├── ui/              # Terminal UI components
│   └── watchtower/      # Background monitoring daemon
├── deployments/
│   ├── docker-compose.yml  # Prometheus + Node Exporter
│   └── prometheus.yml      # Prometheus configuration
├── data/                # Persistent storage (logs, incidents)
├── .env.example         # Environment template
├── go.mod               # Go module dependencies
└── go.sum               # Dependency checksums
```

## 🚀 Getting Started

### Prerequisites

| Requirement | Version | Purpose |
|-------------|---------|---------|
| Go | 1.25+ | Build the CLI |
| Docker | Latest | Run monitoring stack |
| API Key | - | Groq or Gemini for AI |

### Installation

```bash
# Navigate to CLI directory
cd cli

# Download Go dependencies
go mod download

# Build the binary
go build -o aegis ./cmd/aegis

# Or run directly
go run ./cmd/aegis --help
```

### Configuration

Create a `.env` file from the template:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# ============================================
# AI Provider Configuration
# ============================================
# Use ONE of the following:

# Option 1: Google Gemini (Recommended for free tier)
GEMINI_KEY=your_gemini_api_key_here

# Option 2: Groq (Faster inference)
# GROQ_API_KEY=gsk_your_groq_key_here

# ============================================
# Prometheus Configuration
# ============================================
PROMETHEUS_URL=http://localhost:9090

# ============================================
# Server Configuration
# ============================================
PORT=8080

# ============================================
# Integrations (Optional)
# ============================================
# Slack webhook for alert notifications
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...

# ============================================
# Environment
# ============================================
APP_ENV=dev  # dev | prod
```

## 📖 Usage

### 1. Start the Monitoring Stack

First, spin up Prometheus and Node Exporter:

```bash
cd deployments
docker-compose up -d
```

Verify services are running:
```bash
docker ps
# Should show: pilot-db (prometheus) and pilot-source (node-exporter)
```

Access Prometheus UI: http://localhost:9090

### 2. Interactive Mode (`--ask`)

Ask natural language questions about your infrastructure:

```bash
# Basic usage
go run ./cmd/aegis --ask "What is the current CPU usage?"

# Multi-word queries
go run ./cmd/aegis --ask "Why is memory usage so high on my servers?"

# Trend analysis
go run ./cmd/aegis --ask "Show me the CPU trend over the last hour"
```

**Example Session:**
```
$ ./aegis --ask "What's the memory usage?"

🤖 Aegis SRE-Pilot
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Generated PromQL:
   node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes * 100

📈 Query Results:
   ┌─────────────────────┬────────────────┐
   │ Instance            │ Available (%)  │
   ├─────────────────────┼────────────────┤
   │ localhost:9100      │ 67.3%          │
   └─────────────────────┴────────────────┘

💡 Insight:
   Your system has 67.3% memory available (32.7% in use).
   This is well within normal operating parameters.
   No immediate action required.
```

### 3. Watchtower Mode (`--watch`)

Start the background daemon with API server:

```bash
go run ./cmd/aegis --watch
```

**What it does:**
- Starts HTTP API on `http://localhost:8080`
- Runs periodic health checks every 30 seconds
- Detects anomalies and can send Slack alerts
- Serves as backend for Web Console

**Output:**
```
🔭 Watchtower Mode Activated
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📡 API Server:     http://localhost:8080
🔄 Check Interval: 30s
📊 Prometheus:     http://localhost:9090

[00:00:00] ✓ Initial health check passed
[00:00:30] ✓ All metrics nominal
[00:01:00] ✓ All metrics nominal
...

Press Ctrl+C to stop
```

### 4. Dry Run (`--dry-run`)

Test configuration without making AI calls or modifying state:

```bash
go run ./cmd/aegis --dry-run
```

**Output:**
```
🧪 Dry Run Mode
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ Environment:     dev
✓ Prometheus:      http://localhost:9090 (connected)
✓ AI Provider:     Gemini (configured)
✓ Slack:           Not configured

All systems ready. Use --ask or --watch to begin.
```

## 📡 API Reference

When running in Watchtower mode, the following API endpoints are available:

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/chat` | Send a message to Aegis |
| `GET` | `/api/health` | Health check |
| `GET` | `/api/metrics` | Current system metrics |

### `POST /api/chat`

Send a natural language query.

**Request:**
```bash
curl -X POST http://localhost:8080/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What is the CPU usage?"}'
```

**Response:**
```json
{
  "response": "Your current CPU usage is 23.5%...",
  "promql": "100 - (avg(rate(node_cpu_seconds_total{mode=\"idle\"}[5m])) * 100)",
  "data": {
    "series": [
      {"instance": "localhost:9100", "value": 23.5}
    ]
  }
}
```

### `GET /api/health`

Check system health.

```bash
curl http://localhost:8080/api/health
```

**Response:**
```json
{
  "status": "healthy",
  "prometheus": "connected",
  "ai_provider": "gemini",
  "uptime": "2h 15m 30s"
}
```

## 🛠 Development

### Running Tests

```bash
# Run all tests
go test ./...

# Run with coverage
go test -cover ./...

# Verbose output
go test -v ./...
```

### Building Binary

```bash
# Development build
go build -o aegis ./cmd/aegis

# Production build (smaller binary)
go build -ldflags="-s -w" -o aegis ./cmd/aegis

# Cross-compile for Linux
GOOS=linux GOARCH=amd64 go build -o aegis-linux ./cmd/aegis
```

### Code Structure

| Package | Description |
|---------|-------------|
| `cmd/aegis` | CLI entrypoint, flag parsing |
| `internal/ai` | LLM client abstraction (Groq, Gemini) |
| `internal/monitor` | Prometheus query execution |
| `internal/watchtower` | Background monitoring loop |
| `internal/server` | HTTP handlers for Web Console |
| `internal/memory` | Conversation context storage |
| `internal/billing` | Token usage tracking |
| `internal/ui` | Terminal UI components |

## 🔧 Troubleshooting

### "Cannot connect to Prometheus"

```bash
# Check if containers are running
docker ps

# Check Prometheus logs
docker logs pilot-db

# Restart the stack
cd deployments
docker-compose down
docker-compose up -d
```

### "AI provider error"

1. Verify your API key in `.env`
2. Check API key permissions/quota
3. Try switching providers (Groq ↔ Gemini)

### "Port 8080 already in use"

```bash
# Find what's using the port
lsof -i :8080

# Use a different port
PORT=3000 go run ./cmd/aegis --watch
```

## 📄 License

MIT License - see [LICENSE](../LICENSE) for details.
