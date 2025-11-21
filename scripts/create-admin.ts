import PocketBase from 'pocketbase'

const pb = new PocketBase('http://34.50.111.177:8090')

async function createAdmin() {
    const email = process.argv[2]
    const password = process.argv[3]

    if (!email || !password) {
        console.error('Usage: npx tsx scripts/create-admin.ts <email> <password>')
        process.exit(1)
    }

    try {
        console.log(`Creating user ${email}...`)
        const userData = {
            email,
            password,
            passwordConfirm: password,
            emailVisibility: true,
        }

        const record = await pb.collection('users').create(userData)
        console.log('✅ User created successfully:', record.id)
    } catch (error: any) {
        console.error('❌ Failed to create user:', error.message)
        if (error.data) {
            console.error('Details:', JSON.stringify(error.data, null, 2))
        }
    }
}

createAdmin()
