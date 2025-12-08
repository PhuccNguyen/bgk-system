// Test Google Sheets API connection
const crypto = require('crypto');
require('dotenv').config({ path: '.env.local' });

async function getAccessToken() {
  const jwtHeader = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  
  const now = Math.floor(Date.now() / 1000);
  const jwtClaimSet = {
    iss: process.env.GOOGLE_CLIENT_EMAIL,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };
  
  const jwtClaimSetEncoded = Buffer.from(JSON.stringify(jwtClaimSet)).toString('base64url');
  const signatureInput = `${jwtHeader}.${jwtClaimSetEncoded}`;
  
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n') || '';
  
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(signatureInput);
  const signature = sign.sign(privateKey, 'base64url');
  
  const jwt = `${signatureInput}.${signature}`;
  
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });
  
  const data = await response.json();
  return data;
}

async function testFetchJudges() {
  console.log('🔐 Testing Google Sheets API...\n');
  
  console.log('📋 Environment Variables:');
  console.log('  GOOGLE_SHEET_ID:', process.env.GOOGLE_SHEET_ID);
  console.log('  GOOGLE_CLIENT_EMAIL:', process.env.GOOGLE_CLIENT_EMAIL);
  console.log('  GOOGLE_PRIVATE_KEY:', process.env.GOOGLE_PRIVATE_KEY ? 'EXISTS' : 'MISSING');
  console.log('');
  
  try {
    const tokenData = await getAccessToken();
    
    if (tokenData.error) {
      console.error('❌ Error getting access token:', tokenData);
      return;
    }
    
    console.log('✅ Access token obtained:', tokenData.access_token.substring(0, 20) + '...');
    console.log('');
    
    const SHEET_ID = process.env.GOOGLE_SHEET_ID;
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/JUDGES!A2:D100`,
      {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
        },
      }
    );
    
    console.log('📡 Response status:', response.status);
    
    const data = await response.json();
    
    if (data.error) {
      console.error('❌ Error fetching judges:', data.error);
      return;
    }
    
    console.log('✅ Data received:', JSON.stringify(data, null, 2));
    console.log('');
    
    if (data.values) {
      console.log('👥 Judges found:');
      data.values.forEach((row, idx) => {
        console.log(`  ${idx + 1}. USERNAME: "${row[0]}" | HASH: ${row[1]?.substring(0, 20)}... | NAME: ${row[2]} | STATUS: ${row[3]}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testFetchJudges();
