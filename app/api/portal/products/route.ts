import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getPortalSession } from '@/lib/portal-auth';

export async function GET() {
  const session = await getPortalSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { rows } = await pool.query(
    'SELECT * FROM collab.products WHERE is_active = true ORDER BY sort_order, name',
  );

  return NextResponse.json(rows);
}
