import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getPortalSession } from '@/lib/portal-auth';

export async function GET() {
  const session = await getPortalSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { rows } = await pool.query(
    'SELECT * FROM collab.credit_transactions WHERE client_id = $1 ORDER BY created_at DESC LIMIT 50',
    [session.clientId],
  );

  return NextResponse.json({ items: rows });
}
