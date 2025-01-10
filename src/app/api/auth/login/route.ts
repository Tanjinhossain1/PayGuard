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
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        // Return success login status
        return NextResponse.json({ message: 'Login successful', session: data });
    } catch (err) {
        return NextResponse.json(
            { error: err, message: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}
