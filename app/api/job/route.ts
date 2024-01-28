import { JobsModel } from '@/repos/JobsRepository';
import ActivitiesService from '@/services/ActivitiesService';
import JobsService from '@/services/JobsService';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { a } from 'react-spring';

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
