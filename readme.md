<p align="center">
  <img src="https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg" width="60" alt="Aegis Logo">
</p>

<h1 align="center">Aegis | SRE-Pilot</h1>

<p align="center">
  <strong>An AI-Powered Autonomous Site Reliability Engineer</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#cli-reference">CLI Reference</a> •
  <a href="#web-console">Web Console</a> •
  <a href="#api-reference">API Reference</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-blue" alt="License">
  <img src="https://img.shields.io/badge/go-1.25+-teal" alt="Go Version">
  <img src="https://img.shields.io/badge/react-19-61dafb" alt="React Version">
  <img src="https://img.shields.io/badge/status-experimental-orange" alt="Status">
</p>

---

## 🎯 Overview

**Aegis SRE-Pilot** is an AI-driven observability copilot that bridges the gap between natural language and Prometheus metrics. It enables engineers to:

- 🗣️ **Ask questions in plain English** → Get PromQL queries + results + explanations
- 🔍 **Diagnose incidents faster** → AI analyzes metrics and suggests root causes
- 🛡️ **Proactive monitoring** → Background daemon detects anomalies before they escalate
- 🎛️ **Beautiful Web Console** → Modern UI for interacting with your infrastructure

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **Natural Language Queries** | Ask "Why is the API slow?" and get PromQL + results |
| **Interactive CLI** | Powerful command-line interface with `--ask` mode |
| **Watchtower Daemon** | Background monitoring with automatic anomaly detection |
| **Web Console** | Premium React-based UI with Google Material Design |
| **Multi-LLM Support** | Groq, Gemini, and OpenAI compatible |
| **Safety First** | Read-only query generation, explicit remediation approval |
| **Slack Integration** | Alert notifications to your team channels |

---

## 🚀 Quick Start

### Prerequisites

- **Go 1.25+** - [Download](https://golang.org/dl/)
- **Node.js 20+** - [Download](https://nodejs.org/)
- **Docker & Docker Compose** - [Download](https://www.docker.com/)
- **API Keys**:
  - [Groq API Key](https://console.groq.com) (recommended)
  - OR [Google Gemini Key](https://makersuite.google.com/app/apikey)

### Installation

```bash
# Clone the repository
git clone https://github.com/ravdreamin/SRE-Pilot.git
cd SRE-Pilot

# Install CLI dependencies
cd cli
go mod download

# Install UI dependencies
cd ../sre-pilot-ui
npm install
```

### Configuration

#### 1. Set up environment variables

```bash
cd cli
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# AI Provider (choose one)
GEMINI_KEY=your_gemini_api_key_here
# GROQ_API_KEY=gsk_your_groq_key_here

# Prometheus (local Docker setup)
PROMETHEUS_URL=http://localhost:9090

# Server Port
PORT=8080

# Slack Alerts (optional)
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...

# Environment
APP_ENV=dev
```

#### 2. Start the monitoring stack

```bash
cd cli/deployments
docker-compose up -d
```

This starts:
- **Prometheus** on `http://localhost:9090`
- **Node Exporter** on `http://localhost:9100`

#### 3. Verify the setup

```bash
# Test CLI configuration
cd cli
go run ./cmd/aegis --dry-run
```

Expected output:
```
✓ Configuration loaded
✓ Connected to Prometheus at http://localhost:9090
✓ AI provider configured
Dry run complete. Ready to query.
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        SRE-Pilot System                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐       │
│  │   Web UI    │────▶│  API Server │────▶│   Aegis     │       │
│  │  (React)    │     │  (Go HTTP)  │     │   (Core)    │       │
│  └─────────────┘     └─────────────┘     └─────────────┘       │
│        :5173              :8080               │                 │
│                                               │                 │
│                                               ▼                 │
│                           ┌─────────────────────────────┐       │
│                           │     Internal Modules        │       │
│                           ├─────────────────────────────┤       │
│                           │  • AI Router (LLM Client)   │       │
│                           │  • Monitor (Prometheus)     │       │
│                           │  • Watchtower (Daemon)      │       │
│                           │  • Memory (Context Store)   │       │
│                           │  • Billing (Usage Tracking) │       │
│                           └─────────────────────────────┘       │
│                                       │                         │
│                    ┌──────────────────┼──────────────────┐      │
│                    ▼                  ▼                  ▼      │
│            ┌─────────────┐   ┌─────────────┐   ┌─────────────┐  │
│            │ Prometheus  │   │  LLM APIs   │   │   Slack     │  │
│            │   :9090     │   │(Groq/Gemini)│   │  Webhooks   │  │
│            └─────────────┘   └─────────────┘   └─────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Directory Structure

```
SRE-Pilot/
├── cli/                          # Go CLI & Backend
│   ├── cmd/
│   │   └── aegis/
│   │       └── main.go          # CLI entrypoint
│   ├── internal/
│   │   ├── ai/                  # LLM integration (Groq, Gemini)
│   │   │   ├── client.go        # AI client wrapper
│   │   │   └── router.go        # Provider routing
│   │   ├── billing/             # Usage tracking
│   │   ├── memory/              # Conversation context
│   │   ├── monitor/             # Prometheus client
│   │   ├── server/              # HTTP API handlers
│   │   ├── ui/                  # TUI components
│   │   └── watchtower/          # Background daemon
│   ├── deployments/
│   │   ├── docker-compose.yml   # Prometheus + Node Exporter
│   │   └── prometheus.yml       # Prometheus config
│   ├── data/                    # Persistent storage
│   ├── .env.example             # Environment template
│   └── go.mod                   # Go dependencies
│
├── sre-pilot-ui/                # React Web Console
│   ├── src/
│   │   ├── components/
│   │   │   └── Layout.jsx       # App shell with navigation
│   │   ├── pages/
│   │   │   ├── Hero.jsx         # Landing page
│   │   │   ├── Console.jsx      # Chat interface
│   │   │   └── Docs.jsx         # Documentation page
│   │   ├── App.jsx              # Router setup
│   │   ├── theme.js             # MUI theme configuration
│   │   └── main.jsx             # React entrypoint
│   ├── package.json             # NPM dependencies
│   └── vite.config.js           # Build configuration
│
└── README.md                    # This file
```

---

## 💻 CLI Reference

### Installation

```bash
cd cli
go build -o aegis ./cmd/aegis
```

### Commands

#### Interactive Mode (`--ask`)

Ask questions in natural language:

```bash
# Single question
./aegis --ask "What's the current CPU usage?"

# Follow-up questions
./aegis --ask "Why is it so high?"
./aegis --ask "Show me the last hour of data"
```

**Example Session:**
```
You: What's the current memory usage across all nodes?

Aegis: I'll query Prometheus for memory metrics.

📊 Generated PromQL:
node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes * 100

📈 Results:
┌──────────────────┬─────────────┐
│ Instance         │ Memory Free │
├──────────────────┼─────────────┤
│ localhost:9100   │ 45.2%       │
└──────────────────┴─────────────┘

💡 Explanation:
Your node currently has 45.2% of memory available. This is within
normal operating range. No action required.
```

#### Watchtower Mode (`--watch`)

Start the background daemon and API server:

```bash
./aegis --watch

# Or with custom port
PORT=3000 ./aegis --watch
```

**Output:**
```
🔭 Watchtower initialized
📡 API server running at http://localhost:8080
🔄 Monitoring loop started (interval: 30s)

Press Ctrl+C to stop
```

#### Dry Run (`--dry-run`)

Test configuration without making AI calls:

```bash
./aegis --dry-run
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GEMINI_KEY` | Google Gemini API key | - |
| `GROQ_API_KEY` | Groq API key | - |
| `PROMETHEUS_URL` | Prometheus server URL | `http://localhost:9090` |
| `PORT` | API server port | `8080` |
| `SLACK_WEBHOOK_URL` | Slack notifications | - |
| `APP_ENV` | Environment (dev/prod) | `dev` |

---

## 🌐 Web Console

The SRE-Pilot Web Console is a premium React application built with:

- **React 19** - Latest React with concurrent features
- **Material UI 7** - Google Material Design components
- **Framer Motion** - Smooth animations
- **Vite** - Lightning-fast builds

### Running the Console

```bash
cd sre-pilot-ui

# Development mode (hot reload)
npm run dev

# Production build
npm run build
npm run preview
```

**Development server:** `http://localhost:5173`

### Features

| Page | Route | Description |
|------|-------|-------------|
| **Home** | `/` | Landing page with product overview |
| **Console** | `/console` | Interactive chat with Aegis |
| **Documentation** | `/docs` | Usage guides and API reference |

### UI Architecture

```jsx
// App.jsx - Route structure
<Routes>
  <Route element={<Layout />}>
    <Route path="/" element={<Hero />} />
    <Route path="/console" element={<Console />} />
    <Route path="/docs" element={<Docs />} />
  </Route>
</Routes>
```

---

## 📡 API Reference

The Aegis API is exposed when running in Watchtower mode (`--watch`).

### Base URL

```
http://localhost:8080/api
```

### Endpoints

#### `POST /api/chat`

Send a message to Aegis.

**Request:**
```json
{
  "message": "What's the current CPU usage?",
  "context": []
}
```

**Response:**
```json
{
  "response": "Based on the metrics...",
  "promql": "100 - (avg(irate(node_cpu_seconds_total{mode=\"idle\"}[5m])) * 100)",
  "results": [
    {"instance": "localhost:9100", "value": "23.5%"}
  ],
  "timestamp": "2024-12-21T00:30:00Z"
}
```

#### `GET /api/health`

Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "prometheus": "connected",
  "uptime": "2h 15m"
}
```

#### `GET /api/metrics`

Get current system metrics snapshot.

**Response:**
```json
{
  "cpu": 23.5,
  "memory": 54.8,
  "disk": 42.1,
  "timestamp": "2024-12-21T00:30:00Z"
}
```

---

## 🐳 Docker Deployment

### Development Stack

```bash
cd cli/deployments
docker-compose up -d
```

**Services:**
- `prometheus` - Metrics database (`:9090`)
- `node-exporter` - System metrics collector (`:9100`)

### Production Deployment

```bash
# Build CLI binary
cd cli
GOOS=linux GOARCH=amd64 go build -o aegis ./cmd/aegis

# Build UI
cd ../sre-pilot-ui
npm run build
```

---

## 🧪 Development

### Running Tests

```bash
# CLI tests
cd cli
go test ./...

# UI tests
cd sre-pilot-ui
npm run lint
```

### Building for Production

```bash
# Build CLI
cd cli
go build -ldflags="-s -w" -o aegis ./cmd/aegis

# Build UI
cd ../sre-pilot-ui
npm run build
```

### Code Style

- **Go**: Follow [Effective Go](https://golang.org/doc/effective_go)
- **React**: ESLint with React Hooks rules
- **Commits**: Conventional Commits format

---

## 🔧 Troubleshooting

### Common Issues

#### "Cannot connect to Prometheus"

```bash
# Check if Prometheus is running
docker ps | grep prometheus

# Restart if needed
cd cli/deployments
docker-compose restart prometheus
```

#### "AI provider not configured"

Ensure you have set either `GEMINI_KEY` or `GROQ_API_KEY` in your `.env` file.

#### "Port already in use"

```bash
# Find process using port 8080
lsof -i :8080

# Kill it or use a different port
PORT=3000 ./aegis --watch
```

#### Web Console not loading

```bash
# Clear node modules and reinstall
cd sre-pilot-ui
rm -rf node_modules
npm install
npm run dev
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/ravdreamin/SRE-Pilot/issues)
- **Discussions**: [GitHub Discussions](https://github.com/ravdreamin/SRE-Pilot/discussions)

---

<p align="center">
  Built with ❤️ by the SRE-Pilot Team
</p>
