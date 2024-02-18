import { NextRequest, NextResponse } from 'next/server';
import { UserModel } from '@/repos/UsersRepository';
import CompanyService from '@/services/CompanyService';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const companyId = url.searchParams.get('companyId');
  if (!companyId) {
    return new Response('companyId is required', { status: 400 });
  }

  const users = await CompanyService.getUsers(companyId);
  if (!users) {
    return NextResponse.json([]);
  }

  return NextResponse.json(
    users.map((user: UserModel) => {
      return { name: user.name, id: user._id };
    }),
  );
}
