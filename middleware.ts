import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const isAdminPage = req.nextUrl.pathname.startsWith('/admin');
  const isProtectedApi = req.nextUrl.pathname.startsWith('/api/photos') && req.method !== 'GET';
  const isProtectedTimelineApi = req.nextUrl.pathname.startsWith('/api/timeline-photo') && req.method !== 'GET';
  const isProtectedTimelineDataApi = req.nextUrl.pathname.startsWith('/api/timeline') && req.method !== 'GET' && !req.nextUrl.pathname.startsWith('/api/timeline-photo');
  const isProtectedSettingsApi = req.nextUrl.pathname.startsWith('/api/settings') && req.method !== 'GET';
  const isProtectedAdminActionApi = req.nextUrl.pathname.startsWith('/api/admin');

  if (isAdminPage || isProtectedApi || isProtectedTimelineApi || isProtectedTimelineDataApi || isProtectedSettingsApi || isProtectedAdminActionApi) {
    const basicAuth = req.headers.get('authorization');

    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1];
      const [user, pwd] = atob(authValue).split(':');

      const validEmail = process.env.ADMIN_EMAIL;
      const validPassword = process.env.ADMIN_PASSWORD;
      
      // If the email and password match the ones in .env.local, let them in!
      if (validEmail && validPassword && user === validEmail && pwd === validPassword) {
        return NextResponse.next();
      }
    }

    return new NextResponse('Authentication required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/photos/:path*', '/api/timeline-photo/:path*', '/api/timeline/:path*', '/api/settings/:path*', '/api/admin/:path*'],
};
