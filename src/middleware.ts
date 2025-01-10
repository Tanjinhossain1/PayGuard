import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function middleware(req: Request) {
  const token = req.headers.get('Authorization')?.split(' ')[1];

  // Define paths where middleware applies
  const { pathname } = new URL(req.url);

  // Check if token exists
  if (token) {
    // Check if the user is logged in
    const { data } = await supabase.auth.getUser(token);

    if (data?.user && (pathname === '/login' || pathname === '/signup')) {
      // Redirect logged-in users trying to access login or signup
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // Redirect users without a token trying to access protected routes
  if (!token && pathname !== '/login' && pathname !== '/signup') {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

// Apply middleware only to specific routes
export const config = {
  matcher: ['/', '/login', '/signup'],
};
