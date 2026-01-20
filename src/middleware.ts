import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

// Simple in-memory rate limiter (Note: This is per-instance and volatile on serverless)
const rateLimit = new Map();

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10; // 10 requests per minute

function isRateLimited(ip: string) {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;

  const requestLog = rateLimit.get(ip) || [];
  // Filter out old requests
  const recentRequests = requestLog.filter((time: number) => time > windowStart);

  if (recentRequests.length >= MAX_REQUESTS) {
    return true;
  }

  recentRequests.push(now);
  rateLimit.set(ip, recentRequests);
  return false;
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Rate Limiting for Auth Routes
  if (
    pathname.includes('/api/users/login') ||
    (pathname.includes('/api/users') && request.method === 'POST')
  ) {
    const ip = (request as any).ip || request.headers.get('x-forwarded-for') || 'unknown';

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { message: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }
  }

  // 2. Internationalization Middleware
  // Skip next-intl for API routes and static files to avoid conflicts
  if (
    !pathname.startsWith('/api') &&
    !pathname.startsWith('/_next') &&
    !pathname.startsWith('/uploads') && // Exclude public uploads
    !pathname.includes('.') // Exclude files with extensions
  ) {
    return intlMiddleware(request);
  }

  return NextResponse.next();
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(es|en|it)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)'],
};
