import { NextRequest, NextResponse } from "next/server"

// Test endpoint to list available Grok models
export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.XAI_API_KEY

    if (!apiKey) {
      return NextResponse.json({
        error: "XAI_API_KEY not configured"
      }, { status: 500 })
    }

    // Call Grok API to list models
    const response = await fetch("https://api.x.ai/v1/models", {
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Models API Error:", errorText)
      return NextResponse.json({
        error: "Failed to fetch models",
        status: response.status,
        details: errorText
      }, { status: response.status })
    }

    const data = await response.json()
    
    return NextResponse.json({
      success: true,
      models: data
    })
  } catch (error: any) {
    console.error("Models fetch error:", error)
    return NextResponse.json({
      error: error.message,
      details: error.toString()
    }, { status: 500 })
  }
}
