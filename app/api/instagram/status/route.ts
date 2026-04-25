import { NextRequest, NextResponse } from 'next/server';
import { getTokenStatus } from '@/lib/instagram';
import { getPortalSession } from '@/lib/portal-auth';

/**
 * GET /api/instagram/status?site=designd_official
 * 토큰 상태 확인 (어드민 전용)
 */
export async function GET(req: NextRequest) {
  const user = await getPortalSession();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const site = req.nextUrl.searchParams.get('site');
  if (!site) return NextResponse.json({ error: 'site 파라미터 필수' }, { status: 400 });

  const status = await getTokenStatus(site);
  return NextResponse.json(status);
}
