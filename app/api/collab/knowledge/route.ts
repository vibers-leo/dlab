import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: NextRequest) {
  const entityId = req.nextUrl.searchParams.get('entity_id');
  const query = entityId
    ? 'SELECT k.*, e.name AS entity_name, e.color AS entity_color FROM collab.knowledge_docs k JOIN collab.entities e ON e.id = k.entity_id WHERE k.entity_id=$1 ORDER BY k.created_at DESC'
    : 'SELECT k.*, e.name AS entity_name, e.color AS entity_color FROM collab.knowledge_docs k JOIN collab.entities e ON e.id = k.entity_id ORDER BY k.created_at DESC';
  const { rows } = entityId
    ? await pool.query(query, [entityId])
    : await pool.query(query);
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { entity_id, title, category, content, file_url, year, result } = body;
  const { rows } = await pool.query(
    `INSERT INTO collab.knowledge_docs (entity_id, title, category, content, file_url, year, result)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [entity_id, title, category || 'proposal', content || null, file_url || null, year || null, result || null]
  );
  return NextResponse.json(rows[0], { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  await pool.query('DELETE FROM collab.knowledge_docs WHERE id=$1', [id]);
  return NextResponse.json({ ok: true });
}
