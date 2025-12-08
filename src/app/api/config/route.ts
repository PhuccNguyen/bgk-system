import { NextResponse } from 'next/server';
import { fetchConfig } from '@/lib/googleSheets';

export async function GET() {
  try {
    const config = await fetchConfig();
    return NextResponse.json(config);
  } catch (error) {
    console.error('API Error fetching config:', error);
    return NextResponse.json(
      { error: 'Failed to fetch config' }, 
      { status: 500 }
    );
  }
}
