import { GoogleGenerativeAI } from '@google/generative-ai'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ''

export interface AiRequest {
  prompt: string
  model?: string
  temperature?: number
  maxTokens?: number
}

export interface AiResponse {
  response: string
  model: string
  error?: string
}

export class GeminiClient {
  private genAI: GoogleGenerativeAI
  private defaultModel: string = 'gemini-2.0-flash-exp'

  constructor(apiKey: string = GEMINI_API_KEY) {
    if (!apiKey) {
      console.warn('GEMINI_API_KEY not set. AI features will not work.')
    }
    this.genAI = new GoogleGenerativeAI(apiKey)
  }

  /**
   * Generate content using Gemini AI
   */
  async generate(request: AiRequest): Promise<AiResponse> {
    try {
      const model = this.genAI.getGenerativeModel({
        model: request.model || this.defaultModel,
      })

      const result = await model.generateContent(request.prompt)
      const response = await result.response
      const text = response.text()

      return {
        response: text,
        model: request.model || this.defaultModel,
      }
    } catch (error: any) {
      console.error('Gemini AI error:', error.message)
      return {
        response: '',
        model: request.model || this.defaultModel,
        error: error.message || 'Failed to generate AI response',
      }
    }
  }

  /**
   * Generate streaming content
   */
  async *generateStream(request: AiRequest): AsyncGenerator<string> {
    try {
      const model = this.genAI.getGenerativeModel({
        model: request.model || this.defaultModel,
      })

      const result = await model.generateContentStream(request.prompt)

      for await (const chunk of result.stream) {
        const chunkText = chunk.text()
        yield chunkText
      }
    } catch (error: any) {
      console.error('Gemini AI streaming error:', error.message)
      yield `Error: ${error.message}`
    }
  }
}

export const geminiClient = new GeminiClient()
