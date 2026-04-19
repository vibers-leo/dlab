import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getPortalSession } from '@/lib/portal-auth';

export async function GET() {
  const session = await getPortalSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const clientId = session.clientId;

  const [creditsRes, activeOrdersRes, recentOrdersRes, recentCreditsRes] =
    await Promise.all([
      pool.query('SELECT credits FROM collab.clients WHERE id = $1', [clientId]),
      pool.query(
        `SELECT COUNT(*)::int AS cnt FROM collab.orders WHERE client_id = $1 AND status NOT IN ('completed','cancelled')`,
        [clientId],
      ),
      pool.query(
        `SELECT o.*, p.name AS product_name FROM collab.orders o JOIN collab.products p ON p.id = o.product_id WHERE o.client_id = $1 ORDER BY o.created_at DESC LIMIT 5`,
        [clientId],
      ),
      pool.query(
        'SELECT * FROM collab.credit_transactions WHERE client_id = $1 ORDER BY created_at DESC LIMIT 5',
        [clientId],
      ),
    ]);

  return NextResponse.json({
    credits: creditsRes.rows[0]?.credits ?? 0,
    activeOrders: activeOrdersRes.rows[0]?.cnt ?? 0,
    recentOrders: recentOrdersRes.rows,
    recentCredits: recentCreditsRes.rows,
  });
}
