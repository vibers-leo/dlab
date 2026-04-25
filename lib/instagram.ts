import pool from './db';

/**
 * Instagram Graph API — 디랩용
 * 팬이지 패턴 기반, Firestore → PostgreSQL
 */

const GRAPH_API = 'https://graph.instagram.com';
const API_VERSION = 'v21.0';

// ── Graph API ──

export async function fetchInstagramMedia(accessToken: string, count = 12) {
  const fields = 'id,caption,media_url,permalink,timestamp,media_type,thumbnail_url';
  const url = `${GRAPH_API}/${API_VERSION}/me/media?fields=${fields}&limit=${count}&access_token=${accessToken}`;
  const res = await fetch(url);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || res.statusText);
  }
  const { data } = await res.json();
  return (data || []).filter((m: any) => m.media_url || m.thumbnail_url).map((m: any, i: number) => ({
    id: m.id,
    imageUrl: m.media_type === 'VIDEO' ? (m.thumbnail_url || m.media_url) : m.media_url,
    caption: m.caption || '',
    postUrl: m.permalink,
    mediaType: m.media_type,
    postedAt: m.timestamp,
    order: i,
  }));
}

export async function exchangeForLongLivedToken(shortToken: string, appSecret: string) {
  const url = `${GRAPH_API}/access_token?grant_type=ig_exchange_token&client_secret=${appSecret}&access_token=${shortToken}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('장기 토큰 교환 실패');
  return res.json() as Promise<{ access_token: string; expires_in: number }>;
}

export async function refreshLongLivedToken(token: string) {
  const url = `${GRAPH_API}/refresh_access_token?grant_type=ig_refresh_token&access_token=${token}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('토큰 갱신 실패');
  return res.json() as Promise<{ access_token: string; expires_in: number }>;
}

export async function verifyToken(token: string) {
  const url = `${GRAPH_API}/${API_VERSION}/me?fields=id,username&access_token=${token}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('토큰 검증 실패');
  return res.json() as Promise<{ id: string; username: string }>;
}

// ── Token Manager (PostgreSQL) ──

const REFRESH_THRESHOLD_MS = 7 * 24 * 60 * 60 * 1000; // 7일

export async function getAccessToken(site: string): Promise<string> {
  const { rows } = await pool.query(
    'SELECT * FROM collab.instagram_tokens WHERE site = $1', [site]
  );
  if (!rows[0]) throw new Error(`${site} 인스타그램 토큰 미등록`);

  const token = rows[0];
  const expiresAt = new Date(token.expires_at);
  const now = new Date();

  if (expiresAt.getTime() - now.getTime() < REFRESH_THRESHOLD_MS) {
    try {
      const refreshed = await refreshLongLivedToken(token.access_token);
      const newExpires = new Date(now.getTime() + refreshed.expires_in * 1000);
      await pool.query(
        'UPDATE collab.instagram_tokens SET access_token=$1, expires_at=$2, updated_at=NOW() WHERE site=$3',
        [refreshed.access_token, newExpires, site]
      );
      return refreshed.access_token;
    } catch {
      if (expiresAt > now) return token.access_token;
      throw new Error(`${site} 인스타그램 토큰 만료`);
    }
  }

  return token.access_token;
}

export async function saveToken(site: string, accessToken: string, expiresIn: number, profile: any) {
  const expiresAt = new Date(Date.now() + expiresIn * 1000);
  await pool.query(`
    INSERT INTO collab.instagram_tokens (site, access_token, user_id, username, account_type, profile_picture_url, expires_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    ON CONFLICT (site) DO UPDATE SET
      access_token = EXCLUDED.access_token, user_id = EXCLUDED.user_id, username = EXCLUDED.username,
      account_type = EXCLUDED.account_type, profile_picture_url = EXCLUDED.profile_picture_url,
      expires_at = EXCLUDED.expires_at, updated_at = NOW()
  `, [site, accessToken, profile.user_id || profile.id, profile.username, profile.account_type, profile.profile_picture_url, expiresAt]);
}

export async function getTokenStatus(site: string) {
  const { rows } = await pool.query(
    'SELECT username, expires_at FROM collab.instagram_tokens WHERE site = $1', [site]
  );
  if (!rows[0]) return { hasToken: false };
  const expiresAt = new Date(rows[0].expires_at);
  const now = new Date();
  return {
    hasToken: true,
    username: rows[0].username,
    expiresAt,
    isExpiringSoon: expiresAt.getTime() - now.getTime() < REFRESH_THRESHOLD_MS,
    isExpired: expiresAt < now,
  };
}

// ── Sync: 게시물 DB 저장 ──

export async function syncInstagramFeed(site: string) {
  const token = await getAccessToken(site);
  const posts = await fetchInstagramMedia(token, 20);

  for (const p of posts) {
    await pool.query(`
      INSERT INTO collab.instagram_posts (site, post_id, image_url, caption, post_url, media_type, posted_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (site, post_id) DO UPDATE SET image_url=EXCLUDED.image_url, caption=EXCLUDED.caption, post_url=EXCLUDED.post_url
    `, [site, p.id, p.imageUrl, p.caption, p.postUrl, p.mediaType, p.postedAt]);
  }

  return posts.length;
}
