
import PocketBase from 'pocketbase';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function testValidAuth() {
    const url = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://34.50.111.177:8090';
    console.log(`Connecting to ${url}...`);
    const pb = new PocketBase(url);

    const email = 'admin@rz-automation.com';
    const password = 'password123';

    try {
        console.log(`Attempting authentication for ${email}...`);
        const authData = await pb.collection('users').authWithPassword(email, password);
        console.log('Authentication successful!');
        console.log('User ID:', authData.record.id);
        console.log('Token:', authData.token.substring(0, 20) + '...');
    } catch (error: any) {
        console.error('Authentication failed:', error.message);
        if (error.data) {
            console.error('Error data:', JSON.stringify(error.data, null, 2));
        }
    }
}

testValidAuth();
