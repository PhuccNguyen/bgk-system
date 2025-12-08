import { NextRequest, NextResponse } from 'next/server';
import { fetchMyScores } from '@/lib/googleSheets';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const username = searchParams.get('username');
    const segment = searchParams.get('segment');
    const batchId = searchParams.get('batchId') || ''; // Cho phép rỗng

    if (!username || !segment) {
      return NextResponse.json(
        { error: 'Missing username or segment' },
        { status: 400 }
      );
    }

    const scores = await fetchMyScores(username, segment, batchId);
    return NextResponse.json(scores);
  } catch (error) {
    console.error('API Error fetching scores:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scores' },
      { status: 500 }
    );
  }
}
