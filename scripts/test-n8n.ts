
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function main() {
    // Dynamic import to ensure env vars are loaded first
    const { n8nClient } = await import('../lib/n8n');

    console.log('Testing n8n client...');
    console.log('URL:', process.env.N8N_URL);

    try {
        console.log('Listing workflows...');
        const workflows = await n8nClient.listWorkflows();
        console.log(`Found ${workflows.length} workflows.`);

        if (workflows.length > 0) {
            const workflow = workflows[0];
            console.log(`Attempting to update workflow: ${workflow.name} (${workflow.id})`);
            console.log(`Current status: ${workflow.active ? 'active' : 'inactive'}`);

            const newStatus = !workflow.active;
            console.log(`Setting status to: ${newStatus ? 'active' : 'inactive'}`);

            const result = await n8nClient.updateWorkflow(workflow.id, { active: newStatus });

            if (result.success) {
                console.log('Update successful!');
                console.log('New status:', result.data.active);

                // Revert change
                console.log('Reverting status...');
                await n8nClient.updateWorkflow(workflow.id, { active: workflow.active });
                console.log('Reverted.');
            } else {
                console.error('Update failed:', result.error);
            }
        } else {
            console.log('No workflows found to test update.');
        }

    } catch (error) {
        console.error('Test failed:', error);
    }
}

main();
