import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  const { rows } = await pool.query(
    'SELECT * FROM collab.portfolio ORDER BY is_featured DESC, sort_order, created_at DESC',
  );

  return NextResponse.json(rows, {
    headers: { 'Cache-Control': 'public, s-maxage=300' },
  });
}
