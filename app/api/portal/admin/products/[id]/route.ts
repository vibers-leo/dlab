import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getPortalSession } from '@/lib/portal-auth';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getPortalSession();
  if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const body = await req.json();
  const allowed = ['name', 'category', 'description', 'price', 'duration_days', 'is_active', 'sort_order'];
  const fields: string[] = [];
  const values: unknown[] = [];

  for (const key of allowed) {
    if (key in body) {
      values.push(body[key]);
      fields.push(`${key} = $${values.length}`);
    }
  }

  if (fields.length === 0) return NextResponse.json({ error: 'No fields to update' }, { status: 400 });

  values.push(id);
  const { rows } = await pool.query(
    `UPDATE collab.products SET ${fields.join(', ')} WHERE id = $${values.length} RETURNING *`,
    values
  );
  return NextResponse.json(rows[0]);
}
