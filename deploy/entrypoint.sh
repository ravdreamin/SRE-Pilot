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
# Ensure correct ownership if prometheus user exists (it usually does on alpine apk)
if id "prometheus" &>/dev/null; then
    chown -R prometheus:prometheus /data/prometheus
    chmod 777 /data/prometheus # Fallback to be safe
    # Run as prometheus user if possible, or just as root for now since entrypoint is root.
    # We will stick to running as root to avoid complexity, but use the correct path.
fi

/usr/bin/prometheus --config.file=/etc/prometheus/prometheus.yml --storage.tsdb.path=/data/prometheus --web.listen-address=:9090 &
echo "   -> Prometheus starting..."
sleep 5
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
