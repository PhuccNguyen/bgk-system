import { NextRequest, NextResponse } from 'next/server';
import { authenticateJudge, createSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    
    console.log('🔐 [API] Login attempt for username:', username);
    
    const result = await authenticateJudge(username, password);
    
    if (!result.success) {
      console.log('❌ [API] Login failed:', result.message);
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 401 }
      );
    }
    
    console.log('✅ [API] Login successful for:', username);
    
    const session = createSession(result.judge!);
    
    return NextResponse.json({
      success: true,
      session,
    });
  } catch (error) {
    console.error('❌ [API] Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi hệ thống. Vui lòng thử lại.' },
      { status: 500 }
    );
  }
}
