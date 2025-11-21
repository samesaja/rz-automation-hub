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

  constructor(baseUrl: string = N8N_URL) {
    this.baseUrl = baseUrl
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
          timeout: 10000,
        }
      )
      return response.data.data || []
    } catch (error: any) {
      console.error('Failed to list executions:', error.message)
      return []
    }
  }
}

export const n8nClient = new N8nClient()
