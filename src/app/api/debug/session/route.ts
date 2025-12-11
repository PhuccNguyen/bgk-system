import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { session } = await request.json();
    
    const currentTime = Date.now();
    const sessionExpiry = session.expiresAt;
    const timeLeft = Math.round((sessionExpiry - currentTime) / 1000 / 60);
    
    // Generate expected token
    const secret = process.env.NEXT_PUBLIC_TOKEN_SECRET || 'BGK_SECRET_2025';
    const utcDate = new Date().toISOString().split('T')[0];
    const data = `${session.username}:${secret}:${utcDate}`;
    
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    const expectedToken = Math.abs(hash).toString(36);
    
    const debugInfo = {
      currentTime: new Date().toISOString(),
      sessionExpiry: new Date(sessionExpiry).toISOString(),
      timeLeftMinutes: timeLeft,
      isExpired: currentTime > sessionExpiry,
      tokenMatch: session.token === expectedToken,
      actualToken: session.token,
      expectedToken: expectedToken,
      utcDate: utcDate,
      tokenData: data,
      serverTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
    
    return NextResponse.json({
      success: true,
      debug: debugInfo
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}