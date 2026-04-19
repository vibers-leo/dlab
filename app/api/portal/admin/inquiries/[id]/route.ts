import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getPortalSession } from '@/lib/portal-auth';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getPortalSession();
  if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const { status } = await req.json();

  const { rows } = await pool.query(
    `UPDATE collab.inquiries SET status = $1 WHERE id = $2 RETURNING *`,
    [status, id]
  );
  return NextResponse.json(rows[0]);
}
