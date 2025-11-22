import { NextResponse } from 'next/server'
import PocketBase from 'pocketbase'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { email, password } = body

        // Initialize PocketBase server-side
        const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://34.50.111.177:8090')

        // Authenticate
        const authData = await pb.collection('users').authWithPassword(email, password)

        // Set cookie
        const cookieStore = cookies()
        const cookie = pb.authStore.exportToCookie({ httpOnly: false })

        // Parse and set cookie
        const cookieParts = cookie.split(';')
        const authCookiePart = cookieParts[0] // pb_auth=...
        const [name, value] = authCookiePart.split('=')

        cookieStore.set(name, value, {
            path: '/',
            secure: false, // See note in register route about HTTP/HTTPS
            sameSite: 'lax',
            httpOnly: false
        })

        return NextResponse.json({ success: true, user: authData.record })

    } catch (error: any) {
        console.error('Login API Error:', error)

        const message = error?.data?.message || error?.message || 'Invalid email or password'

        return NextResponse.json(
            { error: message },
            { status: error.status || 401 }
        )
    }
}
