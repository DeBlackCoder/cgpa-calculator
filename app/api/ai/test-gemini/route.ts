import { NextRequest } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY || ''
    
    if (!apiKey) {
      return Response.json({ 
        error: "GEMINI_API_KEY not set",
        instructions: "Get your API key from https://aistudio.google.com/apikey"
      }, { status: 400 })
    }

    console.log("Testing Gemini API...")
    console.log("API Key format:", apiKey.substring(0, 10) + "...")

    const genAI = new GoogleGenerativeAI(apiKey)
    
    // Test with gemini-2.5-flash (current model as of 2026)
    try {
      console.log("Trying gemini-2.5-flash...")
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })
      const result = await model.generateContent("Say hello in one sentence")
      const response = await result.response
      const text = response.text()
      
      return Response.json({ 
        success: true, 
        message: "✅ Gemini API is working!",
        response: text,
        model: "gemini-2.5-flash",
        keyFormat: apiKey.substring(0, 3) + "... (new AQ. format)"
      })
    } catch (modelError: any) {
      console.error("Model error with gemini-2.5-flash:", modelError)
      
      // Try to list available models
      try {
        console.log("Fetching available models...")
        const listResult = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
        )
        const modelsData = await listResult.json()
        
        return Response.json({ 
          error: "Model not available",
          message: modelError.message,
          availableModels: modelsData,
          suggestion: "Check the 'availableModels' list above and update lib/gemini.ts with a valid model name"
        }, { status: 500 })
      } catch (listError) {
        return Response.json({ 
          error: "Model error",
          message: modelError.message,
          details: modelError.toString(),
          suggestion: "Could not list available models. Your API key might need additional permissions."
        }, { status: 500 })
      }
    }
  } catch (error: any) {
    console.error("Test error:", error)
    return Response.json({ 
      error: "Test failed", 
      message: error.message
    }, { status: 500 })
  }
}
