#!/bin/sh

# Set default values
export PORT=${PORT:-8080}
export API_PORT=${API_PORT:-8081}
# Force IPv4 to avoid [::1] connection refused issues
export PROMETHEUS_URL=${PROMETHEUS_URL:-http://127.0.0.1:9090}

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
echo "   -> Prometheus starting..."
sleep 5

# Check if Prometheus is still running
if ! pgrep -x "prometheus" > /dev/null; then
    echo "❌ Prometheus failed to start! Exiting..."
    exit 1
fi
echo "   -> Prometheus is UP"

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
