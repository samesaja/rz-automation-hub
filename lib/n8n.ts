import axios from 'axios'

const N8N_URL = process.env.N8N_URL || 'http://localhost:5678'

export interface WorkflowPayload {
  [key: string]: any
}

export interface WorkflowResponse {
  success: boolean
  executionId?: string
  data?: any
  error?: string
}

export class N8nClient {
  private baseUrl: string
  private apiKey: string

  constructor(baseUrl: string = N8N_URL, apiKey: string = process.env.N8N_API_KEY || '') {
    this.baseUrl = baseUrl.replace(/\/$/, '')
    this.apiKey = apiKey
  }

  /**
   * Trigger an n8n workflow via webhook
   */
  async triggerWorkflow(
    workflowId: string,
    payload: WorkflowPayload = {}
  ): Promise<WorkflowResponse> {
    try {
      const webhookUrl = `${this.baseUrl}/webhook/${workflowId}`

      const response = await axios.post(webhookUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
          'X-N8N-API-KEY': this.apiKey,
        },
        timeout: 30000, // 30 seconds timeout
      })

      return {
        success: true,
        executionId: response.data.executionId,
        data: response.data,
      }
    } catch (error: any) {
      console.error('N8n workflow trigger error:', error.message)
      return {
        success: false,
        error: error.message || 'Failed to trigger workflow',
      }
    }
  }

  /**
   * Get workflow execution status
   */
  async getExecutionStatus(executionId: string): Promise<any> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/api/v1/executions/${executionId}`,
        {
          headers: {
            'X-N8N-API-KEY': this.apiKey,
          },
          timeout: 10000,
        }
      )
      return response.data
    } catch (error: any) {
      console.error('Failed to get execution status:', error.message)
      throw error
    }
  }

  /**
   * List recent workflow executions
   */
  async listExecutions(limit: number = 20): Promise<any[]> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/api/v1/executions`,
        {
          params: { limit },
          headers: {
            'X-N8N-API-KEY': this.apiKey,
          },
          timeout: 10000,
        }
      )
      return response.data.data || []
    } catch (error: any) {
      console.error('Failed to list executions:', error.message)
      return []
    }
  }

  /**
   * List workflows
   */
  async listWorkflows(): Promise<any[]> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/api/v1/workflows`,
        {
          headers: {
            'X-N8N-API-KEY': this.apiKey,
          },
          timeout: 10000,
        }
      )
      return response.data.data || []
    } catch (error: any) {
      console.error('Failed to list workflows full error:', error)
      console.error('Failed to list workflows:', error.message)
      if (axios.isAxiosError(error)) {
        console.error('Status:', error.response?.status)
        console.error('Data:', JSON.stringify(error.response?.data, null, 2))
      }
      return []
    }
  }

  /**
   * Create a new workflow
   */
  async createWorkflow(name: string): Promise<WorkflowResponse> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/api/v1/workflows`,
        {
          name,
          nodes: [],
          connections: {},
          settings: {}
        },
        {
          headers: {
            'X-N8N-API-KEY': this.apiKey,
          },
          timeout: 10000,
        }
      )
      return {
        success: true,
        data: response.data,
      }
    } catch (error: any) {
      console.error('Failed to create workflow:', error.message)
      return {
        success: false,
        error: error.message || 'Failed to create workflow',
      }
    }
  }

  /**
   * Update a workflow
   */
  async updateWorkflow(id: string, data: { name?: string; active?: boolean }): Promise<WorkflowResponse> {
    try {
      let finalData: any = {}

      // 1. Handle Status Change (activate/deactivate)
      if (data.active !== undefined) {
        const endpoint = data.active ? 'activate' : 'deactivate'
        const response = await axios.post(
          `${this.baseUrl}/api/v1/workflows/${id}/${endpoint}`,
          {},
          {
            headers: {
              'X-N8N-API-KEY': this.apiKey,
            },
            timeout: 10000,
          }
        )
        finalData = response.data
      }

      // 2. Handle Name Update (PUT)
      if (data.name) {
        // First fetch the existing workflow to get nodes and connections
        const existing = await axios.get(
          `${this.baseUrl}/api/v1/workflows/${id}`,
          {
            headers: {
              'X-N8N-API-KEY': this.apiKey,
            },
            timeout: 10000,
          }
        )

        const currentWorkflow = existing.data

        // Construct payload with only allowed fields
        // Exclude 'active' as it is read-only
        const updatedWorkflow = {
          name: data.name,
          nodes: currentWorkflow.nodes,
          connections: currentWorkflow.connections,
          settings: currentWorkflow.settings,
          tags: currentWorkflow.tags,
        }

        const response = await axios.put(
          `${this.baseUrl}/api/v1/workflows/${id}`,
          updatedWorkflow,
          {
            headers: {
              'X-N8N-API-KEY': this.apiKey,
            },
            timeout: 10000,
          }
        )
        finalData = response.data
      }

      return {
        success: true,
        data: finalData,
      }
    } catch (error: any) {
      console.error('Failed to update workflow:', error.message)
      if (axios.isAxiosError(error)) {
        console.error('Status:', error.response?.status)
        console.error('Data:', JSON.stringify(error.response?.data, null, 2))
      }
      return {
        success: false,
        error: error.message || 'Failed to update workflow',
      }
    }
  }
}

export const n8nClient = new N8nClient()
