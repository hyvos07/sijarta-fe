import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PEKERJA_PATHS = [
  '/kelola-pekerjaan',
  '/status-pekerjaan',
]

const PELANGGAN_PATHS = [
  '/diskon',
  '/testimoni',
]

const PROTECTED_PATHS = [
  '/mypay',
  '/profile',
  ...PEKERJA_PATHS,
  ...PELANGGAN_PATHS,
]

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get('auth-token')
  const userType = request.cookies.get('type')?.value
  const path = request.nextUrl.pathname
  const isLoginPage = path === '/login'

  // Auth check for all protected routes
  if (!authCookie && !isLoginPage) {
    if (PROTECTED_PATHS.some(prefix => path.startsWith(prefix))) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  if (authCookie && isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Restrict access to PEKERJA_PATHS for non-pekerja users
  if (PEKERJA_PATHS.some(prefix => path.startsWith(prefix)) && userType !== 'pekerja') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Restrict access to PELANGGAN_PATHS for non-pelanggan users
  if (PELANGGAN_PATHS.some(prefix => path.startsWith(prefix)) && userType !== 'pelanggan') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/mypay/:path*',
    '/transaksi/:path*',
    '/profile/:path*',
    '/kelola-pekerjaan/:path*',
  ]
}