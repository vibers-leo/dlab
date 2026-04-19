import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getPortalSession } from '@/lib/portal-auth';

export async function GET() {
  const user = await getPortalSession();
  if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { rows } = await pool.query(
    `SELECT o.*, p.name AS product_name, c.name AS client_name FROM collab.orders o JOIN collab.products p ON p.id = o.product_id JOIN collab.clients c ON c.id = o.client_id ORDER BY o.created_at DESC`
  );
  return NextResponse.json(rows);
}
