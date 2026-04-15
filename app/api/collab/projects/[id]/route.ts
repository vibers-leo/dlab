import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { status, title, description } = await req.json();
  const { rows } = await pool.query(
    `UPDATE collab.projects SET
       status = COALESCE($2, status),
       title = COALESCE($3, title),
       description = COALESCE($4, description),
       updated_at = NOW()
     WHERE id=$1 RETURNING *`,
    [id, status||null, title||null, description||null]
  );
  return NextResponse.json(rows[0]);
}
