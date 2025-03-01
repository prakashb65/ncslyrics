import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Pages that should be cached
const CACHED_PATHS = [
  '/',
  '/lyrics',
  '/playlists',
];

// Assets that should be cached
const CACHED_ASSETS = [
  'images',
  'fonts',
  'css',
  'js',
];

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Don't cache admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    response.headers.set('Cache-Control', 'no-store');
    return response;
  }

  // Cache static assets
  if (request.nextUrl.pathname.match(/\.(css|js|jpg|png|svg|webp)$/)) {
    response.headers.set(
      'Cache-Control',
      'public, max-age=31536000, immutable'
    );
    return response;
  }

  // Cache API responses
  if (request.nextUrl.pathname.startsWith('/api')) {
    if (request.method !== 'GET') {
      response.headers.set('Cache-Control', 'no-store');
      return response;
    }

    response.headers.set(
      'Cache-Control',
      'public, s-maxage=60, stale-while-revalidate=300'
    );
    return response;
  }

  // Cache pages
  if (CACHED_PATHS.includes(request.nextUrl.pathname)) {
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=60, stale-while-revalidate=300'
    );
  }

  // Default caching for pages
  response.headers.set(
    'Cache-Control',
    'public, s-maxage=30, stale-while-revalidate=60'
  );

  return response;
}

// Configure which paths should be processed by this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (Auth0 endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
}; 