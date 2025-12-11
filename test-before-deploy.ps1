# BGK System - Pre-deployment Test Script
Write-Host "🧪 BGK System Pre-deployment Tests" -ForegroundColor Green
Write-Host "===================================" -ForegroundColor Green

$testResults = @()

# Test 1: Container Health
Write-Host "`n1️⃣ Testing Container Health..." -ForegroundColor Yellow
try {
    $containerStatus = docker-compose ps --format json | ConvertFrom-Json
    if ($containerStatus.State -eq "running") {
        Write-Host "✅ Container is running" -ForegroundColor Green
        $testResults += "Container Health: PASS"
    } else {
        Write-Host "❌ Container is not running properly" -ForegroundColor Red
        $testResults += "Container Health: FAIL"
    }
} catch {
    Write-Host "❌ Container check failed: $($_.Exception.Message)" -ForegroundColor Red
    $testResults += "Container Health: FAIL"
}

# Test 2: API Config Endpoint
Write-Host "`n2️⃣ Testing API Config..." -ForegroundColor Yellow
try {
    $configResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/config" -TimeoutSec 10
    if ($configResponse.contestants) {
        Write-Host "✅ Config API working - Found contestants data" -ForegroundColor Green
        $testResults += "API Config: PASS"
    } else {
        Write-Host "⚠️ Config API responding but no contestants data" -ForegroundColor Yellow
        $testResults += "API Config: PARTIAL"
    }
} catch {
    Write-Host "❌ Config API failed: $($_.Exception.Message)" -ForegroundColor Red
    $testResults += "API Config: FAIL"
}

# Test 3: API Contestants Endpoint  
Write-Host "`n3️⃣ Testing API Contestants..." -ForegroundColor Yellow
try {
    $contestantsResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/contestants" -TimeoutSec 10
    Write-Host "✅ Contestants API working" -ForegroundColor Green
    $testResults += "API Contestants: PASS"
} catch {
    Write-Host "❌ Contestants API failed: $($_.Exception.Message)" -ForegroundColor Red
    $testResults += "API Contestants: FAIL"
}

# Test 4: Main Page Load
Write-Host "`n4️⃣ Testing Main Page..." -ForegroundColor Yellow
try {
    $mainPageResponse = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 10
    if ($mainPageResponse.StatusCode -eq 200) {
        Write-Host "✅ Main page loads successfully" -ForegroundColor Green
        $testResults += "Main Page: PASS"
    }
} catch {
    Write-Host "❌ Main page failed: $($_.Exception.Message)" -ForegroundColor Red
    $testResults += "Main Page: FAIL"
}

# Test 5: Test Page (Admin Panel)
Write-Host "`n5️⃣ Testing Admin Panel..." -ForegroundColor Yellow
try {
    $testPageResponse = Invoke-WebRequest -Uri "http://localhost:3000/test" -UseBasicParsing -TimeoutSec 10
    if ($testPageResponse.StatusCode -eq 200) {
        Write-Host "✅ Admin panel accessible" -ForegroundColor Green
        $testResults += "Admin Panel: PASS"
    }
} catch {
    Write-Host "❌ Admin panel failed: $($_.Exception.Message)" -ForegroundColor Red
    $testResults += "Admin Panel: FAIL"
}

# Test 6: Authentication Endpoint
Write-Host "`n6️⃣ Testing Authentication..." -ForegroundColor Yellow
try {
    $authResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/login" -Method POST -UseBasicParsing -TimeoutSec 10 -ContentType "application/json" -Body '{"username":"test","password":"test"}' -ErrorAction SilentlyContinue
    if ($authResponse.StatusCode -eq 401 -or $authResponse.StatusCode -eq 200) {
        Write-Host "✅ Authentication endpoint responding" -ForegroundColor Green
        $testResults += "Authentication: PASS"
    }
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✅ Authentication endpoint working (401 expected)" -ForegroundColor Green
        $testResults += "Authentication: PASS"
    } else {
        Write-Host "❌ Authentication failed: $($_.Exception.Message)" -ForegroundColor Red
        $testResults += "Authentication: FAIL"
    }
}

# Test Summary
Write-Host "`n📊 Test Results Summary" -ForegroundColor Green
Write-Host "======================" -ForegroundColor Green
foreach ($result in $testResults) {
    if ($result -like "*PASS*") {
        Write-Host "✅ $result" -ForegroundColor Green
    } elseif ($result -like "*PARTIAL*") {
        Write-Host "⚠️ $result" -ForegroundColor Yellow
    } else {
        Write-Host "❌ $result" -ForegroundColor Red
    }
}

# Final verdict
$failCount = ($testResults | Where-Object { $_ -like "*FAIL*" }).Count
$passCount = ($testResults | Where-Object { $_ -like "*PASS*" }).Count

Write-Host "`n🏁 Final Verdict" -ForegroundColor Cyan
Write-Host "===============" -ForegroundColor Cyan

if ($failCount -eq 0) {
    Write-Host "🎉 ALL TESTS PASSED! Ready for VPS deployment!" -ForegroundColor Green
    Write-Host "`n🚀 VPS Deployment Checklist:" -ForegroundColor Yellow
    Write-Host "   1. Update .env file with production values" -ForegroundColor White
    Write-Host "   2. Set NEXT_PUBLIC_SITE_URL=https://bgk.tingnect.com" -ForegroundColor White
    Write-Host "   3. Configure SSL certificates" -ForegroundColor White
    Write-Host "   4. Update Google Sheets credentials if needed" -ForegroundColor White
    Write-Host "   5. Test on VPS with same commands" -ForegroundColor White
} else {
    Write-Host "⚠️ $failCount test(s) failed. Fix issues before VPS deployment." -ForegroundColor Yellow
    Write-Host "✅ $passCount test(s) passed." -ForegroundColor Green
}

Write-Host "`n📋 Next Steps:" -ForegroundColor Cyan
Write-Host "   - View logs: docker-compose logs -f" -ForegroundColor White
Write-Host "   - Stop containers: docker-compose down" -ForegroundColor White
Write-Host "   - Open app: http://localhost:3000" -ForegroundColor White