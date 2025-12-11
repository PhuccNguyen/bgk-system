@echo off
REM Port Management Script for BGK System (Windows)

echo 🔍 Checking port 3000 usage...

REM Check if port 3000 is in use
netstat -ano | findstr :3000 > port_check.tmp

if %ERRORLEVEL% EQU 0 (
    echo ⚠️  Port 3000 is occupied:
    type port_check.tmp
    
    echo.
    echo 🔥 Killing processes on port 3000...
    
    REM Extract PIDs and kill them
    for /f "tokens=5" %%i in ('netstat -ano ^| findstr :3000') do (
        if not "%%i"=="0" (
            echo   Killing PID: %%i
            taskkill /PID %%i /F >nul 2>&1
        )
    )
    
    timeout /t 2 >nul
    
    REM Verify port is free
    netstat -ano | findstr :3000 > port_check_after.tmp
    if %ERRORLEVEL% NEQ 0 (
        echo ✅ Port 3000 is now free!
    ) else (
        echo ❌ Port 3000 still occupied
        del port_check.tmp port_check_after.tmp
        exit /b 1
    )
    
    del port_check_after.tmp
) else (
    echo ✅ Port 3000 is available
)

del port_check.tmp

echo.
echo 🚀 Starting BGK System on port 3000...
npm run dev