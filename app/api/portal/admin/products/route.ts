import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getPortalSession } from '@/lib/portal-auth';

export async function POST(req: NextRequest) {
  const user = await getPortalSession();
  if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { slug, name, category, description, price, duration_days } = await req.json();

  const { rows } = await pool.query(
    `INSERT INTO collab.products (slug, name, category, description, price, duration_days) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [slug, name, category, description, price, duration_days]
  );
  return NextResponse.json(rows[0], { status: 201 });
}
