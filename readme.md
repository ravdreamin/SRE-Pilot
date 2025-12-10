
# Aegis | SRE-Pilot CLI

**Aegis** is the core intelligence engine of SRE-Pilot. It is a Go-based CLI tool that acts as an **AI-Powered Site Reliability Engineer**, bridging the gap between natural language intent and Prometheus observability data.

![License](https://img.shields.io/badge/license-MIT-blue)
![Go Version](https://img.shields.io/badge/go-1.25-teal)
![Status](https://img.shields.io/badge/status-experimental-orange)

## 🚀 Features

* **Interactive Mode (`--ask`)**: Translate natural language questions ("Why is the API slow?") into valid PromQL queries, execute them, and get a plain-English explanation of the results.
* **Watchtower Mode (`--watch`)**: Runs as a background daemon to proactively monitor metrics and host an API server.
* **Strict Safety**: Uses a specialized "SRE Persona" prompt to ensure generated queries are read-only and remediation commands are explicit.
* **Dry Run**: Test connectivity and configuration without executing AI queries.

## 🛠️ Architecture

Aegis connects to three key components:
1.  **Prometheus**: For fetching real-time infrastructure metrics.
2.  **LLM Provider (Groq)**: For parsing intent and generating PromQL/Remediation steps.
3.  **Local Environment**: Uses Docker to spin up a monitoring stack.

## 📋 Prerequisites

* **Go 1.25+**
* **Docker & Docker Compose**
* **Groq API Key** (Get one [here](https://console.groq.com))

## ⚡ Quick Start

### 1. Start the Infrastructure
Spin up a local Prometheus and Node Exporter instance using the provided compose file.

```bash
docker-compose -f deployments/docker-compose.yml up -d

**Environment Setup**:
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
