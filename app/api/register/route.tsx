import UsersService from '@/services/UsersService';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { name, email, password } = await request.json();
  if (!name || !email || !password) {
    return new NextResponse(
      JSON.stringify({ message: 'Missing name, email, or password' }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }

  // create user
  const createdUser = await UsersService.create({ name, email, password });
  if (!createdUser) {
    return new NextResponse(
      JSON.stringify({ message: 'Error creating user' }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }

  return new NextResponse(createdUser);
}
