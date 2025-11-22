import { NextResponse } from 'next/server'
import { getAdminPb } from '@/lib/pocketbase-admin'
import { logActivity } from '@/lib/logger'

export async function GET() {
    const start = Date.now()
    try {
        const pb = await getAdminPb()
        const collections = await pb.collections.getFullList({ sort: 'name' })

        await logActivity('API: List Collections', 'success', `Fetched ${collections.length} collections`, Date.now() - start)
        return NextResponse.json(collections)
    } catch (e: any) {
        const error = e as Error
        console.error('List collections error:', e)
        await logActivity('API: List Collections', 'failed', error.message, Date.now() - start)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(req: Request) {
    const start = Date.now()
    try {
        const pb = await getAdminPb()
        const data = await req.json()

        // Validate required fields
        if (!data.name) {
            return NextResponse.json({ error: 'Collection name is required' }, { status: 400 })
        }

        const collection = await pb.collections.create({
            name: data.name,
            type: data.type || 'base',
            schema: data.schema || [],
            listRule: '@request.auth.id != ""',
            viewRule: '@request.auth.id != ""',
            createRule: '@request.auth.id != ""',
            updateRule: '@request.auth.id != ""',
            deleteRule: '@request.auth.id != ""',
        })

        await logActivity('API: Create Collection', 'success', `Created collection ${collection.name}`, Date.now() - start)
        return NextResponse.json(collection)
    } catch (e: any) {
        const error = e as Error
        console.error('Create collection error:', e)
        await logActivity('API: Create Collection', 'failed', error.message, Date.now() - start)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
