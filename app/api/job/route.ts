import JobsService from '@/services/JobsService';
import { NextRequest, NextResponse } from 'next/server';
import { JobsModel } from '@/repos/JobsRepository';

interface DeleteSchema {
  id: number;
  companyId: string;
}

interface UpdateSchema {
  job: JobsModel;
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const companyId = url.searchParams.get('companyId');
  if (!companyId) {
    return new Response('Company ID is required', { status: 400 });
  }

  const count = url.searchParams.get('count');
  if (count === 'true') {
    let count = await JobsService.countJobsByCompanyId(companyId);
    if (!count) {
      return new Response('Job count not found', { status: 404 });
    }

    return NextResponse.json(count);
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

export async function PUT(req: NextRequest) {
  const { job } = (await req.json()) as UpdateSchema;
  const updatedJob = await JobsService.update(job);
  return NextResponse.json(updatedJob);
}
