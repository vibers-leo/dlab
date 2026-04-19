import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getPortalSession } from '@/lib/portal-auth';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getPortalSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const { content } = await req.json();

  if (!content?.trim()) {
    return NextResponse.json({ error: '내용을 입력해주세요' }, { status: 400 });
  }

  const { rows } = await pool.query(
    'INSERT INTO collab.order_comments (order_id, client_id, content) VALUES ($1, $2, $3) RETURNING *',
    [id, session.clientId, content],
  );

  return NextResponse.json(rows[0], { status: 201 });
}
