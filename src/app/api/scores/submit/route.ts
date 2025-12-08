import { NextRequest, NextResponse } from 'next/server';
import { submitScore } from '@/lib/googleSheets';
import { RawScore } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { score, authToken } = body;

    if (!score || !authToken) {
      return NextResponse.json(
        { error: 'Missing score or authToken' },
        { status: 400 }
      );
    }

    const result = await submitScore(score as RawScore, authToken);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Error submitting score:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi hệ thống' },
      { status: 500 }
    );
  }
}
