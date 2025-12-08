import { getDb } from './mongodb'

export async function logActivity(
    workflow: string,
    status: 'success' | 'failed' | 'running',
    message: string,
    duration: number
) {
    try {
        const db = await getDb()
        const now = new Date().toISOString()

        await db.collection('app_logs').insertOne({
            workflow,
            status,
            message,
            duration,
            created: now,
            updated: now
        })
    } catch (error) {
        console.error('Failed to log activity (MongoDB):', error)
        // Don't throw, logging failure shouldn't break the app
    }
}
