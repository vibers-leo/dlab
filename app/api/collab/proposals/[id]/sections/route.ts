import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { rows } = await pool.query(`
    SELECT sa.*, e.name AS entity_name, e.color AS entity_color
    FROM collab.section_assignments sa
    LEFT JOIN collab.entities e ON e.id = sa.entity_id
    WHERE sa.proposal_id=$1
  `, [id]);
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { section_key, entity_id, status, note } = await req.json();
  const { rows } = await pool.query(
    `INSERT INTO collab.section_assignments (proposal_id, section_key, entity_id, status, note)
     VALUES ($1,$2,$3,$4,$5)
     ON CONFLICT (proposal_id, section_key) DO UPDATE
     SET entity_id=$3, status=$4, note=$5, updated_at=NOW()
     RETURNING *`,
    [id, section_key, entity_id || null, status || 'pending', note || null]
  );
  return NextResponse.json(rows[0]);
}
