import { NextResponse } from 'next/server';
import OpenAiService from '@/services/OpenAiService';

export async function POST(request: Request) {
  const { conversation } = await request.json();
  if (!conversation) {
    return NextResponse.json(
      { error: 'No conversation provided' },
      { status: 400 },
    );
  }

  const summary = await OpenAiService.summarize(conversation);
  if (!summary) {
    return NextResponse.json(
      { error: 'Failed to summarize conversation' },
      { status: 500 },
    );
  }

  return NextResponse.json({ summary });
}
