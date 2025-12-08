import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { logActivity } from '@/lib/logger'
import { ObjectId } from 'mongodb'

// Helper to convert Mongo document to PB-like record
const toRecord = (doc: any) => {
    if (!doc) return null;
    const { _id, ...rest } = doc;
    return {
        id: _id.toString(),
        ...rest
    };
};

export async function GET(req: Request) {
    const start = Date.now()
    const { searchParams } = new URL(req.url)
    const collectionName = searchParams.get('collection')
    const page = parseInt(searchParams.get('page') || '1')
    const perPage = parseInt(searchParams.get('perPage') || '30')
    const sort = searchParams.get('sort') || '-created'
    // Filter parsing is complex; skipping for MVP migration or simple exact match could be added later
    // const filter = searchParams.get('filter') || '' 

    if (!collectionName) {
        return NextResponse.json({ error: 'Collection name is required' }, { status: 400 })
    }

    try {
        const db = await getDb()
        const collection = db.collection(collectionName)

        // Count total
        const totalItems = await collection.countDocuments({})
        const totalPages = Math.ceil(totalItems / perPage)

        // Parse sort
        const sortObj: any = {}
        if (sort.startsWith('-')) {
            sortObj[sort.substring(1)] = -1
        } else {
            sortObj[sort] = 1
        }

        const docs = await collection.find({})
            .sort(sortObj)
            .skip((page - 1) * perPage)
            .limit(perPage)
            .toArray()

        const items = docs.map(toRecord)

        const result = {
            page,
            perPage,
            totalItems,
            totalPages,
            items
        }

        await logActivity('API: List Records', 'success', `Fetched records for ${collectionName}`, Date.now() - start)
        return NextResponse.json(result)
    } catch (e: any) {
        console.error('List records error:', e)
        await logActivity('API: List Records', 'failed', e.message, Date.now() - start)
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}

export async function POST(req: Request) {
    const start = Date.now()
    const { searchParams } = new URL(req.url)
    const collectionName = searchParams.get('collection')

    if (!collectionName) {
        return NextResponse.json({ error: 'Collection name is required' }, { status: 400 })
    }

    try {
        const body = await req.json()
        const db = await getDb()
        const collection = db.collection(collectionName)

        const now = new Date().toISOString()
        const newRecord = {
            ...body,
            created: now,
            updated: now
        }

        const result = await collection.insertOne(newRecord)

        const createdRecord = toRecord({ _id: result.insertedId, ...newRecord })

        await logActivity('API: Create Record', 'success', `Created record in ${collectionName}`, Date.now() - start)
        return NextResponse.json(createdRecord)
    } catch (e: any) {
        console.error('Create record error:', e)
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}

export async function PATCH(req: Request) {
    const start = Date.now()
    const { searchParams } = new URL(req.url)
    const collectionName = searchParams.get('collection')
    const id = searchParams.get('id')

    if (!collectionName || !id) {
        return NextResponse.json({ error: 'Collection and ID are required' }, { status: 400 })
    }

    try {
        const body = await req.json()
        // Remove immutable fields if present
        delete body.id
        delete body._id
        delete body.created

        const db = await getDb()
        const collection = db.collection(collectionName)

        const now = new Date().toISOString()
        const updateData = {
            ...body,
            updated: now
        }

        await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        )

        const updatedDoc = await collection.findOne({ _id: new ObjectId(id) })

        await logActivity('API: Update Record', 'success', `Updated record ${id} in ${collectionName}`, Date.now() - start)
        return NextResponse.json(toRecord(updatedDoc))
    } catch (e: any) {
        console.error('Update record error:', e)
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}

export async function DELETE(req: Request) {
    const start = Date.now()
    const { searchParams } = new URL(req.url)
    const collectionName = searchParams.get('collection')
    const id = searchParams.get('id')

    if (!collectionName || !id) {
        return NextResponse.json({ error: 'Collection and ID are required' }, { status: 400 })
    }

    try {
        const db = await getDb()
        const collection = db.collection(collectionName)

        await collection.deleteOne({ _id: new ObjectId(id) })

        await logActivity('API: Delete Record', 'success', `Deleted record ${id} from ${collectionName}`, Date.now() - start)
        return NextResponse.json({ success: true })
    } catch (e: any) {
        console.error('Delete record error:', e)
        await logActivity('API: Delete Record', 'failed', e.message, Date.now() - start)
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}
