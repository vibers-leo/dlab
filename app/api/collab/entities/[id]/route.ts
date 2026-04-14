import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const entity = await pool.query('SELECT * FROM collab.entities WHERE id=$1', [id]);
  if (!entity.rows[0]) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const brands = await pool.query('SELECT * FROM collab.brands WHERE entity_id=$1 ORDER BY name', [id]);
  return NextResponse.json({ ...entity.rows[0], brands: brands.rows });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const fields = ['name','ceo','business_no','address','industry','color','description','logo_url'];
  const updates = fields.filter(f => body[f] !== undefined);
  if (!updates.length) return NextResponse.json({ error: 'No fields' }, { status: 400 });
  const set = updates.map((f, i) => `${f}=$${i + 2}`).join(', ');
  const vals = [id, ...updates.map(f => body[f])];
  const { rows } = await pool.query(
    `UPDATE collab.entities SET ${set}, updated_at=NOW() WHERE id=$1 RETURNING *`, vals
  );
  return NextResponse.json(rows[0]);
}
