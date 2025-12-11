import { Config, Contestant, RawScore, Judge } from './types';

const SHEET_ID = process.env.GOOGLE_SHEET_ID || '';

// Helper: Convert base64 to base64url
function base64ToBase64Url(base64: string): string {
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Helper function to get access token from Service Account
export async function getAccessToken(): Promise<string> {
  // Only run on server-side
  if (typeof window !== 'undefined') {
    console.error('❌ getAccessToken cannot run in browser');
    return '';
  }
  
  try {
    const crypto = require('crypto');
    
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
    
    if (data.error) {
      console.error('❌ Error getting access token:', data);
      return '';
    }
    
    return data.access_token || '';
  } catch (error) {
    console.error('❌ Error in getAccessToken:', error);
    return '';
  }
}

// Fetch with authentication
async function authenticatedFetch(url: string, options: RequestInit = {}) {
  const token = await getAccessToken();
  
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    },
  });
}

// Fetch Config từ Sheet
export async function fetchConfig(): Promise<Config> {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/CONFIG!A2:B100`;
    const response = await authenticatedFetch(url);
    const data = await response.json();
    
    const configMap: any = {};
    data.values?.forEach((row: string[]) => {
      configMap[row[0]] = row[1];
    });

    return {
      CURRENT_ROUND: configMap.CURRENT_ROUND || 'CK1',
      CURRENT_SEGMENT: configMap.CURRENT_SEGMENT || 'DA_HOI',
      CURRENT_BATCH: configMap.CURRENT_BATCH || '',
      ON_STAGE_SBD: configMap.ON_STAGE_SBD || '',
      IS_LOCKED: configMap.IS_LOCKED === 'TRUE',
    };
  } catch (error) {
    console.error('Error fetching config:', error);
    throw error;
  }
}

// Fetch danh sách thí sinh
export async function fetchContestants(): Promise<Contestant[]> {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/THI_SINH!A2:D100`;
    const response = await authenticatedFetch(url);
    const data = await response.json();
    
    return data.values?.map((row: string[]) => ({
      SBD: row[0],
      HO_TEN: row[1],
      IMAGE_URL: row[2],
      STATUS: row[3] as 'ACTIVE' | 'ELIMINATED',
    })) || [];
  } catch (error) {
    console.error('Error fetching contestants:', error);
    throw error;
  }
}

// Fetch điểm đã chấm
// Sửa hàm fetchMyScores - đổi judgeId → username
export async function fetchMyScores(
  username: string,  // ĐỔI TÊN THAM SỐ
  segment: string,
  batchId: string
): Promise<{ [sbd: string]: number }> {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/RAW_DATA!A2:F10000`;
    const response = await authenticatedFetch(url);
    const data = await response.json();
    
    const scores: { [sbd: string]: number } = {};
    
    data.values?.forEach((row: string[]) => {
      const [timestamp, judge, sbd, seg, batch, score] = row;
      
      // So sánh username (lowercase)
      if (judge.toLowerCase() === username.toLowerCase() && seg === segment && batch === batchId) {
        scores[sbd] = parseFloat(score);
      }
    });
    
    return scores;
  } catch (error) {
    console.error('Error fetching scores:', error);
    return {};
  }
}
// Fetch danh sách Giám Khảo
export async function fetchJudges(): Promise<Judge[]> {
  try {
    console.log('🔍 [googleSheets] Fetching judges from SHEET_ID:', SHEET_ID);
    
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/JUDGES!A2:E100`;
    const response = await authenticatedFetch(url);
    
    console.log('📡 [googleSheets] Response status:', response.status);
    
    const data = await response.json();
    console.log('📊 [googleSheets] Data:', data);
    
    if (!data.values) {
      console.error('❌ [googleSheets] No values in response');
      return [];
    }
    
    const judges = data.values
      .filter((row: string[]) => {
        // Chỉ lấy các row có USERNAME và PASSWORD_HASH
        return row[0]?.trim() && row[1]?.trim();
      })
      .map((row: string[]) => ({
        USERNAME: row[0]?.trim().toLowerCase(),  // A: USERNAME
        PASSWORD_HASH: row[1]?.trim(),           // B: PASSWORD_HASH  
        FULL_NAME: row[2]?.trim() || row[0]?.trim(), // C: FULL_NAME (fallback to USERNAME)
        IMAGE_URL_BGK: row[3]?.trim() || '',     // D: IMAGE_URL_BGK
        STATUS: (row[4]?.trim() || 'ACTIVE') as 'ACTIVE' | 'INACTIVE', // E: STATUS
      }));
    
    console.log('👥 [googleSheets] Valid judges found:', judges.length);
    console.log('👥 [googleSheets] Judges data:', judges.map((j: Judge) => `${j.USERNAME} - ${j.FULL_NAME} - IMG: ${j.IMAGE_URL_BGK ? 'YES' : 'NO'}`));
    
    // Debug cụ thể cho judges có hình
    const judgesWithImages = judges.filter((j: Judge) => j.IMAGE_URL_BGK);
    console.log('🖼️ [googleSheets] Judges with images:', judgesWithImages.map((j: Judge) => ({ 
      username: j.USERNAME, 
      image: j.IMAGE_URL_BGK ? j.IMAGE_URL_BGK.substring(0, 50) + '...' : 'NO IMAGE'
    })));
    return judges;
  } catch (error) {
    console.error('❌ [googleSheets] Error fetching judges:', error);
    return [];
  }
}

// Sửa hàm submitScore
export async function submitScore(
  score: RawScore,
  authToken: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const { verifyToken } = await import('./auth');
    const isValidToken = verifyToken(score.JUDGE_ID, authToken);  // JUDGE_ID giờ chứa username
    
    if (!isValidToken) {
      return { 
        success: false, 
        message: 'Token không hợp lệ. Vui lòng đăng nhập lại.' 
      };
    }

    const timestamp = new Date().toLocaleString('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      hour12: false,
    });
    
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/RAW_DATA!A:F:append?valueInputOption=RAW`;
    
    const response = await authenticatedFetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        values: [[
          timestamp,
          score.JUDGE_ID,  // Lưu username vào cột này
          score.SBD,
          score.SEGMENT,
          score.BATCH_ID,
          score.SCORE,
        ]],
      }),
    });
    
    if (!response.ok) {
      return { success: false, message: 'Lỗi kết nối Google Sheets' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error submitting score:', error);
    return { success: false, message: 'Lỗi hệ thống' };
  }
}