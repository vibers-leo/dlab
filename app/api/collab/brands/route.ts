import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  const { rows } = await pool.query(`
    SELECT b.*, e.name AS entity_name, e.color AS entity_color
    FROM collab.brands b
    JOIN collab.entities e ON e.id = b.entity_id
    ORDER BY e.name, b.name
  `);
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { entity_id, slug, name, domain, description, primary_color, secondary_color, tagline, category, status } = body;
  const { rows } = await pool.query(
    `INSERT INTO collab.brands (entity_id, slug, name, domain, description, primary_color, secondary_color, tagline, category, status)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
    [entity_id, slug, name, domain || null, description || null, primary_color || '#3B82F6', secondary_color || '#1E40AF', tagline || null, category || null, status || 'active']
  );
  return NextResponse.json(rows[0], { status: 201 });
}
