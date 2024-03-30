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
  const userId = url.searchParams.get('userId');
  if (!companyId || !userId) {
    return NextResponse.json(
      { error: 'companyId and userId are required' },
      { status: 400 },
    );
  }

  const notifications = await NotificationService.list(companyId, userId);
  return NextResponse.json(notifications);
}

export async function PUT(req: NextRequest) {
  const url = new URL(req.url);
  const userId = url.searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }

  const data = await req.json();
  const ids = data.ids;
  if (!ids || !Array.isArray(ids)) {
    return NextResponse.json(
      { error: 'ids must be an array of strings' },
      { status: 400 },
    );
  }

  const result = await NotificationService.markAsRead(userId, ids);
  if (!result) {
    return NextResponse.json(
      { error: 'Failed to mark notification as read' },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
