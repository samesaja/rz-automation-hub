import { logActivity } from '../lib/logger'

async function main() {
    console.log('Testing logActivity...')
    await logActivity('Debug Script', 'success', 'This is a test log', 123)
    console.log('logActivity called.')
}

main()
