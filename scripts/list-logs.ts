import PocketBase from 'pocketbase'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const pb = new PocketBase('http://34.50.111.177:8090')

async function main() {
    try {
        const email = process.env.PB_ADMIN_EMAIL
        const password = process.env.PB_ADMIN_PASSWORD

        if (email && password) {
            await pb.admins.authWithPassword(email, password)
            console.log('Authenticated as Admin')
        }

        try {
            const collection = await pb.collections.getOne('logs')
            console.log('Collection schema:', JSON.stringify(collection.schema, null, 2))
            console.log('System fields:', collection.system)
        } catch (e: any) {
            console.error('Failed to get collection info:', e.message)
        }

        console.log('Listing logs with sort: -created ...')
        try {
            const logs = await pb.collection('logs').getList(1, 50, { sort: '-created' })
            console.log('Logs found:', logs.items.length)
        } catch (e: any) {
            console.error('Sort -created failed:', e.message)
        }

        console.log('Listing logs without sort...')
        const logs = await pb.collection('logs').getList(1, 50)
        console.log('Logs found:', logs.items.length)
        console.log(JSON.stringify(logs.items, null, 2))
    } catch (error: any) {
        console.error('Failed to list logs:', error.message)
        if (error.data) console.error(error.data)
    }
}

main()
