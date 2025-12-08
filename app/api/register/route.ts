import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { email, password, passwordConfirm } = body

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            )
        }

        if (password !== passwordConfirm) {
            return NextResponse.json(
                { error: 'Passwords do not match' },
                { status: 400 }
            )
        }

        const db = await getDb();
        const usersCollection = db.collection('users');

        // 1. Check if user exists
        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 400 }
            )
        }

        // 2. Create user
        const now = new Date().toISOString();
        const newUser = {
            email,
            password, // Plaintext for MVP consistency with Login route
            emailVisibility: true,
            role: 'admin', // Defaulting to admin for this automation hub use case
            created: now,
            updated: now,
            name: email.split('@')[0]
        };

        const result = await usersCollection.insertOne(newUser);

        // 3. Create session (Login immediately)
        const user = { ...newUser, id: result.insertedId.toString(), _id: result.insertedId };

        const cookieStore = cookies()
        const sessionData = JSON.stringify({
            id: user.id,
            email: user.email,
            role: user.role
        });

        const sessionToken = Buffer.from(sessionData).toString('base64');

        cookieStore.set('pb_auth', sessionToken, {
            path: '/',
            secure: false,
            sameSite: 'lax',
            httpOnly: false
        })

        return NextResponse.json({ success: true, user: user })

    } catch (error: any) {
        console.error('Registration API Error:', error)
        return NextResponse.json(
            { error: error?.message || 'Failed to register' },
            { status: 500 }
        )
    }
}
