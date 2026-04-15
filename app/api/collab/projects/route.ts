import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  const { rows } = await pool.query(`
    SELECT
      p.*,
      e.name AS created_by_name,
      e.color AS created_by_color,
      COALESCE(
        json_agg(
          json_build_object('entity_id', pm.entity_id, 'name', ent.name, 'color', ent.color, 'role', pm.role)
        ) FILTER (WHERE pm.id IS NOT NULL), '[]'
      ) AS members
    FROM collab.projects p
    LEFT JOIN collab.entities e ON e.id = p.created_by
    LEFT JOIN collab.project_members pm ON pm.project_id = p.id
    LEFT JOIN collab.entities ent ON ent.id = pm.entity_id
    GROUP BY p.id, e.name, e.color
    ORDER BY p.created_at DESC
  `);
  return NextResponse.json(rows, {
    headers: { 'Cache-Control': 's-maxage=30, stale-while-revalidate=120' },
  });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { title, description, status, deadline, budget, tags, created_by, member_ids } = body;
  const { rows } = await pool.query(
    `INSERT INTO collab.projects (title, description, status, deadline, budget, tags, created_by)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [title, description || null, status || 'proposal', deadline || null, budget || null, tags || [], created_by || null]
  );
  const project = rows[0];
  if (member_ids?.length) {
    for (const { entity_id, role } of member_ids) {
      await pool.query(
        'INSERT INTO collab.project_members (project_id, entity_id, role) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING',
        [project.id, entity_id, role || null]
      );
    }
  }
  return NextResponse.json(project, { status: 201 });
}
