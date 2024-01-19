import UsersService from '@/services/UsersService';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { name, email, password } = await request.json();
  if (!name || !email || !password) {
    throw new Error('Missing name, email, or password');
  }

  // create user
  let createdUser = null;
  try {
    createdUser = await UsersService.create({ name, email, password });
    if (!createdUser) {
      return new NextResponse(
        JSON.stringify({ message: 'Error creating user' }),
        {
          status: 409,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    }
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: 'Error creating user' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }

  return new NextResponse(createdUser);
}
