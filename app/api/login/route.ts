import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { email, password } = body

        console.log('Login attempt (MongoDB):', { email })

        const db = await getDb();
        const usersCollection = db.collection('users');

        // Check if ANY users exist. If not, create default admin.
        const userCount = await usersCollection.countDocuments();
        if (userCount === 0) {
            console.log('No users found. Creating default admin.');
            await usersCollection.insertOne({
                email: 'admin@example.com',
                password: 'password123', // In real app, HASH THIS!
                role: 'admin',
                name: 'System Admin',
                created: new Date().toISOString()
            });
            // If the user is trying to login as admin/password123, let them proceed strictly after creation
        }

        const user = await usersCollection.findOne({ email });

        if (!user || user.password !== password) { // Simple plaintext check for MVP migration
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            )
        }

        // Create simple session cookie
        const cookieStore = cookies()
        // Simple JSON session for now
        const sessionData = JSON.stringify({
            id: user._id.toString(),
            email: user.email,
            role: user.role
        });

        // Encode in base64 to avoid special char issues in cookie
        const sessionToken = Buffer.from(sessionData).toString('base64');

        cookieStore.set('pb_auth', sessionToken, { // Keeping 'pb_auth' name for frontend compatibility if possible, or 'auth_token'
            path: '/',
            secure: false,
            sameSite: 'lax',
            httpOnly: false
        })

        return NextResponse.json({
            success: true,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role
            },
            token: sessionToken
        })

    } catch (error: any) {
        console.error('Login API Error:', error)
        return NextResponse.json(
            { error: error?.message || 'Login failed' },
            { status: 500 }
        )
    }
}
