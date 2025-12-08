import { NextResponse } from 'next/server';
import { fetchContestants } from '@/lib/googleSheets';

export async function GET() {
  try {
    const contestants = await fetchContestants();
    return NextResponse.json(contestants);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch contestants' }, { status: 500 });
  }
}
