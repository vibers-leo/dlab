import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getPortalSession } from '@/lib/portal-auth';

export async function GET() {
  const user = await getPortalSession();
  if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { rows } = await pool.query(
    `SELECT * FROM collab.portfolio ORDER BY is_featured DESC, sort_order, created_at DESC`
  );
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const user = await getPortalSession();
  if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { title, category, client_name, description, image_url, link_url, tags, is_featured, sort_order } = await req.json();

  const { rows } = await pool.query(
    `INSERT INTO collab.portfolio (title, category, client_name, description, image_url, link_url, tags, is_featured, sort_order)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
    [title, category, client_name, description, image_url, link_url, tags, is_featured, sort_order]
  );
  return NextResponse.json(rows[0], { status: 201 });
}
