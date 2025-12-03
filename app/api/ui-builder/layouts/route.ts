import { NextRequest, NextResponse } from 'next/server';
import { getAdminPb } from '@/lib/pocketbase-admin';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, components } = body;

        if (!name || !components) {
            return NextResponse.json({ error: 'Name and components are required' }, { status: 400 });
        }

        const pb = await getAdminPb();

        // Check if layout with name exists to update, or create new
        // For simplicity, we'll just create new or update if ID is provided
        // But here we just create/update based on name for now or just create

        // Let's try to find one with the same name
        try {
            const existing = await pb.collection('ui_layouts').getFirstListItem(`name="${name}"`);
            if (existing) {
                const record = await pb.collection('ui_layouts').update(existing.id, {
                    data: components,
                });
                return NextResponse.json({ success: true, record });
            }
        } catch (e) {
            // Not found, proceed to create
        }

        const record = await pb.collection('ui_layouts').create({
            name,
            data: components,
        });

        return NextResponse.json({ success: true, record });
    } catch (error: any) {
        console.error('Failed to save layout:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const pb = await getAdminPb();
        const records = await pb.collection('ui_layouts').getFullList({
            sort: '-created',
        });
        return NextResponse.json(records);
    } catch (error: any) {
        console.error('Failed to load layouts:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
