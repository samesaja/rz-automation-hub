import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { getAdminPb } from '../lib/pocketbase-admin'

async function debugCollection() {
    const collectionName = 'app_logs'
    console.log(`🔍 Inspecting collection: ${collectionName}`)

    try {
        const pb = await getAdminPb()

        // 1. Get Collection Details
        try {
            const collection = await pb.collections.getOne(collectionName)
            console.log('✅ Collection found:', {
                id: collection.id,
                name: collection.name,
                type: collection.type,
                schema: collection.schema
            })
        } catch (e: any) {
            console.error('❌ Failed to get collection details:', e.message)
            return
        }

        // 2. Create a test record
        console.log('Creating test record...')
        try {
            await pb.collection(collectionName).create({
                workflow: 'debug',
                status: 'success',
                message: 'Debug log entry',
                duration: 100
            })
            console.log('✅ Created test record.')
        } catch (e: any) {
            console.error('❌ Failed to create record:', e.message)
        }

        // 3. Try to fetch records
        console.log('Trying to fetch records...')
        try {
            const result = await pb.collection(collectionName).getList(1, 20, { sort: '-id' })
            console.log(`✅ Successfully fetched ${result.items.length} records.`)
            if (result.items.length > 0) {
                console.log('First record keys:', Object.keys(result.items[0]))
                console.log('First record:', JSON.stringify(result.items[0], null, 2))
            }
        } catch (e: any) {
            console.error('❌ Failed to fetch records:', e.originalError || e.message)
            console.log('Full error:', JSON.stringify(e, null, 2))
        }

    } catch (error: any) {
        console.error('❌ Script error:', error.message)
    }
}

debugCollection()
