import NotificationService from '@/services/NotificationService';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const companyId = url.searchParams.get('companyId');
  if (!companyId) {
    return NextResponse.json(
      { error: 'companyId is required' },
      { status: 400 },
    );
  }

  const data = await req.json();
  if (!data.title || !data.description) {
    // it's ok if recipientId is not provided (means it's a global notification)
    return NextResponse.json(
      { error: 'title and description are required' },
      { status: 400 },
    );
  }

  const result = await NotificationService.create(companyId, data);
  if (!result) {
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const companyId = url.searchParams.get('companyId');
  if (!companyId) {
    return NextResponse.json(
      { error: 'companyId is required' },
      { status: 400 },
    );
  }

  const notifications = await NotificationService.list(companyId);
  return NextResponse.json(notifications);
}

export async function PUT(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  const result = await NotificationService.markAsRead(id);
  if (!result) {
    return NextResponse.json(
      { error: 'Failed to mark notification as read' },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
