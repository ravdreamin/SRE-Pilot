#!/bin/sh

# Set default values
export PORT=${PORT:-8080}
export API_PORT=${API_PORT:-8081}
export PROMETHEUS_URL=http://localhost:9090

echo "🚀 Starting SRE-Pilot System..."

# 1. Start Prometheus
echo "📊 Starting Prometheus..."
# Ensure prometheus user exists or just run as current user if compatible
mkdir -p /data/prometheus
# Start Node Exporter
/usr/bin/node_exporter &
echo "   -> Node Exporter started on :9100"

# Start Prometheus
/bin/prometheus --config.file=/etc/prometheus/prometheus.yml --storage.tsdb.path=/data/prometheus --web.listen-address=:9090 &
echo "   -> Prometheus started on :9090"

# 2. Start Aegis API
echo "🧠 Starting Aegis AI Backend..."
# We use nohup to keep it running
/app/aegis --watch &
echo "   -> Aegis API started on :$API_PORT"

# 3. Configure and Start Nginx
echo "🌐 Starting Nginx Web Server on port $PORT..."
# Replace variables in nginx.conf
envsubst '${PORT} ${API_PORT}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Start Nginx in foreground
nginx -g 'daemon off;'
