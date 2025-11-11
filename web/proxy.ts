import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin')) {
    const JWT_TOKEN = process.env.NEXT_PUBLIC_JWT_TOKEN;

    if (!JWT_TOKEN) {
      return NextResponse.redirect(new URL('/sem-acesso', request.url));
    }

    try {
      const user = JSON.parse(atob(JWT_TOKEN.split('.')[1]));

      if (user.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/sem-acesso', request.url));
      }
    } catch (err) {
      console.error('JWT inválido:', err);
      return NextResponse.redirect(new URL('/sem-acesso', request.url));
    }
  }

  if (pathname.startsWith('/indicacao')) {
    const JWT_TOKEN = process.env.NEXT_PUBLIC_JWT_TOKEN;

    if (!JWT_TOKEN) {
      return NextResponse.redirect(new URL('/sem-acesso', request.url));
    }

    try {
      const user = JSON.parse(atob(JWT_TOKEN.split('.')[1]));

      if (!user.id) {
        return NextResponse.redirect(new URL('/sem-acesso', request.url));
      }
    } catch (err) {
      console.error('JWT inválido:', err);
      return NextResponse.redirect(new URL('/sem-acesso', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/indicacao/:path*'],
};