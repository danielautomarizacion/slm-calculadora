import { NextRequest, NextResponse } from 'next/server'
import { verifySession, cookieName } from '@/lib/auth'

const PUBLIC_PATHS = ['/login', '/api/auth', '/api/health']

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Permitir rutas públicas y assets estáticos
  if (
    PUBLIC_PATHS.some(p => pathname.startsWith(p)) ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  const token = request.cookies.get(cookieName())?.value
  if (!token || !(await verifySession(token))) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
