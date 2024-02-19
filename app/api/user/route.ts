import UsersService from '@/services/UsersService';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const person = await UsersService.create(body);
  if (!person) {
    return new Response('Error occured creating user', { status: 400 });
  }

  return NextResponse.json(person);
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const personId = url.searchParams.get('id');
  if (!personId) {
    return new Response('User ID is required', { status: 400 });
  }

  const person = await UsersService.selectById(new ObjectId(personId));
  if (!person) {
    return new Response('User not found', { status: 404 });
  }

  return NextResponse.json({
    name: person.name,
  });
}
