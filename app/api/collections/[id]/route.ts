import { NextResponse } from 'next/server'
import { getAdminPb } from '@/lib/pocketbase-admin'
import { logActivity } from '@/lib/logger'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    const start = Date.now()
    try {
        const pb = await getAdminPb()
        const data = await req.json()
        const { id } = params

        const collection = await pb.collections.update(id, data)

        await logActivity('API: Update Collection', 'success', `Updated collection ${collection.name}`, Date.now() - start)
        return NextResponse.json(collection)
    } catch (e: any) {
        const error = e as Error
        console.error('Update collection error:', e)
        await logActivity('API: Update Collection', 'failed', error.message, Date.now() - start)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const start = Date.now()
    try {
        const pb = await getAdminPb()
        const { id } = params

        await pb.collections.delete(id)

        await logActivity('API: Delete Collection', 'success', `Deleted collection ${id}`, Date.now() - start)
        return NextResponse.json({ success: true })
    } catch (e: any) {
        const error = e as Error
        console.error('Delete collection error:', e)
        await logActivity('API: Delete Collection', 'failed', error.message, Date.now() - start)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
