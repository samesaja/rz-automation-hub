import { NextResponse } from 'next/server'
import { getAdminPb } from '@/lib/pocketbase-admin'

export async function GET() {
    try {
        const pb = await getAdminPb()

        // Use raw fetch to bypass SDK clock skew/header issues
        // We know the token is valid because we just got it via raw fetch in getAdminPb
        const token = pb.authStore.token.trim()

        const response = await fetch('http://34.50.111.177:8090/api/collections?sort=name', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            cache: 'no-store'
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.error('Raw fetch failed:', response.status, errorText)
            throw new Error(`Failed to fetch collections: ${response.status} ${errorText}`)
        }

        const result = await response.json()
        // The raw API returns items directly or a paginated list. 
        // pb.collections.getFullList returns an array.
        // The curl output showed "items": [...], so we need to return result.items if it exists.
        const collections = result.items || result

        return NextResponse.json(collections)
    } catch (error: any) {
        // Handle 401/403 errors gracefully without spamming console trace
        if (error.status === 401 || error.status === 403) {
            console.warn(`Access denied to collections: ${error.message}`)
            return NextResponse.json(
                { error: 'Access denied: You do not have permission to view collections.' },
                { status: 403 }
            )
        }

        console.error('Failed to fetch collections:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to fetch collections' },
            { status: 500 }
        )
    }
}
