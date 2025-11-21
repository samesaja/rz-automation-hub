import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import PocketBase from 'pocketbase'

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
  try {
    const pb = await getAuthenticatedPb()
    const users = await pb.collection('users').getList(1, 50)
    return NextResponse.json(users.items)
  } catch (e) {
    const error = e as Error
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const pb = await getAuthenticatedPb()
    const data = await req.json()
    const created = await pb.collection('users').create(data)
    return NextResponse.json(created)
  } catch (e) {
    const error = e as Error
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const pb = await getAuthenticatedPb()
    const { id, ...data } = await req.json()
    const updated = await pb.collection('users').update(id, data)
    return NextResponse.json(updated)
  } catch (e) {
    const error = e as Error
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const pb = await getAuthenticatedPb()
    const { id } = await req.json()
    await pb.collection('users').delete(id)
    return NextResponse.json({ success: true })
  } catch (e) {
    const error = e as Error
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}


