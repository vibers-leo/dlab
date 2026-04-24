import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getPortalSession } from '@/lib/portal-auth';

const ALLOWED_FIELDS = ['title', 'category', 'client_name', 'description', 'image_url', 'link_url', 'tags', 'is_featured', 'sort_order'];

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getPortalSession();
  if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const body = await req.json();

  const sets: string[] = [];
  const values: unknown[] = [];
  let idx = 1;

  for (const field of ALLOWED_FIELDS) {
    if (field in body) {
      sets.push(`${field} = $${idx++}`);
      values.push(body[field]);
    }
  }

  if (sets.length === 0) {
    return NextResponse.json({ error: 'No valid fields provided' }, { status: 400 });
  }

  values.push(id);
  const { rows } = await pool.query(
    `UPDATE collab.portfolio SET ${sets.join(', ')}, updated_at = NOW() WHERE id = $${idx} RETURNING *`,
    values
  );

  if (rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(rows[0]);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getPortalSession();
  if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  await pool.query(`DELETE FROM collab.portfolio WHERE id = $1`, [id]);
  return NextResponse.json({ ok: true });
}
