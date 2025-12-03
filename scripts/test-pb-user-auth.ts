
import PocketBase from 'pocketbase';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function testUserAuth() {
    const url = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://34.50.111.177:8090';
    console.log(`Connecting to ${url}...`);
    const pb = new PocketBase(url);

    try {
        console.log('Attempting user authentication with wrong password...');
        await pb.collection('users').authWithPassword('demo@demo.com', 'wrongpassword');
    } catch (error: any) {
        console.log('Expected error caught:');
        console.log('Status:', error.status);
        console.log('Message:', error.message);
        console.log('Data:', error.data);
    }
}

testUserAuth();
