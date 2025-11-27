import { NextResponse } from 'next/server'
import { getAdminPb } from '@/lib/pocketbase-admin'

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json()
        const { id } = params

        // Validate that we have an ID
        if (!id) {
            return NextResponse.json(
                { error: 'Collection ID is required' },
                { status: 400 }
            )
        }

        const pb = await getAdminPb()

        // Update the collection
        // We only allow updating specific rule fields for safety
        const allowedFields = ['listRule', 'viewRule', 'createRule', 'updateRule', 'deleteRule']
        const updateData: Record<string, any> = {}

        for (const field of allowedFields) {
            if (body[field] !== undefined) {
                updateData[field] = body[field]
            }
        }

        const result = await pb.collections.update(id, updateData)

        return NextResponse.json(result)
    } catch (error: any) {
        console.error('Failed to update collection:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to update collection' },
            { status: 500 }
        )
    }
}
