import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // auth 페이지는 제외
  if (pathname === '/auth') {
    return NextResponse.next();
  }
  
  // 정적 파일과 API 라우트 제외
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') // 파일 확장자가 있는 경우
  ) {
    return NextResponse.next();
  }
  
  // 쿠키에서 로그인 상태 확인
  const isLoggedIn = request.cookies.get('is_logged_in');
  
  if (!isLoggedIn && pathname !== '/auth') {
    return NextResponse.redirect(new URL('/auth', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};