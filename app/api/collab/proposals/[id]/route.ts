import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { rows } = await pool.query('SELECT * FROM collab.proposals WHERE id=$1', [id]);
  if (!rows[0]) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(rows[0]);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { ai_draft, status } = await req.json();
  const { rows } = await pool.query(
    `UPDATE collab.proposals SET
       ai_draft = COALESCE($2::jsonb, ai_draft),
       status = COALESCE($3, status),
       updated_at = NOW()
     WHERE id=$1 RETURNING *`,
    [id, ai_draft ? JSON.stringify(ai_draft) : null, status || null]
  );
  return NextResponse.json(rows[0]);
}
