// scripts/seed-pocketbase.ts
// Script untuk seed data dummy ke PocketBase
import PocketBase from 'pocketbase'

const pb = new PocketBase('http://34.50.111.177:8090')

// Data dummy workflows
const workflowsData = [
  {
    name: 'Data Sync Pipeline',
    status: 'running',
    lastRun: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
    executions: 1248,
    successRate: 98.5,
    description: 'Automated data synchronization between systems'
  },
  {
    name: 'Email Automation',
    status: 'idle',
    lastRun: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 hour ago
    executions: 847,
    successRate: 99.2,
    description: 'Automated email campaigns and notifications'
  },
  {
    name: 'Report Generator',
    status: 'running',
    lastRun: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
    executions: 523,
    successRate: 97.8,
    description: 'Generate daily business reports'
  },
  {
    name: 'Backup Service',
    status: 'idle',
    lastRun: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    executions: 342,
    successRate: 100,
    description: 'Automated backup and recovery system'
  }
]

async function seedWorkflows() {
  try {
    console.log('🌱 Seeding workflows to PocketBase...')
    
    for (const workflow of workflowsData) {
      try {
        const created = await pb.collection('workflows').create(workflow)
        console.log(`✅ Created workflow: ${workflow.name}`)
      } catch (error: any) {
        console.log(`⚠️  Workflow "${workflow.name}" might already exist or error: ${error.message}`)
      }
    }
    
    console.log('✨ Seeding completed!')
  } catch (error) {
    console.error('❌ Error seeding data:', error)
  }
}

// Run the seed
seedWorkflows()
