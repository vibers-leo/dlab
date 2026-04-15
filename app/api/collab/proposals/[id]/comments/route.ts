import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { rows } = await pool.query(`
    SELECT c.*, e.name AS entity_name, e.color AS entity_color
    FROM collab.comments c
    LEFT JOIN collab.entities e ON e.id = c.entity_id
    WHERE c.proposal_id=$1
    ORDER BY c.created_at ASC
  `, [id]);
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { section_key, entity_id, author_name, content } = await req.json();
  if (!content || !author_name) return NextResponse.json({ error: '내용과 작성자 필요' }, { status: 400 });
  const { rows } = await pool.query(
    `INSERT INTO collab.comments (proposal_id, section_key, entity_id, author_name, content)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [id, section_key || null, entity_id || null, author_name, content]
  );
  return NextResponse.json(rows[0], { status: 201 });
}
