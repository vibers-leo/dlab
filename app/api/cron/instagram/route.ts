import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { syncInstagramFeed, getTokenStatus } from '@/lib/instagram';

/**
 * GET /api/cron/instagram
 * Vercel Cron: 매일 인스타 피드 동기화 + 토큰 자동 갱신
 * vercel.json에 cron 설정 필요:
 * { "crons": [{ "path": "/api/cron/instagram", "schedule": "0 6 * * *" }] }
 */
export async function GET(req: NextRequest) {
  // Vercel Cron 인증
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { rows: tokens } = await pool.query('SELECT site FROM collab.instagram_tokens');
  const results: any[] = [];

  for (const { site } of tokens) {
    try {
      const status = await getTokenStatus(site);
      if (!status.hasToken || status.isExpired) {
        results.push({ site, status: 'skipped', reason: status.isExpired ? 'expired' : 'no_token' });
        continue;
      }
      const count = await syncInstagramFeed(site);
      results.push({ site, status: 'synced', posts: count });
    } catch (e: any) {
      results.push({ site, status: 'error', message: e.message });
    }
  }

  return NextResponse.json({ ok: true, results });
}
