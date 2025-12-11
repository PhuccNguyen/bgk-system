#!/bin/bash

echo "🔍 VPS Environment Debug Script"
echo "================================="

echo "📅 Server Date & Time:"
date
echo "UTC: $(date -u)"
echo "Timezone: $(timedatectl | grep "Time zone" || echo $TZ)"

echo -e "\n🐳 Docker Container Info:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo -e "\n📊 Container Health:"
CONTAINER_ID=$(docker ps -q --filter "name=bgk-system")
if [ ! -z "$CONTAINER_ID" ]; then
    docker inspect $CONTAINER_ID --format='Health Status: {{.State.Health.Status}}'
    echo "Container Timezone: $(docker exec $CONTAINER_ID date)"
    echo "Container UTC: $(docker exec $CONTAINER_ID date -u)"
else
    echo "❌ BGK Container not found"
fi

echo -e "\n🌐 Network Test:"
curl -s -o /dev/null -w "Config API: %{http_code} (Time: %{time_total}s)\n" http://localhost:3000/api/config
curl -s -o /dev/null -w "Contestants API: %{http_code} (Time: %{time_total}s)\n" http://localhost:3000/api/contestants

echo -e "\n📋 Recent Container Logs:"
docker logs --tail=20 --timestamps $(docker ps -q --filter "name=bgk-system")

echo -e "\n🔧 Environment Variables Check:"
docker exec $(docker ps -q --filter "name=bgk-system") printenv | grep -E "(NODE_ENV|TZ|NEXT_PUBLIC)"

echo -e "\n📈 System Resources:"
echo "Memory: $(free -h | grep Mem)"
echo "Disk: $(df -h / | tail -1)"
echo "Load: $(uptime | awk -F'load average:' '{print $2}')"