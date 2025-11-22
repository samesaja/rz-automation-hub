import { NextResponse } from 'next/server'
import { getAdminPb } from '@/lib/pocketbase-admin'
import { logActivity } from '@/lib/logger'

export async function GET(req: Request) {
    const start = Date.now()
    const { searchParams } = new URL(req.url)
    const collection = searchParams.get('collection')
    const page = parseInt(searchParams.get('page') || '1')
    const perPage = parseInt(searchParams.get('perPage') || '20')
    const sort = searchParams.get('sort') || '-created'
    const filter = searchParams.get('filter') || ''

    if (!collection) {
        return NextResponse.json({ error: 'Collection name is required' }, { status: 400 })
    }

    try {
        const pb = await getAdminPb()

        // Map -created to -id because some collections (like app_logs) might miss created field
        // but id is time-sortable.
        const finalSort = sort === '-created' ? '-id' : sort

        const options: any = { sort: finalSort }
        if (filter) {
            options.filter = filter
        }

        const result = await pb.collection(collection).getList(page, perPage, options)

        await logActivity('API: List Records', 'success', `Fetched records for ${collection}`, Date.now() - start)
        return NextResponse.json(result)
    } catch (e: any) {
        const error = e as Error
        console.error('List records error:', e)
        await logActivity('API: List Records', 'failed', error.message, Date.now() - start)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function DELETE(req: Request) {
    const start = Date.now()
    const { searchParams } = new URL(req.url)
    const collection = searchParams.get('collection')
    const id = searchParams.get('id')

    if (!collection || !id) {
        return NextResponse.json({ error: 'Collection and ID are required' }, { status: 400 })
    }

    try {
        const pb = await getAdminPb()
        await pb.collection(collection).delete(id)

        await logActivity('API: Delete Record', 'success', `Deleted record ${id} from ${collection}`, Date.now() - start)
        return NextResponse.json({ success: true })
    } catch (e: any) {
        const error = e as Error
        console.error('Delete record error:', e)
        await logActivity('API: Delete Record', 'failed', error.message, Date.now() - start)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
