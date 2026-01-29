#!/bin/sh

# Set default values
export PORT=${PORT:-8080}
export API_PORT=${API_PORT:-8081}
# Force IPv4 to avoid [::1] connection refused issues
# We strictly use 127.0.0.1:9090 to prevent 'localhost' resolving to IPv6
export PROMETHEUS_URL=http://127.0.0.1:9090

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
fi

/usr/bin/prometheus --config.file=/etc/prometheus/prometheus.yml --storage.tsdb.path=/data/prometheus --web.listen-address=:9090 &
echo "   -> Prometheus starting..."
sleep 5
echo "   -> Prometheus is UP"

# 2. Start Aegis API Server
echo "🧠 Starting Aegis AI Backend on port $API_PORT..."
cd /app
./aegis --watch > /var/log/aegis.log 2>&1 &
sleep 2
echo "   -> Aegis API Server is UP"

# 3. Configure and Start Nginx
echo "🌐 Starting Nginx Web Server on port $PORT..."
# Replace variables in nginx.conf
envsubst '${PORT} ${API_PORT}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

echo "✅ All services started!"
echo "   Frontend: http://localhost:$PORT"
echo "   API:      http://localhost:$API_PORT"
echo "   Metrics:  http://localhost:9090"

# Start Nginx in foreground
nginx -g 'daemon off;'
