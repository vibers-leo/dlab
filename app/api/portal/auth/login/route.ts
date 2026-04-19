import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import pool from '@/lib/db';
import { createPortalSession, PORTAL_COOKIE } from '@/lib/portal-auth';

export async function POST(req: Request) {
  try {
    const { login_id, password } = await req.json();

    if (!login_id || !password) {
      return NextResponse.json(
        { error: '아이디와 비밀번호를 입력해 주세요' },
        { status: 400 },
      );
    }

    const { rows } = await pool.query(
      'SELECT * FROM collab.clients WHERE login_id = $1 AND is_active = true',
      [login_id],
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: '아이디 또는 비밀번호가 올바르지 않습니다' },
        { status: 401 },
      );
    }

    const client = rows[0];
    const valid = await bcrypt.compare(password, client.password_hash);

    if (!valid) {
      return NextResponse.json(
        { error: '아이디 또는 비밀번호가 올바르지 않습니다' },
        { status: 401 },
      );
    }

    const token = await createPortalSession({
      id: client.id,
      login_id: client.login_id,
      name: client.name,
      email: client.email,
      role: client.role,
      entity_id: client.entity_id,
      credits: client.credits,
    });

    // Update last_login
    await pool.query(
      'UPDATE collab.clients SET last_login = NOW() WHERE id = $1',
      [client.id],
    );

    const cookieStore = await cookies();
    cookieStore.set(PORTAL_COOKIE, token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({
      ok: true,
      user: {
        id: client.id,
        name: client.name,
        role: client.role,
        credits: client.credits,
      },
    });
  } catch (error) {
    console.error('[portal/auth/login]', error);
    return NextResponse.json(
      { error: '로그인 처리 중 오류가 발생했습니다' },
      { status: 500 },
    );
  }
}
