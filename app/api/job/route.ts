import JobsService, {
  jobDetailsModel,
  metaDataModel,
} from '@/services/JobsService';
import { NextRequest, NextResponse } from 'next/server';
import { JobsModel } from '@/repos/JobsRepository';

interface DeleteSchema {
  id: number;
  companyId: string;
}

interface UpdateSchema {
  job: JobsModel;
}

export async function POST(req: NextRequest) {
  const {
    details,
    meta,
  }: {
    details: jobDetailsModel;
    meta: metaDataModel;
  } = await req.json();
  if (!details || !meta) {
    return new Response('details and meta data are required', { status: 400 });
  }

  const createdJob = await JobsService.create(details, meta);
  if (!createdJob) {
    return new Response('Failed to create job', { status: 500 });
  }

  return NextResponse.json({ success: 'OK' });
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
    return NextResponse.json(count ? count : 0);
  }

  let jobs = await JobsService.getJobsByCompanyId(companyId);
  if (!jobs) {
    return new Response('Jobs not found', { status: 404 });
  }

  return NextResponse.json(jobs);
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
