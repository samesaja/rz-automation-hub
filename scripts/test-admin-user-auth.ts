
import PocketBase from 'pocketbase';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function testAdminUserAuth() {
    const url = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://34.50.111.177:8090';
    console.log(`Connecting to ${url}...`);
    const pb = new PocketBase(url);

    const email = process.env.PB_ADMIN_EMAIL;
    const password = process.env.PB_ADMIN_PASSWORD;

    if (!email || !password) {
        console.error('Missing admin credentials in .env.local');
        return;
    }

    console.log(`Attempting USER authentication for ADMIN email: ${email}`);

    try {
        await pb.collection('users').authWithPassword(email, password);
        console.log('✅ SUCCESS: Admin credentials work for User login.');
    } catch (error: any) {
        console.error('❌ FAILED: Admin credentials do NOT work for User login.');
        console.error('Error:', error.message);
    }
}

testAdminUserAuth();
