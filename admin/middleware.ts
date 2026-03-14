import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const session = request.cookies.get('admin_session')
  const isLoginPage = request.nextUrl.pathname === '/login'

  // If the user is on the login page and has a session, redirect to home
  if (isLoginPage && session) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // If the user doesn't have a session and is NOT on the login page, redirect to login
  if (!session && !isLoginPage) {
    // Only redirect if it's not a public asset or api
    if (
      !request.nextUrl.pathname.startsWith('/_next') &&
      !request.nextUrl.pathname.startsWith('/public') &&
      !request.nextUrl.pathname.startsWith('/favicon.ico')
    ) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
