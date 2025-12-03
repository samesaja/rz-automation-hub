
import PocketBase from 'pocketbase';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function testAuth() {
    const url = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://34.50.111.177:8090';
    console.log(`Connecting to ${url}...`);
    const pb = new PocketBase(url);

    try {
        console.log('Attempting admin authentication...');
        const email = process.env.PB_ADMIN_EMAIL;
        const password = process.env.PB_ADMIN_PASSWORD;

        if (!email || !password) {
            throw new Error('Admin credentials not found in .env.local');
        }

        await pb.admins.authWithPassword(email, password);
        console.log('Admin authentication successful!');

        console.log('Listing users...');
        const users = await pb.collection('users').getList(1, 5);
        console.log(`Found ${users.totalItems} users.`);
        users.items.forEach(u => console.log(`- ${u.email} (ID: ${u.id})`));

    } catch (error: any) {
        console.error('Authentication failed:', error.message);
        if (error.data) {
            console.error('Error data:', JSON.stringify(error.data, null, 2));
        }
    }
}

testAuth();
