import ActivitiesService from '@/services/ActivitiesService';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const data = await req.json();
  const job = await ActivitiesService.create(data);
  return NextResponse.json(job);
}
