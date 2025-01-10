import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, role } = body;
    console.log(body)
    // email and password is not find then return an error the fields are required
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Insert the user role into the database
    const { error: dbError } = await supabase
      .from('users')
      .insert([{ id: data.user?.id,password:hashedPassword, email, role: role ? role : "user"}]);
      console.log('db error role add in supabase ', data)
    // If any error in db then return the error message
    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 400 });
    }
    // Successfully inserted send response
    return NextResponse.json({ message: 'User created successfully' });
  } catch (err) {
    return NextResponse.json(
      { error:err, message: 'An unexpected error occurred' },
      { status: 500 },
    );
  }
}
