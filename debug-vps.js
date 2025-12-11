// Script để debug VPS issues
// Chạy trên browser console tại bgk.tingnect.com

console.log('🔍 VPS Debug Script Started');

// 1. Kiểm tra environment
console.log('🌐 Environment Info:');
console.log('URL:', window.location.href);
console.log('Protocol:', window.location.protocol);
console.log('Host:', window.location.host);
console.log('Timezone:', Intl.DateTimeFormat().resolvedOptions().timeZone);
console.log('User Agent:', navigator.userAgent);

// 2. Kiểm tra localStorage
console.log('\n💾 LocalStorage Info:');
console.log('localStorage available:', typeof Storage !== 'undefined');
console.log('BGK Session:', localStorage.getItem('bgk_session'));

// 3. Test session validation
const session = localStorage.getItem('bgk_session');
if (session) {
  try {
    const sessionData = JSON.parse(session);
    console.log('\n🔐 Session Data:');
    console.log('Username:', sessionData.username);
    console.log('Expires At:', new Date(sessionData.expiresAt).toISOString());
    console.log('Time Left:', Math.round((sessionData.expiresAt - Date.now()) / 1000 / 60), 'minutes');
    console.log('Token:', sessionData.token);
    
    // 4. Test token generation (client-side)
    const secret = 'BGK_SECRET_2025'; // Default secret
    const utcDate = new Date().toISOString().split('T')[0];
    const data = `${sessionData.username}:${secret}:${utcDate}`;
    
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    const expectedToken = Math.abs(hash).toString(36);
    
    console.log('\n🎫 Token Validation:');
    console.log('UTC Date:', utcDate);
    console.log('Token Data:', data);
    console.log('Expected Token:', expectedToken);
    console.log('Actual Token:', sessionData.token);
    console.log('Token Match:', sessionData.token === expectedToken);
    
  } catch (error) {
    console.error('❌ Session parsing error:', error);
  }
}

// 5. Test API endpoints
console.log('\n🌐 Testing API Endpoints...');

async function testAPI(endpoint) {
  try {
    const response = await fetch(endpoint);
    console.log(`✅ ${endpoint}: ${response.status} ${response.statusText}`);
    
    if (endpoint.includes('/config')) {
      const data = await response.json();
      console.log('Config data:', data);
    }
  } catch (error) {
    console.error(`❌ ${endpoint}:`, error.message);
  }
}

testAPI('/api/config');
testAPI('/api/contestants');

// 6. Monitor for automatic logouts
let logoutCount = 0;
const originalClearSession = localStorage.removeItem;
localStorage.removeItem = function(key) {
  if (key === 'bgk_session') {
    logoutCount++;
    console.log(`🚨 Session cleared! Count: ${logoutCount}`);
    console.trace('Session clear trace:');
  }
  return originalClearSession.call(this, key);
};

console.log('\n✅ VPS Debug Script Complete - Monitoring for issues...');