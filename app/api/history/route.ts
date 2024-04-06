import HistoryService from '@/services/HistoryService';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: NextResponse) {
  const { machine, messages, companyId, summarize } = await req.json();
  if (!messages || !machine || !companyId || summarize === undefined) {
    return NextResponse.json({ success: false });
  }

  await HistoryService.create(machine, messages, companyId, summarize);
  return NextResponse.json({ success: true });
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const companyId = url.searchParams.get('companyId');
  if (!companyId) {
    return NextResponse.json(
      { error: 'company ID is required' },
      { status: 400 },
    );
  }

  const history = await HistoryService.getHistoryByCompanyId(companyId);
  return NextResponse.json(history);
}

export async function DELETE(req: NextRequest) {
  const { _id, companyId } = await req.json();
  if (!_id || !companyId) {
    return NextResponse.json(
      {
        error: 'history item ID and company ID are required',
      },
      { status: 400 },
    );
  }

  const history = await HistoryService.delete(_id, companyId);
  return NextResponse.json(history);
}

export async function PUT(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) {
    return NextResponse.json(
      { error: 'history item ID is required' },
      { status: 400 },
    );
  }

  const { title } = await req.json();
  if (!title) {
    return NextResponse.json({ error: 'title is required' }, { status: 400 });
  }

  const history = await HistoryService.update(id, title);
  return NextResponse.json(history);
}
