import ActivitiesService from '@/services/ActivitiesService';
import { NextRequest, NextResponse } from 'next/server';

interface DeleteSchema {
  jobId: string;
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const job = await ActivitiesService.create(data);
  return NextResponse.json(job);
}

export async function DELETE(req: NextRequest) {
  const { jobId } = (await req.json()) as DeleteSchema;
  await ActivitiesService.delete(jobId);
  return NextResponse.json({ success: true });
}
