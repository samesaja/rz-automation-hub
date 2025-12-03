import { getAdminPb } from '../lib/pocketbase-admin';

async function main() {
    try {
        const pb = await getAdminPb();
        console.log('Authenticated as admin');

        try {
            await pb.collections.getOne('ui_layouts');
            console.log('Collection ui_layouts already exists');
        } catch (e) {
            console.log('Collection ui_layouts not found, creating...');
            await pb.collections.create({
                name: 'ui_layouts',
                type: 'base',
                schema: [
                    {
                        name: 'name',
                        type: 'text',
                        required: true,
                        unique: true,
                    },
                    {
                        name: 'data',
                        type: 'json',
                        required: true,
                    },
                ],
            });
            console.log('Collection ui_layouts created successfully');
        }
    } catch (error) {
        console.error('Failed to setup collection:', error);
        process.exit(1);
    }
}

main();
