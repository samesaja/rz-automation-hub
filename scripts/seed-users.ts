import PocketBase from 'pocketbase'

const pb = new PocketBase('http://34.50.111.177:8090')

const USERS_TO_SEED = [
    {
        email: 'admin@rz-automation.com',
        password: 'password123',
        passwordConfirm: 'password123',
        name: 'System Admin',
        role: 'admin'
    },
    {
        email: 'user@rz-automation.com',
        password: 'password123',
        passwordConfirm: 'password123',
        name: 'Test User',
        role: 'user'
    }
]

async function seedUsers() {
    console.log('🌱 Starting user seeding...')

    for (const user of USERS_TO_SEED) {
        try {
            // Check if user exists
            try {
                const existing = await pb.collection('users').getFirstListItem(`email="${user.email}"`)
                if (existing) {
                    console.log(`ℹ️ User ${user.email} already exists. Skipping.`)
                    continue
                }
            } catch (e: any) {
                if (e.status !== 404) {
                    console.error(`❌ Error checking user ${user.email}:`, e.message)
                    continue
                }
            }

            // Create user
            await pb.collection('users').create({
                email: user.email,
                password: user.password,
                passwordConfirm: user.passwordConfirm,
                name: user.name,
                role: user.role,
                emailVisibility: true
            })
            console.log(`✅ Created user: ${user.email}`)

        } catch (e: any) {
            console.error(`❌ Failed to create user ${user.email}:`, e.message)
        }
    }

    console.log('✨ Seeding completed!')
}

seedUsers()
