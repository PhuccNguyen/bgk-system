#!/bin/bash

# Script tự động deploy BGK System lên VPS

set -e

echo "🚀 BGK System - Auto Deploy Script"
echo "=================================="

# Kiểm tra Docker đã cài chưa
if ! command -v docker &> /dev/null; then
    echo "❌ Docker chưa được cài đặt. Đang cài đặt..."
    sudo apt update
    sudo apt install -y docker.io docker-compose
    sudo systemctl start docker
    sudo systemctl enable docker
    echo "✅ Docker đã được cài đặt"
fi

# Kiểm tra file .env.local
if [ ! -f .env.local ]; then
    echo "⚠️  File .env.local không tồn tại!"
    echo "Vui lòng tạo file .env.local với nội dung Google Sheets credentials"
    exit 1
fi

# Stop container cũ (nếu có)
echo "🛑 Stopping old containers..."
docker-compose down 2>/dev/null || true

# Build image mới
echo "🔨 Building Docker image..."
docker-compose build --no-cache

# Start container
echo "▶️  Starting container..."
docker-compose up -d

# Đợi container khởi động
echo "⏳ Waiting for container to be healthy..."
sleep 10

# Kiểm tra health
if docker-compose ps | grep -q "healthy"; then
    echo "✅ Container is running and healthy!"
    echo "🌐 Access: http://localhost:3000"
else
    echo "⚠️  Container started but health check pending..."
    echo "📋 Check logs: docker-compose logs -f"
fi

# Hiển thị status
echo ""
echo "📊 Container Status:"
docker-compose ps

echo ""
echo "🎉 Deploy completed!"
echo "📝 View logs: docker-compose logs -f"
echo "🛑 Stop: docker-compose down"
