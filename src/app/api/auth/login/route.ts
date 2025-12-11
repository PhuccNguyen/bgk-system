import { NextRequest, NextResponse } from 'next/server';
import { authenticateJudge, createSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    console.log('🔐 [API] Login attempt for username:', username);

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Username và password là bắt buộc' },
        { status: 400 }
      );
    }

    const result = await authenticateJudge(username, password);

    if (result.success && result.judge) {
      const session = createSession(result.judge);
      
      console.log('✅ [API] Login successful for:', username);
      
      return NextResponse.json({
        success: true,
        session,
        message: 'Đăng nhập thành công',
      });
    } else {
      console.log('❌ [API] Login failed:', result.message);
      
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('❌ [API] Login error:', error);
    
    return NextResponse.json(
      { success: false, message: 'Lỗi server' },
      { status: 500 }
    );
  }
}
