import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getPortalSession } from '@/lib/portal-auth';

export async function GET() {
  const session = await getPortalSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { rows } = await pool.query(
    `SELECT o.*, p.name AS product_name, p.category FROM collab.orders o JOIN collab.products p ON p.id = o.product_id WHERE o.client_id = $1 ORDER BY o.created_at DESC`,
    [session.clientId],
  );

  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const session = await getPortalSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { product_id, requirements } = await req.json();
  const clientId = session.clientId;

  const productRes = await pool.query(
    'SELECT price FROM collab.products WHERE id = $1 AND is_active = true',
    [product_id],
  );
  if (productRes.rows.length === 0) {
    return NextResponse.json({ error: '상품을 찾을 수 없습니다' }, { status: 404 });
  }
  const price = productRes.rows[0].price;

  const clientRes = await pool.query(
    'SELECT credits FROM collab.clients WHERE id = $1',
    [clientId],
  );
  const credits = clientRes.rows[0]?.credits ?? 0;

  if (credits < price) {
    return NextResponse.json({ error: '크레딧이 부족합니다' }, { status: 400 });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const orderRes = await client.query(
      `INSERT INTO collab.orders (client_id, product_id, requirements, status) VALUES ($1, $2, $3, 'pending') RETURNING *`,
      [clientId, product_id, requirements],
    );
    const order = orderRes.rows[0];

    await client.query(
      'UPDATE collab.clients SET credits = credits - $1 WHERE id = $2',
      [price, clientId],
    );

    await client.query(
      `INSERT INTO collab.credit_transactions (client_id, type, amount, balance_after, reference_id) VALUES ($1, 'spend', $2, $3, $4)`,
      [clientId, -price, credits - price, order.id],
    );

    await client.query('COMMIT');
    return NextResponse.json(order, { status: 201 });
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
