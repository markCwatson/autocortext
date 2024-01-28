import { JobsModel } from '@/repos/JobsRepository';
import JobsService from '@/services/JobsService';
import { NextRequest, NextResponse } from 'next/server';

interface DeleteSchema {
  id: number;
  companyId: string;
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const companyId = url.searchParams.get('companyId');
  if (!companyId) {
    return new Response('Company ID is required', { status: 400 });
  }

  let jobs = await JobsService.getJobsByCompanyId(companyId);
  if (!jobs) {
    return new Response('Jobs not found', { status: 404 });
  }

  return NextResponse.json(jobs);
}

export async function POST(req: NextRequest) {
  const data = (await req.json()) as JobsModel;
  if (!data.companyId) {
    return new Response('Company ID is required', { status: 400 });
  }

  const job = await JobsService.create(data);
  return NextResponse.json(job);
}

export async function DELETE(req: NextRequest) {
  const { id, companyId } = (await req.json()) as DeleteSchema;
  const deletedJob = await JobsService.delete(id, companyId);
  return NextResponse.json(deletedJob);
}
