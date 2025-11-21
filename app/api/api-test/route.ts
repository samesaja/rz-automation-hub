import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function POST(request: NextRequest) {
  try {
    const { url, method, headers, body } = await request.json()

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    const config: any = {
      method: method || 'GET',
      url,
      headers: headers || {},
      timeout: 30000,
    }

    if (body && method !== 'GET') {
      config.data = body
    }

    const response = await axios(config)

    return NextResponse.json({
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data,
    })
  } catch (error: any) {
    if (error.response) {
      return NextResponse.json({
        status: error.response.status,
        statusText: error.response.statusText,
        headers: error.response.headers,
        data: error.response.data,
        error: error.message,
      })
    }

    return NextResponse.json(
      {
        error: error.message || 'Request failed',
        details: error.toString(),
      },
      { status: 500 }
    )
  }
}
