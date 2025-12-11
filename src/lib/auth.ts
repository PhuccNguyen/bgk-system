import { Judge, AuthSession } from './types';
import { fetchJudges as fetchJudgesFromSheet } from './googleSheets';

// SHA256 Hash Function
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// Xác thực đăng nhập
export async function authenticateJudge(
  username: string, 
  password: string
): Promise<{ success: boolean; judge?: Judge; message?: string }> {
  try {
    const judges = await fetchJudgesFromSheet();
    
    // Chuẩn hóa username input (lowercase, trim)
    const normalizedUsername = username.trim().toLowerCase();
    
    console.log('🔍 Tìm username:', normalizedUsername);
    console.log('📋 Danh sách judges:', judges.map((j: Judge) => j.USERNAME));
    
    const judge = judges.find((j: Judge) => j.USERNAME === normalizedUsername);

    if (!judge) {
      return { 
        success: false, 
        message: `Tài khoản "${username}" không tồn tại. Vui lòng kiểm tra lại.` 
      };
    }

    if (judge.STATUS !== 'ACTIVE') {
      return { 
        success: false, 
        message: 'Tài khoản đã bị vô hiệu hóa. Liên hệ BTC.' 
      };
    }

    const inputHash = await sha256(password);
    
    console.log('🔐 Hash nhập vào:', inputHash);
    console.log('🔐 Hash trong Sheet:', judge.PASSWORD_HASH);
    
    if (inputHash !== judge.PASSWORD_HASH) {
      return { 
        success: false, 
        message: 'Mật khẩu không chính xác. Vui lòng thử lại.' 
      };
    }

    return { success: true, judge };
  } catch (error) {
    console.error('Authentication error:', error);
    return { 
      success: false, 
      message: 'Lỗi kết nối hệ thống. Vui lòng thử lại sau.' 
    };
  }
}

// Tạo session token
export function createSession(judge: Judge): AuthSession {
  const token = generateToken(judge.USERNAME);
  const expiresAt = Date.now() + (8 * 60 * 60 * 1000); // 8 giờ

  const session: AuthSession = {
    username: judge.USERNAME,
    fullName: judge.FULL_NAME,
    image: judge.IMAGE_URL_BGK,
    token,
    expiresAt,
  };
  
  console.log('🔑 [auth] Creating session for:', judge.USERNAME);
  console.log('🖼️ [auth] Judge image URL:', judge.IMAGE_URL_BGK);
  console.log('📋 [auth] Full session:', session);
  
  // Client sẽ tự lưu localStorage sau khi nhận response
  return session;
}

// Enhanced Session Validation with Production Fixes
export function validateSession(session: AuthSession | null): boolean {
  const now = Date.now();
  const isProduction = process.env.NODE_ENV === 'production';
  
  console.log('🔍 [validateSession] Comprehensive check:', {
    hasSession: !!session,
    hasToken: !!session?.token,
    hasUsername: !!session?.username,
    expiresAt: session?.expiresAt,
    currentTime: now,
    timeLeft: session?.expiresAt ? (session.expiresAt - now) : 'no-expiry',
    timeLeftMinutes: session?.expiresAt ? Math.round((session.expiresAt - now) / 60000) : 'no-expiry',
    isExpired: session?.expiresAt ? session.expiresAt < now : 'no-expiry',
    environment: isProduction ? 'PRODUCTION' : 'DEVELOPMENT',
    domain: typeof window !== 'undefined' ? window.location.host : 'server-side'
  });
  
  // Check session structure
  if (!session || !session.token || !session.username || !session.expiresAt) {
    console.log('❌ [validateSession] Invalid session structure');
    return false;
  }
  
  // Check expiration with buffer for production stability
  const bufferTime = isProduction ? 30000 : 5000; // 30s for prod, 5s for dev
  const effectiveExpiry = session.expiresAt - bufferTime;
  const isExpiringSoon = now > effectiveExpiry;
  
  if (isExpiringSoon) {
    console.log('⏰ [validateSession] Session expired or will expire soon:', {
      expiresAt: new Date(session.expiresAt).toISOString(),
      effectiveExpiry: new Date(effectiveExpiry).toISOString(),
      currentTime: new Date(now).toISOString(),
      timeLeftMs: session.expiresAt - now,
      bufferUsed: bufferTime
    });
    return false;
  }
  
  console.log('✅ [validateSession] Session valid - OK to proceed');
  return true;
}

// Kiểm tra session hợp lệ với enhanced production support
export function getSession(): AuthSession | null {
  if (typeof window === 'undefined') return null;
  
  try {
    let sessionStr = localStorage.getItem('bgk_session');
    let storageUsed = 'localStorage';
    
    // Fallback to sessionStorage if localStorage fails (HTTPS issues on VPS)
    if (!sessionStr && typeof sessionStorage !== 'undefined') {
      sessionStr = sessionStorage.getItem('bgk_session');
      storageUsed = 'sessionStorage';
      console.log('🔄 [getSession] Fallback to sessionStorage');
    }
    
    if (!sessionStr) {
      console.log('🔐 [getSession] No session found in any storage');
      return null;
    }

    const session: AuthSession = JSON.parse(sessionStr);
    console.log('🔐 [getSession] Session loaded from ' + storageUsed + ':', {
      username: session.username,
      fullName: session.fullName,
      hasImage: !!session.image,
      expiresAt: new Date(session.expiresAt).toISOString(),
      timeLeft: Math.round((session.expiresAt - Date.now()) / 1000 / 60) + ' minutes',
      tokenLength: session.token?.length || 0
    });

    // Use enhanced validation
    if (!validateSession(session)) {
      console.log('❌ [getSession] Session validation failed, clearing');
      clearSession();
      return null;
    }

    // Verify token with detailed logging
    const expectedToken = generateToken(session.username);
    if (session.token !== expectedToken) {
      console.log('🚫 [getSession] Token mismatch - possible VPS timezone issue:', {
        expected: expectedToken,
        actual: session.token,
        username: session.username,
        timezoneOffset: new Date().getTimezoneOffset(),
        utcDate: new Date().toISOString().split('T')[0]
      });
      clearSession();
      return null;
    }

    console.log('✅ [getSession] Session fully validated and ready');
    return session;
  } catch (error) {
    console.error('❌ [getSession] Error validating session:', error);
    clearSession();
    return null;
  }
}

// Xóa session
export function clearSession(): void {
  if (typeof window !== 'undefined') {
    console.log('🗑️ [clearSession] Clearing session from localStorage');
    localStorage.removeItem('bgk_session');
    
    // Clear any potential cached session data
    sessionStorage.removeItem('bgk_session');
  }
}

// Generate token
function generateToken(username: string): string {
  const secret = process.env.NEXT_PUBLIC_TOKEN_SECRET || 'BGK_SECRET_2025';
  // Use UTC date to avoid timezone issues between client and server
  const utcDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  const data = `${username}:${secret}:${utcDate}`;
  
  console.log('🎫 [generateToken] Data for hashing:', {
    username,
    utcDate,
    dataString: data,
    isProduction: process.env.NODE_ENV === 'production'
  });
  
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  const token = Math.abs(hash).toString(36);
  console.log('🔑 [generateToken] Generated token:', token);
  
  return token;
}

// Verify token
export function verifyToken(username: string, token: string): boolean {
  const expectedToken = generateToken(username);
  return token === expectedToken;
}
