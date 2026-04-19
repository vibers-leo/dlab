import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getPortalSession } from '@/lib/portal-auth';

export async function GET() {
  try {
    const session = await getPortalSession();

    if (!session) {
      return NextResponse.json({ user: null });
    }

    const { rows } = await pool.query(
      'SELECT credits FROM collab.clients WHERE id = $1 AND is_active = true',
      [session.id],
    );

    if (rows.length === 0) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        ...session,
        credits: rows[0].credits,
      },
    });
  } catch (error) {
    console.error('[portal/auth/me]', error);
    return NextResponse.json({ user: null });
  }
}
