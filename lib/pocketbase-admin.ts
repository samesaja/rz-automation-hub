import PocketBase from 'pocketbase'

// Helper to get an authenticated admin client
export async function getAdminPb() {
    const pb = new PocketBase('http://34.50.111.177:8090')

    const email = process.env.POCKETBASE_ADMIN_EMAIL
    const password = process.env.POCKETBASE_ADMIN_PASSWORD

    if (!email || !password) {
        throw new Error('PocketBase admin credentials not configured in environment variables')
    }

    try {
        // Explicitly authenticate against _superusers collection using RAW FETCH
        // This is to bypass any potential SDK issues or default headers that might be causing token discrepancies
        const authUrl = 'http://34.50.111.177:8090/api/collections/_superusers/auth-with-password'
        const authResponse = await fetch(authUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                identity: email,
                password: password,
            }),
            cache: 'no-store'
        })

        if (!authResponse.ok) {
            throw new Error(`Failed to authenticate: ${authResponse.status} ${await authResponse.text()}`)
        }

        const authData = await authResponse.json()
        pb.authStore.save(authData.token, authData.record)

        if (!pb.authStore.isValid && pb.authStore.token) {
            pb.beforeSend = function (url, options) {
                options.headers = Object.assign({}, options.headers, {
                    Authorization: 'Bearer ' + pb.authStore.token,
                });
                return { url, options };
            };
        }

        return pb
    } catch (error: any) {
        console.error('Failed to authenticate as admin:', error)
        throw new Error('Failed to authenticate with PocketBase as admin')
    }
}
