# PocketBase Integration Guide

## 🚀 Setup Selesai!

Project ini sudah terintegrasi dengan PocketBase di `http://34.50.111.177:8090`

## 📁 Struktur File

```
├── lib/
│   └── pocketbase.ts          # PocketBase client & helper functions
├── app/
│   ├── api/
│   │   └── users/
│   │       └── route.ts       # API routes untuk CRUD users
│   └── dashboard/
│       └── users/
│           └── page.tsx       # UI untuk manage users
```

## 🔧 Cara Menggunakan

### 1. Akses Halaman Users
Buka browser dan navigasi ke:
```
http://localhost:3000/dashboard/users
```

Atau klik tombol **"Users"** di dashboard Quick Actions.

### 2. API Endpoints yang Tersedia

#### GET - Ambil semua users
```bash
curl http://localhost:3000/api/users
```

#### POST - Buat user baru
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "passwordConfirm": "password123",
    "username": "newuser"
  }'
```

#### PATCH - Update user
```bash
curl -X PATCH http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "id": "USER_ID_HERE",
    "username": "updatedname"
  }'
```

#### DELETE - Hapus user
```bash
curl -X DELETE http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"id": "USER_ID_HERE"}'
```

## 💡 Cara Menambah Collection Baru

### 1. Buat API Route
Buat file baru: `app/api/[collection-name]/route.ts`

```typescript
import { NextResponse } from 'next/server'
import { pb } from '@/lib/pocketbase'

export async function GET() {
  try {
    const records = await pb.collection('your_collection').getList(1, 50)
    return NextResponse.json(records.items)
  } catch (e) {
    const error = e as Error
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
```

### 2. Buat UI Page
Buat file: `app/dashboard/[collection-name]/page.tsx`

```typescript
'use client'

import { useState, useEffect } from 'react'

export default function YourCollectionPage() {
  const [data, setData] = useState([])
  
  useEffect(() => {
    fetch('/api/your-collection')
      .then(res => res.json())
      .then(setData)
  }, [])
  
  return (
    <div>
      {/* Your UI here */}
    </div>
  )
}
```

## 🔐 Authentication (Opsional)

Untuk menambahkan login:

```typescript
import { pb, login } from '@/lib/pocketbase'

// Login
const authData = await login('user@example.com', 'password')

// Check if authenticated
if (pb.authStore.isValid) {
  console.log('User logged in:', pb.authStore.model)
}

// Logout
pb.authStore.clear()
```

## 📊 Realtime Subscriptions (Opsional)

PocketBase mendukung realtime updates:

```typescript
// Subscribe to changes
pb.collection('users').subscribe('*', (e) => {
  console.log('Record changed:', e.record)
})

// Unsubscribe
pb.collection('users').unsubscribe('*')
```

## 🛠️ Helper Functions di `lib/pocketbase.ts`

```typescript
// Get records dengan filter
const records = await getRecords('users', {
  filter: 'created >= "2024-01-01"',
  sort: '-created'
})

// Create record
const newRecord = await createRecord('users', {
  email: 'test@example.com',
  username: 'testuser'
})
```

## 🌐 PocketBase Admin Panel

Akses admin panel PocketBase di:
```
http://34.50.111.177:8090/_/
```

Di sini Anda bisa:
- Membuat collection baru
- Manage users
- Set permissions
- View logs
- Configure settings

## 📝 Tips

1. **CORS**: Pastikan PocketBase sudah dikonfigurasi untuk allow origin dari Next.js app
2. **Environment Variables**: Untuk production, simpan URL PocketBase di `.env`:
   ```
   NEXT_PUBLIC_POCKETBASE_URL=http://34.50.111.177:8090
   ```
3. **Type Safety**: Buat TypeScript interfaces untuk collections Anda
4. **Error Handling**: Selalu handle error dari PocketBase API calls

## 🎯 Next Steps

- [ ] Tambahkan authentication UI
- [ ] Buat form untuk create/edit users
- [ ] Tambahkan pagination untuk large datasets
- [ ] Implementasi search & filter
- [ ] Tambahkan collection lain sesuai kebutuhan
- [ ] Setup realtime updates untuk live data

## 📚 Resources

- [PocketBase Docs](https://pocketbase.io/docs/)
- [PocketBase JavaScript SDK](https://github.com/pocketbase/js-sdk)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
