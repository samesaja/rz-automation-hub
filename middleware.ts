import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import PocketBase from 'pocketbase'

export function middleware(request: NextRequest) {
    const authCookie = request.cookies.get('pb_auth')
    const isLoggedIn = !!authCookie?.value

    const isLoginPage = request.nextUrl.pathname === '/login'
    const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard')
    const isUsersPage = request.nextUrl.pathname.startsWith('/dashboard/users')

    // Protected routes:
    // - /dashboard/api-playground
    // - /dashboard/workflows
    // - /dashboard/logs
    // - /dashboard/showcase
    // - /dashboard/users (Admin only)
    if (isDashboardPage && !isLoggedIn) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Redirect authenticated users to dashboard
    if (isLoginPage && isLoggedIn) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // RBAC: Protect /dashboard/users
    if (isUsersPage && isLoggedIn) {
        try {
            const pb = new PocketBase('http://34.50.111.177:8090')
            pb.authStore.loadFromCookie(`pb_auth=${authCookie.value}`)

            const user = pb.authStore.model
            if (user?.role !== 'admin') {
                return NextResponse.redirect(new URL('/dashboard', request.url))
            }
        } catch (e) {
            // If token parsing fails, redirect to login
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/dashboard',
        '/dashboard/:path*',
        '/login'
    ],
}
