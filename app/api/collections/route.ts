import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

const DEFAULT_SCHEMAS = [
    {
        id: 'users_col',
        name: 'users',
        type: 'auth',
        system: true,
        schema: [
            { name: 'name', type: 'text', required: false },
            { name: 'avatar', type: 'file', required: false },
            { name: 'role', type: 'text', required: true }
        ],
        listRule: 'id = @request.auth.id',
        viewRule: 'id = @request.auth.id',
        createRule: '',
        updateRule: 'id = @request.auth.id',
        deleteRule: 'id = @request.auth.id'
    },
    {
        id: 'logs_col',
        name: 'app_logs',
        type: 'base',
        system: false,
        schema: [
            { name: 'level', type: 'text', required: true },
            { name: 'message', type: 'text', required: true },
            { name: 'details', type: 'json', required: false },
            { name: 'timestamp', type: 'date', required: true }
        ],
        listRule: null, // Admin only
        viewRule: null,
        createRule: null,
        updateRule: null,
        deleteRule: null
    }
];

export async function GET() {
    try {
        const db = await getDb();
        const metaCollection = db.collection('_schema_metadata');

        let collections = await metaCollection.find({}).toArray();

        if (collections.length === 0) {
            console.log('No metadata found. Seeding default schemas.');
            await metaCollection.insertMany(DEFAULT_SCHEMAS);
            collections = await metaCollection.find({}).toArray();
        }

        // Must map _id to id if necessary, though our seed uses 'id'. 
        // MongoDB returns _id object usually.
        const serialized = collections.map(c => ({
            ...c,
            id: c.id || c._id.toString(),
            _id: undefined // Remove Mongo ID to clean up response matching PB format
        }));

        return NextResponse.json(serialized)

    } catch (error: any) {
        console.error('Failed to fetch collections (MongoDB):', error)
        return NextResponse.json(
            { error: error.message || 'Failed to fetch collections' },
            { status: 500 }
        )
    }
}
