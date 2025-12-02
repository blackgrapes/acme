import { NextResponse } from 'next/server';

export function middleware(request) {
  const response = NextResponse.next();
  
  // Security headers for uploads
  if (request.nextUrl.pathname.startsWith('/uploads/')) {
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
  }
  
  return response;
}

export const config = {
  matcher: '/uploads/:path*',
};