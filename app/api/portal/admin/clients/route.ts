import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getPortalSession } from '@/lib/portal-auth';
import bcrypt from 'bcryptjs';

export async function GET() {
  const user = await getPortalSession();
  if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { rows } = await pool.query(
    `SELECT c.*, e.name AS entity_name FROM collab.clients c LEFT JOIN collab.entities e ON e.id = c.entity_id ORDER BY c.created_at DESC`
  );
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const user = await getPortalSession();
  if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { login_id, password, name, email, phone, entity_id, role } = await req.json();
  const password_hash = await bcrypt.hash(password, 10);

  const { rows } = await pool.query(
    `INSERT INTO collab.clients (login_id, password_hash, name, email, phone, entity_id, role) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id, login_id, name, email, phone, entity_id, role, credits, is_active, created_at`,
    [login_id, password_hash, name, email, phone, entity_id, role]
  );
  return NextResponse.json(rows[0], { status: 201 });
}
