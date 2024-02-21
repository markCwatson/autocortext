import FeedbackService from '@/services/FeedbackService';
import { Feedback } from '@/types';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const companyId = url.searchParams.get('companyId');
  if (!companyId) {
    return NextResponse.json(
      { message: 'Company ID is required.' },
      { status: 400 },
    );
  }

  const body: Feedback = await req.json();
  const result = await FeedbackService.create(companyId, body);
  if (!result) {
    return NextResponse.json(
      { message: 'An error occurred while saving feedback' },
      { status: 500 },
    );
  }

  return NextResponse.json({ message: 'Feedback submitted successfully' });
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const companyId = url.searchParams.get('companyId');
  if (!companyId) {
    const feedback = await FeedbackService.getAll();
    return NextResponse.json(feedback);
  }

  const feedback = await FeedbackService.select(companyId);
  return NextResponse.json(feedback);
}

export async function PUT(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) {
    return NextResponse.json(
      { message: 'Feedback ID is required.' },
      { status: 400 },
    );
  }

  const result = await FeedbackService.markAsRead(id);
  if (!result) {
    return NextResponse.json(
      { message: 'An error occurred while marking feedback as read' },
      { status: 500 },
    );
  }

  return NextResponse.json({ message: 'Feedback marked as read' });
}
