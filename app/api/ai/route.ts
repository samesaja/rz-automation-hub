import { NextRequest, NextResponse } from 'next/server'
import { geminiClient } from '@/lib/ai'

export async function POST(request: NextRequest) {
  try {
    const { prompt, model } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    const result = await geminiClient.generate({
      prompt,
      model: model || 'gemini-2.0-flash-exp',
    })

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'AI request failed' },
      { status: 500 }
    )
  }
}
