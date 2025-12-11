// VPS Production Debugging Script
// Run this in browser console on bgk.tingnect.com

console.log('🔍 VPS Debug Analysis Starting...');

// Environment Analysis
const envInfo = {
  domain: window.location.host,
  protocol: window.location.protocol,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  timezoneOffset: new Date().getTimezoneOffset(),
  utcDate: new Date().toISOString().split('T')[0],
  localDate: new Date().toLocaleDateString('sv-SE'), // YYYY-MM-DD format
  userAgent: navigator.userAgent,
  isProduction: window.location.host.includes('tingnect.com'),
  hasLocalStorage: !!window.localStorage,
  hasSessionStorage: !!window.sessionStorage
};

console.log('🌐 Environment Info:', envInfo);

// Storage Analysis
const storageInfo = {
  localStorage: {
    available: !!window.localStorage,
    bgkSession: localStorage.getItem('bgk_session'),
    itemCount: localStorage.length
  },
  sessionStorage: {
    available: !!window.sessionStorage,
    bgkSession: sessionStorage.getItem('bgk_session'),
    itemCount: sessionStorage.length
  }
};

console.log('💾 Storage Analysis:', storageInfo);

// If session exists, analyze it
const sessionStr = localStorage.getItem('bgk_session') || sessionStorage.getItem('bgk_session');
if (sessionStr) {
  try {
    const session = JSON.parse(sessionStr);
    const now = Date.now();
    
    const sessionAnalysis = {
      username: session.username,
      tokenPresent: !!session.token,
      tokenLength: session.token?.length || 0,
      expiresAt: session.expiresAt,
      expiresAtReadable: new Date(session.expiresAt).toISOString(),
      timeLeftMs: session.expiresAt - now,
      timeLeftMinutes: Math.round((session.expiresAt - now) / 60000),
      isExpired: session.expiresAt < now,
      hasImage: !!session.image,
      imageUrl: session.image?.substring(0, 50) + '...'
    };
    
    console.log('📋 Session Analysis:', sessionAnalysis);
    
    // Test token generation
    const testTokenData = {
      username: session.username,
      utcDate: envInfo.utcDate,
      localDate: envInfo.localDate,
      dataString: `${session.username}:BGK_TINGNECT_SECURE_2024_LOCAL_DEV_TOKEN_v2:${envInfo.utcDate}`,
      environment: envInfo.isProduction ? 'PRODUCTION' : 'DEVELOPMENT'
    };
    
    console.log('🎫 Token Generation Test:', testTokenData);
    
  } catch (error) {
    console.error('❌ Session parsing error:', error);
  }
} else {
  console.log('🚫 No session found in storage');
}

// Network Test
console.log('🌐 Testing API connectivity...');

fetch('/api/config', { 
  method: 'HEAD',
  cache: 'no-cache'
})
.then(response => {
  console.log('✅ API Test Result:', {
    status: response.status,
    ok: response.ok,
    headers: Object.fromEntries(response.headers.entries())
  });
})
.catch(error => {
  console.error('❌ API Test Failed:', error);
});

// Login Test Function
window.testVPSLogin = async function(username, password) {
  console.log('🔐 Testing VPS Login...'); 
  
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    
    const result = await response.json();
    
    console.log('🔐 Login Test Result:', {
      status: response.status,
      success: result.success,
      session: result.session,
      message: result.message
    });
    
    return result;
  } catch (error) {
    console.error('❌ Login Test Failed:', error);
    return { error: error.message };
  }
};

console.log('🎯 VPS Debug Complete. Use testVPSLogin("username", "password") to test login');
console.log('📊 All debug info logged above ☝️');

// Auto-monitor for session changes
let sessionMonitor;
window.startSessionMonitor = function() {
  if (sessionMonitor) clearInterval(sessionMonitor);
  
  console.log('👁️ Starting session monitor...');
  sessionMonitor = setInterval(() => {
    const currentSession = localStorage.getItem('bgk_session') || sessionStorage.getItem('bgk_session');
    if (currentSession) {
      try {
        const session = JSON.parse(currentSession);
        const timeLeft = Math.round((session.expiresAt - Date.now()) / 60000);
        console.log(`⏰ Session check: ${session.username} - ${timeLeft} mins left`);
        
        if (timeLeft <= 0) {
          console.warn('🚨 Session has expired!');
        } else if (timeLeft <= 2) {
          console.warn('⚠️ Session will expire in', timeLeft, 'minutes');
        }
      } catch (e) {
        console.error('❌ Session monitor parse error:', e);
      }
    } else {
      console.log('🚫 Session monitor: No active session');
    }
  }, 30000); // Check every 30 seconds
};

window.stopSessionMonitor = function() {
  if (sessionMonitor) {
    clearInterval(sessionMonitor);
    console.log('⏹️ Session monitor stopped');
  }
};