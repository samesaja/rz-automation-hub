import PocketBase from 'pocketbase'
import dotenv from 'dotenv'
import path from 'path'

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const pb = new PocketBase('http://34.50.111.177:8090')

async function main() {
    // Authenticate as admin (you might need to provide admin credentials here or ensure the script is run in an environment where it can auth)
    // For this script, we'll assume we can use the existing admin user created previously or prompt/hardcode for now.
    // Ideally, use env vars for admin email/pass.

    const email = process.env.PB_ADMIN_EMAIL
    const password = process.env.PB_ADMIN_PASSWORD

    if (!email || !password) {
        console.error('Missing PB_ADMIN_EMAIL or PB_ADMIN_PASSWORD')
        process.exit(1)
    }

    console.log(`Attempting auth for: ${email}`)

    let isAdmin = false

    try {
        await pb.admins.authWithPassword(email, password)
        console.log('✅ Authenticated as Admin')
        isAdmin = true
    } catch (e: any) {
        console.log('⚠️ Failed to authenticate as Admin:', e.message)

        // Try as regular user
        try {
            await pb.collection('users').authWithPassword(email, password)
            console.log('✅ Authenticated as App User')
        } catch (userError: any) {
            console.error('❌ Failed to authenticate as App User either:', userError.message)
            process.exit(1)
        }
    }

    try {
        // Check if collection exists
        try {
            await pb.collections.getFirstListItem('logs')
            console.log('Logs collection already exists (checked via list item)')
        } catch (e) {
            // If list fails, it might be empty or not exist. Let's try to get by name directly if possible, 
            // but SDK usually throws 404 if not found.
            // Better approach: try to get collection definition
            try {
                const collection = await pb.collections.getOne('logs')
                console.log('Logs collection already exists. Deleting to ensure clean schema...')
                await pb.collections.delete(collection.id)
                console.log('✅ Logs collection deleted')
            } catch (err) {
                // Collection doesn't exist, proceed to create
            }

            console.log('Creating logs collection...')

            await pb.collections.create({
                name: 'logs',
                type: 'base',
                fields: [
                    {
                        name: 'workflow',
                        type: 'text',
                        required: true,
                    },
                    {
                        name: 'status',
                        type: 'select',
                        required: true,
                        options: {
                            maxSelect: 1,
                            values: ['success', 'failed', 'running']
                        }
                    },
                    {
                        name: 'details',
                        type: 'text',
                        required: false,
                        options: {}
                    },
                    {
                        name: 'duration',
                        type: 'number',
                        required: false,
                        options: {}
                    }
                ],
                listRule: '', // Public list
                viewRule: '',
                createRule: '', // Public create
                updateRule: null,
                deleteRule: null,
            })
            console.log('✅ Logs collection created successfully!')
            return
        }

        console.log('Logs collection created successfully!')

    } catch (error: any) {
        console.error('Failed to setup logs collection:', error.data || error.message)
    }
}

main()
