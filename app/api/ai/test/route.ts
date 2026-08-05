import { NextRequest, NextResponse } from "next/server"
import { openai } from "@/lib/openai"

// Simple test endpoint to verify Grok API connection
export async function GET(request: NextRequest) {
  try {
    console.log("Testing Grok API...")
    console.log("API Key exists:", !!process.env.XAI_API_KEY)
    console.log("API Key prefix:", process.env.XAI_API_KEY?.substring(0, 10))

    // Try a simple completion
    const completion = await openai.chat.completions.create({
      model: "grok-beta",
      messages: [
        { role: "user", content: "Say 'hello' in one word" }
      ],
      max_tokens: 10
    })

    const response = completion.choices[0]?.message?.content || "No response"

    return NextResponse.json({
      success: true,
      message: "Grok API is working!",
      response,
      model: "grok-beta"
    })
  } catch (error: any) {
    console.error("Grok API Test Error:", error)
    console.error("Error details:", {
      message: error.message,
      status: error.status,
      code: error.code,
      type: error.type,
      response: error.response?.data
    })

    return NextResponse.json({
      success: false,
      error: error.message,
      details: {
        status: error.status,
        code: error.code,
        type: error.type
      }
    }, { status: 500 })
  }
}
