import HistoryService from '@/services/HistoryService';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: NextResponse) {
  const { machine, messages, companyId } = await req.json();
  if (!messages) {
    return NextResponse.json({ success: false });
  }

  await HistoryService.create(machine, messages, companyId);
  return NextResponse.json({ success: true });
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const companyId = url.searchParams.get('companyId');
  if (!companyId) {
    return NextResponse.json({ success: false });
  }

  const history = await HistoryService.getHistoryByCompanyId(companyId);
  return NextResponse.json(history);
}

export async function DELETE(req: NextRequest) {
  const { _id, companyId } = await req.json();
  if (!_id || !companyId) {
    return NextResponse.json({ success: false });
  }

  const history = await HistoryService.delete(_id, companyId);
  return NextResponse.json(history);
}
