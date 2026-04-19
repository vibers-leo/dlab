import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { PORTAL_COOKIE } from '@/lib/portal-auth';

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.set(PORTAL_COOKIE, '', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  return NextResponse.json({ ok: true });
}
