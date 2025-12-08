import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { logActivity } from '@/lib/logger'
import { ObjectId } from 'mongodb'

// Helper to convert Mongo document to PB-like record
const toUserRecord = (doc: any) => {
  if (!doc) return null;
  const { _id, ...rest } = doc;
  return {
    id: _id.toString(),
    ...rest
  };
};

export async function GET() {
  const start = Date.now()
  try {
    const db = await getDb()
    const users = await db.collection('users').find({}).limit(50).toArray()
    const serializedUsers = users.map(toUserRecord)

    await logActivity('API: List Users', 'success', `Fetched ${users.length} users`, Date.now() - start)
    return NextResponse.json(serializedUsers)
  } catch (e: any) {
    console.error('List Users Error', e);
    await logActivity('API: List Users', 'failed', e.message, Date.now() - start)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const start = Date.now()
  try {
    const data = await req.json()
    const db = await getDb()

    // Check if email exists
    const existing = await db.collection('users').findOne({ email: data.email })
    if (existing) {
      throw new Error('User with this email already exists')
    }

    const now = new Date().toISOString()
    const newUser = {
      ...data,
      invited: false, // Default for manual creation
      created: now,
      updated: now
    }

    const result = await db.collection('users').insertOne(newUser)
    const created = toUserRecord({ _id: result.insertedId, ...newUser })

    await logActivity('API: Create User', 'success', `Created user ${created.email}`, Date.now() - start)
    return NextResponse.json(created)
  } catch (e: any) {
    await logActivity('API: Create User', 'failed', e.message, Date.now() - start)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  const start = Date.now()
  try {
    const { id, ...data } = await req.json()
    if (!id) throw new Error('User ID required')

    // Remove immutable
    delete data._id
    delete data.created

    const db = await getDb()
    await db.collection('users').updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...data, updated: new Date().toISOString() } }
    )

    const updated = await db.collection('users').findOne({ _id: new ObjectId(id) })

    await logActivity('API: Update User', 'success', `Updated user ${updated?.email}`, Date.now() - start)
    return NextResponse.json(toUserRecord(updated))
  } catch (e: any) {
    await logActivity('API: Update User', 'failed', e.message, Date.now() - start)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const start = Date.now()
  try {
    const { id } = await req.json()
    if (!id) throw new Error('User ID required')

    const db = await getDb()
    await db.collection('users').deleteOne({ _id: new ObjectId(id) })

    await logActivity('API: Delete User', 'success', `Deleted user ${id}`, Date.now() - start)
    return NextResponse.json({ success: true })
  } catch (e: any) {
    await logActivity('API: Delete User', 'failed', e.message, Date.now() - start)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}


