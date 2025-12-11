# BGK System Docker Quick Setup
Write-Host "Starting BGK System Docker Setup..." -ForegroundColor Green

# Stop existing containers
Write-Host "Stopping existing containers..." -ForegroundColor Yellow
docker-compose down --remove-orphans

# Build and start
Write-Host "Building and starting containers..." -ForegroundColor Yellow  
docker-compose up --build -d

# Wait for startup
Write-Host "Waiting for application to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Check status
Write-Host "Checking container status..." -ForegroundColor Yellow
docker-compose ps

# Test endpoints
Write-Host "`nTesting API endpoints..." -ForegroundColor Green

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/config" -TimeoutSec 10
    Write-Host "✅ API Config endpoint working" -ForegroundColor Green
} catch {
    Write-Host "❌ API Config endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
}

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/contestants" -TimeoutSec 10  
    Write-Host "✅ API Contestants endpoint working" -ForegroundColor Green
} catch {
    Write-Host "❌ API Contestants endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎉 Setup Complete!" -ForegroundColor Green
Write-Host "🌐 Application URL: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔧 Test Panel: http://localhost:3000/test" -ForegroundColor Cyan
Write-Host "`n📋 Useful Commands:" -ForegroundColor Yellow
Write-Host "   View logs: docker-compose logs -f" -ForegroundColor White
Write-Host "   Stop: docker-compose down" -ForegroundColor White
Write-Host "   Restart: docker-compose restart" -ForegroundColor White