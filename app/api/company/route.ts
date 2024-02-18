import CompanyService from '@/services/CompanyService';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const companyId = url.searchParams.get('id');

  if (!companyId) {
    return new Response('Company ID is required', { status: 400 });
  }

  const company = await CompanyService.selectById(new ObjectId(companyId));
  if (!company) {
    return new Response('Company not found', { status: 404 });
  }

  return NextResponse.json({
    name: company.name,
  });
}
