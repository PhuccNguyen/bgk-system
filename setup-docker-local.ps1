# BGK System Docker Setup Script for Windows PowerShell
# Optimized for bgk.tingnect.com with SEO features

Write-Host "🚀 BGK System Docker Setup - Optimized for bgk.tingnect.com" -ForegroundColor Green
Write-Host "==============================================================" -ForegroundColor Green

function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ️  $Message" -ForegroundColor Blue
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

# Check if Docker is installed
try {
    docker --version | Out-Null
    Write-Success "Docker is installed"
} catch {
    Write-Error "Docker is not installed. Please install Docker Desktop first."
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if Docker Compose is available
try {
    docker-compose --version | Out-Null
    Write-Success "Docker Compose is available"
} catch {
    Write-Error "Docker Compose is not available. Please install Docker Desktop with Compose."
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if .env.local exists
if (!(Test-Path ".env.local")) {
    Write-Warning ".env.local file not found. Please ensure it exists before continuing."
    Write-Info "The file should contain your Google Sheets configuration and other environment variables."
} else {
    Write-Success "Environment file found"
}

# Build the Docker image
Write-Info "Building Docker image for BGK System..."
try {
    docker-compose build
    Write-Success "Docker image built successfully"
} catch {
    Write-Error "Failed to build Docker image"
    Read-Host "Press Enter to exit"
    exit 1
}

# Start the containers
Write-Info "Starting BGK System containers..."
try {
    docker-compose up -d
    Write-Success "BGK System containers started successfully"
} catch {
    Write-Error "Failed to start containers"
    Read-Host "Press Enter to exit"
    exit 1
}

# Wait for the application to be ready
Write-Info "Waiting for application to be ready..."
Start-Sleep -Seconds 15

# Check if the application is responding
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/config" -UseBasicParsing -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Success "Application is ready and responding"
    }
} catch {
    Write-Warning "Application might still be starting up. Please check logs if needed."
}

Write-Host ""
Write-Host "🎉 BGK System Setup Complete!" -ForegroundColor Green
Write-Host "==============================================================" -ForegroundColor Green
Write-Info "Local Development: http://localhost:3000"
Write-Info "Production Domain: https://bgk.tingnect.com"
Write-Host ""
Write-Info "Useful Docker commands:"
Write-Host "  • View logs: docker-compose logs -f"
Write-Host "  • Stop system: docker-compose down"
Write-Host "  • Restart: docker-compose restart"
Write-Host "  • View status: docker-compose ps"
Write-Host ""
Write-Info "SEO Features Included:"
Write-Host "  • Optimized meta tags for bgk.tingnect.com"
Write-Host "  • Social media preview images"
Write-Host "  • Structured data for search engines"
Write-Host "  • Mobile-friendly viewport"
Write-Host "  • Fast loading with Next.js optimization"
Write-Host ""
Write-Success "Ready for development! 🚀"
Write-Host ""
Write-Info "Press Enter to open the application in your browser..."
Read-Host
Start-Process "http://localhost:3000"