import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { getAdminPb } from '../lib/pocketbase-admin'

async function setupLogsCollection() {
    console.log('📦 Setting up app_logs collection...')

    try {
        const pb = await getAdminPb()

        // Clean up existing app_logs
        try {
            const existing = await pb.collections.getFirstListItem('name="app_logs"')
            console.log('⚠️ app_logs collection exists. Deleting to recreate...')
            await pb.collections.delete(existing.id)
            console.log('✅ Deleted existing app_logs collection.')
        } catch (e: any) {
            if (e.status !== 404) throw e
        }

        console.log('Creating app_logs collection...')
        // Try using 'fields' property which is used in newer PocketBase versions
        // If 'fields' is not supported, it might be ignored, but let's try.
        // We also include 'schema' just in case, but empty.
        const collection = await pb.collections.create({
            name: 'app_logs',
            type: 'base',
            fields: [
                {
                    name: 'workflow',
                    type: 'text',
                    required: true,
                    presentable: true,
                },
                {
                    name: 'status',
                    type: 'select',
                    required: true,
                    values: ['success', 'failed', 'running'],
                    maxSelect: 1
                },
                {
                    name: 'message',
                    type: 'text',
                },
                {
                    name: 'duration',
                    type: 'number',
                }
            ]
        })

        console.log('✨ app_logs collection created successfully!')
        console.log('Collection ID:', collection.id)

    } catch (error: any) {
        console.error('❌ Failed to setup logs collection:', error.message)
        if (error.data) {
            console.error('Error data:', JSON.stringify(error.data, null, 2))
        }
        process.exit(1)
    }
}

setupLogsCollection()
