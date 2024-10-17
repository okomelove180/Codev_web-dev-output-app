import { NextResponse } from 'next/server';
import { signUp } from '@/lib/auth/auth';

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();
    const user = await signUp({ email, password, name });
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}