# Setup PocketBase Collections & Seed Data

## 📋 Langkah-langkah Setup

### 1. Buat Collection di PocketBase Admin

Akses PocketBase Admin Panel: `http://34.50.111.177:8090/_/`

#### Collection: `workflows`

Buat collection baru dengan nama **workflows** dan field berikut:

| Field Name | Type | Required | Options |
|------------|------|----------|---------|
| `name` | Text | ✅ | - |
| `status` | Text | ✅ | Default: "idle" |
| `lastRun` | Text | ✅ | ISO Date string |
| `executions` | Number | ✅ | Default: 0 |
| `successRate` | Number | ✅ | Min: 0, Max: 100 |
| `description` | Text | ❌ | Optional |

**Permissions (untuk testing):**
- View: `@request.auth.id != ""`  atau `""` (public)
- Create: `@request.auth.id != ""` atau `""` (public)
- Update: `@request.auth.id != ""` atau `""` (public)
- Delete: `@request.auth.id != ""` atau `""` (public)

> ⚠️ **Note**: Untuk production, set permissions yang lebih strict!

### 2. Install Dependencies

```bash
npm install tsx --save-dev
```

### 3. Seed Data ke PocketBase

Jalankan script seed untuk menambahkan data dummy:

```bash
npm run seed
```

Output yang diharapkan:
```
🌱 Seeding workflows to PocketBase...
✅ Created workflow: Data Sync Pipeline
✅ Created workflow: Email Automation
✅ Created workflow: Report Generator
✅ Created workflow: Backup Service
✨ Seeding completed!
```

### 4. Verifikasi Data

1. **Via Admin Panel**:
   - Buka `http://34.50.111.177:8090/_/`
   - Klik collection "workflows"
   - Anda akan melihat 4 workflows yang baru dibuat

2. **Via API**:
   ```bash
   curl http://localhost:3000/api/workflows
   ```

3. **Via UI**:
   - Buka `http://localhost:3000/dashboard/workflows`
   - Anda akan melihat workflows dari PocketBase

## 🎯 Hasil Akhir

Setelah setup selesai:

- ✅ Data dummy sudah tidak ada di frontend
- ✅ Semua data disimpan di PocketBase
- ✅ Frontend fetch data real-time dari PocketBase
- ✅ CRUD operations berfungsi (Create, Read, Update, Delete)
- ✅ Toggle status workflow berfungsi
- ✅ Refresh data berfungsi

## 🔄 Menambah Data Lagi

Jika ingin menambah data lagi, edit file `scripts/seed-pocketbase.ts` dan jalankan:

```bash
npm run seed
```

## 🗑️ Reset Data

Untuk menghapus semua data dan mulai fresh:

1. Buka PocketBase Admin
2. Masuk ke collection "workflows"
3. Select all → Delete
4. Jalankan `npm run seed` lagi

## 📝 Troubleshooting

### Error: "Failed to create record"
- Pastikan PocketBase server running di `http://34.50.111.177:8090`
- Check permissions di collection settings
- Pastikan semua required fields ada

### Error: "Failed to fetch workflows"
- Check console browser untuk error detail
- Pastikan API route `/api/workflows` accessible
- Verify PocketBase URL di `lib/pocketbase.ts`

### Data tidak muncul di UI
- Refresh halaman
- Check browser console untuk errors
- Verify data ada di PocketBase Admin Panel
- Check network tab untuk API responses

## 🚀 Next Steps

Sekarang Anda bisa:
- Tambah collection lain (products, posts, dll)
- Implementasi authentication
- Setup realtime subscriptions
- Tambah pagination untuk large datasets
