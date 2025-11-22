import { pb } from './pocketbase'

export async function logActivity(
    workflow: string,
    status: 'success' | 'failed' | 'running',
    message: string,
    duration: number
) {
    try {
        // Ensure auth is loaded if needed, though for public create it might not be.
        // Ideally, use a server-side admin client or ensure rules allow creation.
        // For now, we rely on the pb instance from lib/pocketbase.ts which is initialized.

        await pb.collection('logs').create({
            workflow,
            status,
            message,
            duration,
        })
    } catch (error) {
        console.error('Failed to log activity:', error)
        // Don't throw, logging failure shouldn't break the app
    }
}
