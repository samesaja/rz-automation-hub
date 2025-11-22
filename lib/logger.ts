import { getAdminPb } from './pocketbase-admin'

export async function logActivity(
    workflow: string,
    status: 'success' | 'failed' | 'running',
    message: string,
    duration: number
) {
    try {
        const pb = await getAdminPb()

        await pb.collection('app_logs').create({
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
