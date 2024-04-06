import JobsService, { metaDataModel } from '@/services/JobsService';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const {
    conversation,
    meta,
  }: {
    conversation: string;
    meta: metaDataModel;
  } = await req.json();
  if (!conversation || !meta) {
    return new Response('conversation and meta data info are required', {
      status: 400,
    });
  }
  if (!meta.companyId) {
    return new Response('Company ID is required', { status: 400 });
  }

  const createdJob = await JobsService.createFromConversation(
    conversation,
    meta,
  );
  if (!createdJob) {
    return new Response('Job not created', { status: 500 });
  }

  return NextResponse.json(createdJob);
}
