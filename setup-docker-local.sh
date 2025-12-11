#!/bin/bash

# BGK System Docker Setup Script
# Optimized for bgk.tingnect.com with SEO features

echo "🚀 BGK System Docker Setup - Optimized for bgk.tingnect.com"
echo "=============================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

print_status "Docker and Docker Compose are installed"

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    print_warning ".env.local file not found. Creating a sample one..."
    cp .env.local.example .env.local 2>/dev/null || echo "Please create .env.local file manually"
fi

print_status "Environment file checked"

# Build the Docker image
print_info "Building Docker image for BGK System..."
docker-compose build

if [ $? -eq 0 ]; then
    print_status "Docker image built successfully"
else
    print_error "Failed to build Docker image"
    exit 1
fi

# Start the containers
print_info "Starting BGK System containers..."
docker-compose up -d

if [ $? -eq 0 ]; then
    print_status "BGK System containers started successfully"
else
    print_error "Failed to start containers"
    exit 1
fi

# Wait for the application to be ready
print_info "Waiting for application to be ready..."
sleep 10

# Check if the application is responding
if curl -f http://localhost:3000/api/config > /dev/null 2>&1; then
    print_status "Application is ready and responding"
else
    print_warning "Application might still be starting up. Please check logs if needed."
fi

echo ""
echo "🎉 BGK System Setup Complete!"
echo "=============================================================="
print_info "Local Development: http://localhost:3000"
print_info "Production Domain: https://bgk.tingnect.com"
echo ""
print_info "Useful Docker commands:"
echo "  • View logs: docker-compose logs -f"
echo "  • Stop system: docker-compose down"
echo "  • Restart: docker-compose restart"
echo "  • View status: docker-compose ps"
echo ""
print_info "SEO Features Included:"
echo "  • Optimized meta tags for bgk.tingnect.com"
echo "  • Social media preview images"
echo "  • Structured data for search engines"
echo "  • Mobile-friendly viewport"
echo "  • Fast loading with Next.js optimization"
echo ""
print_status "Ready for development! 🚀"