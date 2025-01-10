import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(req: Request) {
    try {
        const { userId, role } = await req.json();
        // UserId and Role is not find then return an error the fields are required
        if (!userId || !role) {
            return NextResponse.json(
                { error: 'User ID and role are required' },
                { status: 400 }
            );
        }

        // Validate the role
        if (!['admin', 'user'].includes(role)) {
            return NextResponse.json(
                { error: 'Invalid role. Allowed roles are "admin" and "user".' },
                { status: 400 }
            );
        }

        // Update the user's role in the database
        const { error } = await supabase
            .from('users')
            .update({ role })
            .eq('id', userId);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        // Successfully Role Updated successfully response is returned
        return NextResponse.json({ message: 'Role updated successfully' });
    } catch (err) {
        return NextResponse.json(
            { error: err, message: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}
