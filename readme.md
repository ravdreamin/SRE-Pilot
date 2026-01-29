# 📡 QryPilot

> **Prometheus queries, humanized.** Talk to your infrastructure in plain English and get PromQL back.

[![Go Version](https://img.shields.io/badge/Go-1.22+-00ADD8?style=flat-square&logo=go)](https://golang.org)
[![React](https://img.shields.io/badge/React-2024-61DAFB?style=flat-square&logo=react)](https://reactjs.org)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

QryPilot is a minimalist SRE tool designed to bridge the gap between human intuition and Prometheus metrics. It uses AI to translate natural language questions into valid PromQL queries, fetching and explaining results in real-time.

---

## ✨ Features

- **Natural Language to PromQL**: Ask questions like *"What is the memory usage of my nodes?"* or *"Why is latency spiking?"*.
- **Real-time Console**: A high-density dashboard for live system monitoring (CPU, Memory, RPS, P95).
- **AI Inference Engine**: Powered by Groq/Llama-3 for lightning-fast query translation.
- **Developer-Centric UI**: Minimalist, terminal-style interface built for distraction-free observability.
- **Portable Binary**: Built in Go, runs as a single daemon alongside your Prometheus stack.

---

## 🚀 Quick Start

### 1. Build the Engine
Requires Go 1.22+ installed.
```bash
git clone https://github.com/ravdreamin/QryPilot.git
cd QryPilot/cli
go build -o qrypilot ./cmd/aegis
```

### 2. Configure Environment
Create a `.env` file in the `cli` directory with your Groq API key:
```bash
echo "GROQ_API_KEY=your_key_here" > .env
```
*Don't have a key? Get one for free at [console.groq.com](https://console.groq.com).*

### 3. Start Infrastructure
Launch a local Prometheus instance:
```bash
cd deployments
docker-compose up -d
```

### 4. Run the Daemon
```bash
# Start the web API and monitoring loop
./qrypilot --watch
```

### 5. Launch the UI
```bash
cd ../frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) to access the console.

---

## 🛠 Tech Stack

- **Backend**: Go (Aegis Engine), Prometheus Client
- **Frontend**: React, Vite, Tailwind CSS, Lucide Icons
- **AI**: Groq (Llama-3-70b/8b)
- **Deployment**: Docker, Docker Compose

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with 💚 for SREs by [ravdreamin](https://github.com/ravdreamin)
