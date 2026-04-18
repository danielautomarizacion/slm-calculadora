import { SignJWT, jwtVerify } from 'jose'

const COOKIE_NAME = 'slm_session'
const TTL_SECONDS = 30 * 24 * 60 * 60  // 30 días

function getSecret(): Uint8Array {
  const s = process.env.SESSION_SECRET
  if (!s) throw new Error('SESSION_SECRET no configurado')
  return new TextEncoder().encode(s)
}

export async function signSession(): Promise<string> {
  return new SignJWT({ ok: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${TTL_SECONDS}s`)
    .sign(getSecret())
}

export async function verifySession(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, getSecret())
    return true
  } catch {
    return false
  }
}

export function cookieName(): string {
  return COOKIE_NAME
}

export function cookieOptions() {
  return {
    name:     COOKIE_NAME,
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge:   TTL_SECONDS,
    path:     '/',
  }
}
