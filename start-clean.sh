#!/bin/bash
# Port Management Script for BGK System

echo "🔍 Checking port 3000 usage..."

# Check if port 3000 is in use
PORT_CHECK=$(netstat -ano | findstr :3000)

if [ ! -z "$PORT_CHECK" ]; then
    echo "⚠️  Port 3000 is occupied:"
    echo "$PORT_CHECK"
    
    echo ""
    echo "🔥 Killing processes on port 3000..."
    
    # Extract PIDs and kill them
    PIDS=$(netstat -ano | findstr :3000 | awk '{print $5}' | sort -u | grep -v "0")
    
    for PID in $PIDS; do
        if [ "$PID" != "0" ]; then
            echo "  Killing PID: $PID"
            taskkill /PID $PID /F 2>/dev/null || echo "  Failed to kill PID: $PID"
        fi
    done
    
    sleep 2
    
    # Verify port is free
    PORT_CHECK_AFTER=$(netstat -ano | findstr :3000)
    if [ -z "$PORT_CHECK_AFTER" ]; then
        echo "✅ Port 3000 is now free!"
    else
        echo "❌ Port 3000 still occupied"
        exit 1
    fi
else
    echo "✅ Port 3000 is available"
fi

echo ""
echo "🚀 Starting BGK System on port 3000..."
npm run dev