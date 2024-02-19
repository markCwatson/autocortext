import CompanyService from '@/services/CompanyService';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);

  const companies = await CompanyService.getAllCompanies();
  if (!companies) {
    return new Response('Company not found', { status: 404 });
  }

  return NextResponse.json(companies);
}
