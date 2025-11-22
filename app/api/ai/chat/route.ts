import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { logActivity } from '@/lib/logger'

export async function POST(req: Request) {
    const start = Date.now()
    try {
        const { message, apiKey, history, model } = await req.json()

        // Use user provided key or fallback to server env
        const key = apiKey || process.env.GOOGLE_API_KEY

        if (!key) {
            return NextResponse.json(
                { error: 'API Key is required. Please provide one in settings or configure the server.' },
                { status: 400 }
            )
        }

        const genAI = new GoogleGenerativeAI(key)

        // Use provided model or default to gemini-1.5-flash
        // Note: 'gemini-1.5-flash' might need to be 'gemini-1.5-flash-latest' or similar depending on API version.
        // But with custom models, the user can provide the exact string.
        const modelId = model || 'gemini-1.5-flash'

        const genModel = genAI.getGenerativeModel({ model: modelId })

        // Convert history to Gemini format
        // Gemini expects: { role: 'user' | 'model', parts: [{ text: string }] }
        const chatHistory = history ? history.map((msg: any) => ({
            role: msg.role,
            parts: [{ text: msg.content }]
        })) : []

        const chat = genModel.startChat({
            history: chatHistory,
            generationConfig: {
                maxOutputTokens: 2048,
            },
        })

        const result = await chat.sendMessage(message)
        const response = await result.response
        const text = response.text()

        // Log successful AI request
        const duration = Date.now() - start
        await logActivity('AI Studio', 'success', `Generated response for model ${modelId}`, duration)

        return NextResponse.json({ response: text })

    } catch (error: any) {
        console.error('AI Chat Error:', error)

        // Improve error message for common issues
        let errorMessage = error.message || 'Failed to process request'
        if (errorMessage.includes('404')) {
            errorMessage = `Model not found or not supported. Please check the Model ID.`
        } else if (errorMessage.includes('429')) {
            errorMessage = 'Rate limit exceeded. Please try again later.'
        }

        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        )
    }
}
