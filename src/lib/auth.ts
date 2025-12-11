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

// Kiểm tra session hợp lệ
export function getSession(): AuthSession | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const sessionStr = localStorage.getItem('bgk_session');
    if (!sessionStr) {
      console.log('🔐 [getSession] No session found in localStorage');
      return null;
    }

    const session: AuthSession = JSON.parse(sessionStr);
    console.log('🔐 [getSession] Session loaded:', {
      username: session.username,
      expiresAt: new Date(session.expiresAt).toISOString(),
      timeLeft: Math.round((session.expiresAt - Date.now()) / 1000 / 60) + ' minutes'
    });

    if (Date.now() > session.expiresAt) {
      console.log('⏰ [getSession] Session expired, clearing');
      clearSession();
      return null;
    }

    const expectedToken = generateToken(session.username);
    if (session.token !== expectedToken) {
      console.log('🚫 [getSession] Token mismatch, clearing session');
      console.log('Expected token:', expectedToken);
      console.log('Actual token:', session.token);
      clearSession();
      return null;
    }

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
    localStorage.removeItem('bgk_session');
  }
}

// Generate token
function generateToken(username: string): string {
  const secret = process.env.NEXT_PUBLIC_TOKEN_SECRET || 'BGK_SECRET_2025';
  // Use UTC date to avoid timezone issues between client and server
  const utcDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  const data = `${username}:${secret}:${utcDate}`;
  
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  return Math.abs(hash).toString(36);
}

// Verify token
export function verifyToken(username: string, token: string): boolean {
  const expectedToken = generateToken(username);
  return token === expectedToken;
}
