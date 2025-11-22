import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import PocketBase from 'pocketbase'
import { logActivity } from '@/lib/logger'

// Helper to get authenticated PB client
async function getAuthenticatedPb() {
  const cookieStore = cookies()
  const pb = new PocketBase('http://34.50.111.177:8090')

  const authCookie = cookieStore.get('pb_auth')
  if (authCookie) {
    pb.authStore.loadFromCookie(`pb_auth=${authCookie.value}`)
  }

  return pb
}

export async function GET() {
  const start = Date.now()
  try {
    const pb = await getAuthenticatedPb()
    const users = await pb.collection('users').getList(1, 50)

    await logActivity('API: List Users', 'success', `Fetched ${users.items.length} users`, Date.now() - start)
    return NextResponse.json(users.items)
  } catch (e) {
    const error = e as Error
    await logActivity('API: List Users', 'failed', error.message, Date.now() - start)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const start = Date.now()
  try {
    const pb = await getAuthenticatedPb()
    const data = await req.json()
    const created = await pb.collection('users').create(data)

    await logActivity('API: Create User', 'success', `Created user ${created.email}`, Date.now() - start)
    return NextResponse.json(created)
  } catch (e) {
    const error = e as Error
    await logActivity('API: Create User', 'failed', error.message, Date.now() - start)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  const start = Date.now()
  try {
    const pb = await getAuthenticatedPb()
    const { id, ...data } = await req.json()
    const updated = await pb.collection('users').update(id, data)

    await logActivity('API: Update User', 'success', `Updated user ${updated.email}`, Date.now() - start)
    return NextResponse.json(updated)
  } catch (e) {
    const error = e as Error
    await logActivity('API: Update User', 'failed', error.message, Date.now() - start)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const start = Date.now()
  try {
    const pb = await getAuthenticatedPb()
    const { id } = await req.json()
    await pb.collection('users').delete(id)

    await logActivity('API: Delete User', 'success', `Deleted user ${id}`, Date.now() - start)
    return NextResponse.json({ success: true })
  } catch (e) {
    const error = e as Error
    await logActivity('API: Delete User', 'failed', error.message, Date.now() - start)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}


