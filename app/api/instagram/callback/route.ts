import { NextResponse } from 'next/server';
import { exchangeForLongLivedToken, saveToken } from '@/lib/instagram';

export const dynamic = 'force-dynamic';

/**
 * GET /api/instagram/callback
 * 인스타 OAuth 콜백 → 토큰 교환 → DB 저장
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const state = searchParams.get('state') || '';
  const site = state.split('_')[0] || 'dlab';

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dlab.vibers.co.kr';
  const adminUrl = `${appUrl}/portal/admin/clients`;

  if (error || !code) {
    return NextResponse.redirect(`${adminUrl}?ig_error=access_denied&site=${site}`);
  }

  try {
    const clientId = process.env.INSTAGRAM_CLIENT_ID;
    const clientSecret = process.env.INSTAGRAM_CLIENT_SECRET;
    const redirectUri = `${appUrl}/api/instagram/callback`;

    if (!clientId || !clientSecret) {
      return NextResponse.redirect(`${adminUrl}?ig_error=missing_credentials`);
    }

    // 1. Code → 단기 토큰
    const tokenRes = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
        code,
      }),
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      console.error('[IG Callback] 단기 토큰 실패:', tokenData);
      return NextResponse.redirect(`${adminUrl}?ig_error=token_failed&site=${site}`);
    }

    let accessToken = tokenData.access_token;
    let expiresIn = 5184000;

    // 2. 단기 → 장기 토큰 (60일)
    try {
      const longToken = await exchangeForLongLivedToken(accessToken, clientSecret);
      accessToken = longToken.access_token;
      expiresIn = longToken.expires_in || 5184000;
    } catch (e) {
      console.warn('[IG Callback] 장기 토큰 교환 실패, 단기 토큰 사용:', e);
    }

    // 3. 프로필 조회
    const profileRes = await fetch(
      `https://graph.instagram.com/v21.0/me?fields=user_id,username,account_type,profile_picture_url&access_token=${accessToken}`
    );
    const profile = await profileRes.json();

    // 4. DB 저장
    await saveToken(site, accessToken, expiresIn, profile);

    console.log(`[IG Callback] ${site} 연동 완료: @${profile.username}`);
    return NextResponse.redirect(`${adminUrl}?ig_success=true&site=${site}&username=${profile.username || ''}`);
  } catch (e: any) {
    console.error('[IG Callback] 오류:', e);
    return NextResponse.redirect(`${adminUrl}?ig_error=callback_failed&site=${site}`);
  }
}
