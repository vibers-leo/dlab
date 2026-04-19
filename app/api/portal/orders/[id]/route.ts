import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getPortalSession } from '@/lib/portal-auth';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getPortalSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  const [orderRes, commentsRes] = await Promise.all([
    pool.query(
      `SELECT o.*, p.name AS product_name, p.category, p.description AS product_desc FROM collab.orders o JOIN collab.products p ON p.id = o.product_id WHERE o.id = $1 AND o.client_id = $2`,
      [id, session.clientId],
    ),
    pool.query(
      `SELECT oc.*, c.name AS author_name, c.role AS author_role FROM collab.order_comments oc JOIN collab.clients c ON c.id = oc.client_id WHERE oc.order_id = $1 ORDER BY oc.created_at`,
      [id],
    ),
  ]);

  if (orderRes.rows.length === 0) {
    return NextResponse.json({ error: '주문을 찾을 수 없습니다' }, { status: 404 });
  }

  return NextResponse.json({
    order: orderRes.rows[0],
    comments: commentsRes.rows,
  });
}
