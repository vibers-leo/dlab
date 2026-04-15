import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  const { rows } = await pool.query(`
    SELECT
      e.*,
      COUNT(b.id)::int AS brand_count
    FROM collab.entities e
    LEFT JOIN collab.brands b ON b.entity_id = e.id
    WHERE e.is_active = true
    GROUP BY e.id
    ORDER BY e.type, e.name
  `);
  return NextResponse.json(rows, {
    headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=300' },
  });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { slug, name, ceo, business_no, address, industry, color, description, type } = body;
  const { rows } = await pool.query(
    `INSERT INTO collab.entities (slug, name, ceo, business_no, address, industry, color, description, type)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
    [slug, name, ceo || null, business_no || null, address || null, industry || null, color || '#3B82F6', description || null, type || 'internal']
  );
  return NextResponse.json(rows[0], { status: 201 });
}
