import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  const { rows } = await pool.query(`
    SELECT p.*, pr.title AS project_title
    FROM collab.proposals p
    LEFT JOIN collab.projects pr ON pr.id = p.project_id
    ORDER BY p.created_at DESC
  `);
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { project_id, title, rfp_no, rfp_raw, evaluation_items, entity_ids, ai_draft } = body;
  const { rows } = await pool.query(
    `INSERT INTO collab.proposals (project_id, title, rfp_no, rfp_raw, evaluation_items, entity_ids, ai_draft)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [project_id || null, title, rfp_no || null,
     rfp_raw ? JSON.stringify(rfp_raw) : null,
     evaluation_items ? JSON.stringify(evaluation_items) : null,
     entity_ids || [],
     ai_draft ? JSON.stringify(ai_draft) : null]
  );
  return NextResponse.json(rows[0], { status: 201 });
}
