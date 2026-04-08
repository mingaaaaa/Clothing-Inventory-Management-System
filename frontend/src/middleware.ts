import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_COOKIE = 'auth_status';
const PUBLIC_PATHS = ['/login', '/_next', '/api'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authStatus = request.cookies.get(AUTH_COOKIE)?.value;

  if (pathname.startsWith('/login') && authStatus === 'true') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  if (authStatus !== 'true') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
};
