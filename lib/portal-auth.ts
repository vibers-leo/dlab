import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import pool from './db';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'dlab-portal-dev-secret'
);

export const PORTAL_COOKIE = 'dlab_portal_session';

export interface PortalUser {
  id: number;
  login_id: string;
  name: string;
  email: string | null;
  role: string;       // client | admin
  entity_id: number | null;
  credits: number;
}

export async function createPortalSession(user: PortalUser): Promise<string> {
  return new SignJWT({ ...user })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function verifyPortalSession(token: string): Promise<PortalUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as PortalUser;
  } catch {
    return null;
  }
}

export async function getPortalSession(): Promise<PortalUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(PORTAL_COOKIE)?.value;
  if (!token) return null;
  return verifyPortalSession(token);
}

export async function requirePortalSession(): Promise<PortalUser> {
  const user = await getPortalSession();
  if (!user) throw new Error('Unauthorized');
  return user;
}

export async function requireAdmin(): Promise<PortalUser> {
  const user = await requirePortalSession();
  if (user.role !== 'admin') throw new Error('Forbidden');
  return user;
}

// 로그인 시 DB에서 최신 크레딧 조회하여 세션 갱신
export async function refreshCredits(clientId: number): Promise<number> {
  const { rows } = await pool.query('SELECT credits FROM collab.clients WHERE id = $1', [clientId]);
  return rows[0]?.credits ?? 0;
}
