# ==========================================
# Stage 1: Build Frontend (React)
# ==========================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ .
# Build for production
ENV VITE_API_URL=
RUN npm run build

# ==========================================
# Stage 2: Build Backend (Go)
# ==========================================
FROM golang:1.22-alpine AS backend-builder
WORKDIR /app/cli
COPY cli/go.mod cli/go.sum ./
RUN go mod download
COPY cli/ .
# Build binary
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o aegis ./cmd/aegis

# ==========================================
# Stage 3: Final Monolith Image
# ==========================================
FROM alpine:latest

# Install dependencies: Nginx, Prometheus, envsubst (gettext)
RUN apk add --no-cache nginx prometheus prometheus-node-exporter gettext ca-certificates tzdata && \
    mkdir -p /run/nginx

WORKDIR /app

# Copy Frontend Assets
COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html

# Copy Backend Binary
COPY --from=backend-builder /app/cli/aegis /app/aegis
COPY cli/.env.example /app/.env

# Copy Configs
COPY deploy/nginx.conf.template /etc/nginx/nginx.conf.template
COPY deploy/entrypoint.sh /app/entrypoint.sh
COPY cli/deployments/prometheus.yml /etc/prometheus/prometheus.yml

# Permissions
RUN chmod +x /app/entrypoint.sh && \
    mkdir -p /var/log /app/data && \
    touch /var/log/prometheus.log /var/log/aegis.log && \
    chmod 777 /var/log/prometheus.log /var/log/aegis.log

# Environment Variables
ENV PORT=8080
ENV API_PORT=8081
ENV GIN_MODE=release

# Expose the single port (Render/Fly will route to this)
EXPOSE 8080

# Start!
ENTRYPOINT ["/app/entrypoint.sh"]
