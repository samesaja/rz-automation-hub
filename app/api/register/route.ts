import { NextResponse } from 'next/server'
import PocketBase from 'pocketbase'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { email, password, passwordConfirm } = body

        // Initialize PocketBase server-side
        // Use the public URL or internal URL if available. 
        // Since we are on Vercel, we use the public IP.
        const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://34.50.111.177:8090')

        // 1. Create user
        await pb.collection('users').create({
            email,
            password,
            passwordConfirm,
            emailVisibility: true,
            role: 'admin'
        })

        // 2. Authenticate to get token
        const authData = await pb.collection('users').authWithPassword(email, password)

        // 3. Set cookie
        // We need to manually set the cookie header for the response
        const cookieStore = cookies()
        const cookie = pb.authStore.exportToCookie({ httpOnly: false })

        // Parse the cookie string to set it properly using next/headers
        // Format is usually: pb_auth=...; Path=/; Expires=...
        const cookieParts = cookie.split(';')
        const authCookiePart = cookieParts[0] // pb_auth=...
        const [name, value] = authCookiePart.split('=')

        cookieStore.set(name, value, {
            path: '/',
            secure: false, // Set to true if PB is HTTPS, but it's HTTP here. 
            // However, Vercel is HTTPS. 
            // Ideally, PB should be HTTPS. 
            // For now, false is safer for the HTTP backend connection, 
            // but the browser cookie should probably be secure if on HTTPS.
            // Let's stick to default or what exportToCookie gave, but we are reconstructing it.
            sameSite: 'lax',
            httpOnly: false
        })

        return NextResponse.json({ success: true, user: authData.record })

    } catch (error: any) {
        console.error('Registration API Error:', error)

        // Return detailed error for debugging
        const message = error?.data?.message || error?.message || 'Failed to register'
        const details = error?.data?.data

        return NextResponse.json(
            { error: message, details },
            { status: error.status || 500 }
        )
    }
}
