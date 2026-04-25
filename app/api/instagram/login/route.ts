import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/instagram/login?site=designd_official
 * Instagram OAuth 시작 → 인스타 로그인 페이지로 리다이렉트
 */
export async function GET(request: NextRequest) {
  const site = request.nextUrl.searchParams.get('site') || 'dlab';
  const clientId = process.env.INSTAGRAM_CLIENT_ID;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dlab.vibers.co.kr';
  const redirectUri = `${appUrl}/api/instagram/callback`;

  if (!clientId) {
    return NextResponse.json({ error: 'INSTAGRAM_CLIENT_ID 미설정' }, { status: 500 });
  }

  const state = `${site}_${Math.random().toString(36).substring(7)}`;

  const authUrl = `https://www.instagram.com/oauth/authorize`
    + `?client_id=${clientId}`
    + `&redirect_uri=${encodeURIComponent(redirectUri)}`
    + `&state=${state}`
    + `&scope=instagram_business_basic`
    + `&response_type=code`;

  return NextResponse.redirect(authUrl);
}
