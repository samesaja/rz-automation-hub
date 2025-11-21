// lib/pocketbase.ts
import PocketBase from 'pocketbase'

export const pb = new PocketBase('http://34.50.111.177:8090')

// Contoh login/admin method:
export async function login(email: string, password: string) {
  return await pb.collection('users').authWithPassword(email, password)
}

// Contoh tambah data
export async function createRecord(collection: string, data: any) {
  return await pb.collection(collection).create(data)
}

// Contoh get data
export async function getRecords(collection: string, params = {}) {
  return await pb.collection(collection).getList(1, 50, params)
}
