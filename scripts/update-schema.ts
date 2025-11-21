import PocketBase from 'pocketbase'

const pb = new PocketBase('http://34.50.111.177:8090')

async function updateSchema() {
    try {
        // Authenticate as admin (using credentials from previous step)
        await pb.admins.authWithPassword('samdhito@protonmail.com', 'B@rg0nd3z')
        console.log('✅ Authenticated as Admin')

        // Fetch users collection
        const collection = await pb.collections.getOne('users')
        console.log('📦 Fetched "users" collection')

        // Check if role field already exists
        const hasRole = collection.schema.some((field: any) => field.name === 'role')

        if (hasRole) {
            console.log('ℹ️ "role" field already exists. Skipping...')
            return
        }

        // Add role field
        const newField = {
            name: 'role',
            type: 'select',
            required: false,
            presentable: false,
            unique: false,
            options: {
                maxSelect: 1,
                values: ['admin', 'user']
            }
        }

        // Update collection
        await pb.collections.update('users', {
            schema: [...collection.schema, newField]
        })

        console.log('✅ Successfully added "role" field to "users" collection')

    } catch (error: any) {
        console.error('❌ Failed to update schema:', error.message)
        if (error.data) {
            console.error('Details:', JSON.stringify(error.data, null, 2))
        }
    }
}

updateSchema()
