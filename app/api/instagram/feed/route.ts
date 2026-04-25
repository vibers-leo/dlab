import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

/**
 * GET /api/instagram/feed?site=designd_official
 * 저장된 인스타 게시물 반환 (공개 API)
 */
export async function GET(req: NextRequest) {
  const site = req.nextUrl.searchParams.get('site');
  if (!site) return NextResponse.json({ error: 'site 파라미터 필수' }, { status: 400 });

  const { rows } = await pool.query(
    `SELECT post_id, image_url, caption, post_url, media_type, posted_at
     FROM collab.instagram_posts WHERE site = $1
     ORDER BY posted_at DESC LIMIT 20`,
    [site]
  );

  return NextResponse.json(rows, {
    headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=600' },
  });
}
