# SRE-Pilot

SRE-Pilot is an AI-powered SRE assistant that helps you monitor, diagnose, and fix infrastructure issues.

## Getting Started

### Prerequisites
- Docker & Docker Compose
- Go 1.21+

### Local Development Environment

1.  **Start Infrastructure**:
    ```bash
    docker-compose -f deployments/docker-compose.yml up -d
    ```
    This starts Prometheus (http://localhost:9090) and Node Exporter.

2.  **Environment Setup**:
    ```bash
    cp .env.example .env
    # Edit .env and add your GEMINI_KEY
    ```

3.  **Run CLI (Dry Run)**:
    ```bash
    go run ./cmd/aegis --dry-run
    ```

## Project Structure
- `cmd/aegis`: Main CLI entrypoint.
- `deployments/`: Docker compose and config files.
- `internal/`: Core application logic (AI, Monitor, Watchtower).
- `data/`: Local data storage (incidents, logs).

An AI-driven Observability Copilot for Prometheus
