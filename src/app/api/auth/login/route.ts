import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();
        // email and password is not find then return an error the fields are required
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Sign in user with Supabase Auth
        const { data } = await supabase.auth.signInWithPassword({
            email,
            password,
            options:{captchaToken:'role'}
        });
        const response = NextResponse.json({ message: 'Login successful' });
        if (!data.session?.access_token) {
            return NextResponse.json({ error: 'Token is missing' }, { status: 400 });
          }
          
          response.cookies.set('supabase_token', data.session.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
          });
          
    
        return response;
    
    } catch (err) {
        return NextResponse.json(
            { error: err, message: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}
