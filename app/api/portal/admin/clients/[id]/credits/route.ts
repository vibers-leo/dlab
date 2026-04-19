import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getPortalSession } from '@/lib/portal-auth';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getPortalSession();
  if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const { amount, description } = await req.json();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { rows } = await client.query(
      `UPDATE collab.clients SET credits = credits + $1 WHERE id = $2 RETURNING credits`,
      [amount, id]
    );
    const newBalance = rows[0].credits;

    await client.query(
      `INSERT INTO collab.credit_transactions (client_id, type, amount, balance_after, description, created_by) VALUES ($1,$2,$3,$4,$5,$6)`,
      [id, amount > 0 ? 'earn' : 'spend', amount, newBalance, description, user.id]
    );

    await client.query('COMMIT');
    return NextResponse.json({ ok: true, credits: newBalance });
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
