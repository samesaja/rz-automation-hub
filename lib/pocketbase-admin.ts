import PocketBase from 'pocketbase'

// Helper to get an authenticated admin client
export async function getAdminPb() {
    const pb = new PocketBase('http://34.50.111.177:8090')

    const email = process.env.POCKETBASE_ADMIN_EMAIL
    const password = process.env.POCKETBASE_ADMIN_PASSWORD

    if (!email || !password) {
        throw new Error('PocketBase admin credentials not configured in environment variables')
    }

    try {
        await pb.admins.authWithPassword(email, password)
        return pb
    } catch (error: any) {
        console.error('Failed to authenticate as admin:', error)
        throw new Error('Failed to authenticate with PocketBase as admin')
    }
}
