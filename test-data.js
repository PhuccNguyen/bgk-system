// Test script để kiểm tra dữ liệu Config và Thí sinh
const crypto = require('crypto');
require('dotenv').config({ path: '.env.local' });

function base64ToBase64Url(base64) {
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function getAccessToken() {
  const jwtHeader = base64ToBase64Url(
    Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64')
  );
  
  const now = Math.floor(Date.now() / 1000);
  const jwtClaimSet = {
    iss: process.env.GOOGLE_CLIENT_EMAIL,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };
  
  const jwtClaimSetEncoded = base64ToBase64Url(
    Buffer.from(JSON.stringify(jwtClaimSet)).toString('base64')
  );
  
  const signatureInput = `${jwtHeader}.${jwtClaimSetEncoded}`;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n') || '';
  
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(signatureInput);
  const signature = base64ToBase64Url(sign.sign(privateKey, 'base64'));
  
  const jwt = `${signatureInput}.${signature}`;
  
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });
  
  const data = await response.json();
  return data.access_token;
}

async function testData() {
  console.log('🔍 Testing Google Sheets Data...\n');
  
  const SHEET_ID = process.env.GOOGLE_SHEET_ID;
  const token = await getAccessToken();
  
  // 1. Test CONFIG
  console.log('📋 CONFIG Tab:');
  console.log('='.repeat(50));
  const configResponse = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/CONFIG!A2:B100`,
    { headers: { 'Authorization': `Bearer ${token}` } }
  );
  const configData = await configResponse.json();
  
  if (configData.values) {
    const configMap = {};
    configData.values.forEach(row => {
      configMap[row[0]] = row[1];
      console.log(`  ${row[0]}: ${row[1]}`);
    });
    console.log('');
    
    console.log('🎯 Parsed Config:');
    console.log(`  CURRENT_ROUND: ${configMap.CURRENT_ROUND || 'MISSING'}`);
    console.log(`  CURRENT_SEGMENT: ${configMap.CURRENT_SEGMENT || 'MISSING'}`);
    console.log(`  CURRENT_BATCH: ${configMap.CURRENT_BATCH || 'MISSING'}`);
    console.log(`  ON_STAGE_SBD: "${configMap.ON_STAGE_SBD || 'MISSING'}"`);
    console.log(`  IS_LOCKED: ${configMap.IS_LOCKED || 'MISSING'}`);
    console.log('');
  } else {
    console.log('  ❌ No data found!');
  }
  
  // 2. Test THI_SINH
  console.log('👥 THI_SINH Tab:');
  console.log('='.repeat(50));
  const contestantResponse = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/THI_SINH!A2:D100`,
    { headers: { 'Authorization': `Bearer ${token}` } }
  );
  const contestantData = await contestantResponse.json();
  
  if (contestantData.values) {
    console.log(`  Found ${contestantData.values.length} contestants:\n`);
    contestantData.values.forEach((row, idx) => {
      console.log(`  ${idx + 1}. SBD: "${row[0]}" | Name: ${row[1]} | Status: ${row[3]}`);
    });
    console.log('');
    
    const activeContestants = contestantData.values.filter(row => row[3] === 'ACTIVE');
    console.log(`  ✅ Active contestants: ${activeContestants.length}`);
    
    // Check ON_STAGE
    if (configData.values) {
      const configMap = {};
      configData.values.forEach(row => { configMap[row[0]] = row[1]; });
      
      const onStageSBDs = (configMap.ON_STAGE_SBD || '').split(',').map(s => s.trim()).filter(s => s);
      console.log(`  🎭 ON_STAGE_SBD list: [${onStageSBDs.join(', ')}]`);
      
      const onStageContestants = contestantData.values.filter(row => 
        onStageSBDs.includes(row[0])
      );
      
      console.log(`  🎭 Contestants on stage: ${onStageContestants.length}`);
      if (onStageContestants.length > 0) {
        onStageContestants.forEach(row => {
          console.log(`     → SBD: "${row[0]}" | Name: ${row[1]}`);
        });
      } else {
        console.log('     ⚠️  No contestants on stage!');
        if (onStageSBDs.length > 0) {
          console.log(`     ⚠️  Check if SBDs match exactly: [${onStageSBDs.join(', ')}]`);
        }
      }
    }
  } else {
    console.log('  ❌ No data found!');
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('💡 Tips:');
  console.log('  - IS_LOCKED phải là TRUE hoặc FALSE (viết hoa)');
  console.log('  - ON_STAGE_SBD format: "001,002,003" (phân cách bằng dấu phẩy)');
  console.log('  - SBD trong THI_SINH phải khớp chính xác với ON_STAGE_SBD');
  console.log('  - STATUS phải là "ACTIVE" (viết hoa)');
}

testData().catch(console.error);
