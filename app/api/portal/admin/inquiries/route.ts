import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getPortalSession } from '@/lib/portal-auth';

export async function GET() {
  const user = await getPortalSession();
  if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { rows } = await pool.query(
    `SELECT * FROM collab.inquiries ORDER BY created_at DESC`
  );
  return NextResponse.json(rows);
}
