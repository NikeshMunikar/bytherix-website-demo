import { type NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_ACCESS_SECRET ?? 'change-this-secret'
)

const PROTECTED = ['/dashboard', '/my-learning', '/profile', '/settings']
const AUTH_ONLY = ['/login', '/register']

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('accessToken')?.value

  if (AUTH_ONLY.some((p) => pathname.startsWith(p)) && token) {
    try {
      await jwtVerify(token, JWT_SECRET)
      return NextResponse.redirect(new URL('/dashboard', request.url))
    } catch {}
  }

  if (PROTECTED.some((p) => pathname.startsWith(p))) {
    if (!token) {
      const url = new URL('/login', request.url)
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET)
      const res = NextResponse.next()
      res.headers.set('x-user-id', String(payload['sub'] ?? ''))
      res.headers.set('x-user-role', String(payload['role'] ?? 'USER'))
      return res
    } catch {
      const url = new URL('/login', request.url)
      url.searchParams.set('redirect', pathname)
      const res = NextResponse.redirect(url)
      res.cookies.delete('accessToken')
      return res
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/my-learning/:path*', '/profile/:path*', '/settings/:path*', '/login', '/register'],
}