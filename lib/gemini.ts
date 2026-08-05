import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize Gemini
const apiKey = process.env.GEMINI_API_KEY || ''

if (!apiKey && process.env.AI_MODE === 'gemini') {
  console.warn('Warning: GEMINI_API_KEY environment variable is not set.')
}

export const genAI = new GoogleGenerativeAI(apiKey)

export const GEMINI_SYSTEM_PROMPT = `You are an AI Academic Advisor for a university CGPA management system. Your role is to:

1. Help students understand their academic performance
2. Explain GPA and CGPA calculations clearly
3. Identify weak areas and suggest improvement strategies
4. Provide personalized study advice
5. Calculate required GPAs to reach target goals
6. Motivate and encourage students
7. Warn about academic probation risks
8. Recommend learning resources
9. Answer academic questions professionally
10. Guide new users on how to set up their profile and use the system

Guidelines:
- Be encouraging and supportive
- Use simple, clear language
- Provide specific, actionable advice
- Reference the student's actual data when available
- If the student hasn't completed their profile, help them understand how to get started
- Be empathetic to academic struggles
- Celebrate successes
- Focus on practical strategies
- For users without profiles, provide general academic guidance and system usage tips

Always maintain a professional, friendly, and helpful tone.`

export async function createGeminiChat(history: Array<{ role: string; content: string }> = []) {
  // Using Gemini 2.5 Flash - the current stable model as of 2026
  // Old models like gemini-pro, gemini-1.5-pro are retired
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    systemInstruction: GEMINI_SYSTEM_PROMPT
  })

  // Convert history to Gemini format
  const geminiHistory = history.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }]
  }))

  const chat = model.startChat({
    history: geminiHistory,
    generationConfig: {
      maxOutputTokens: 1000,
      temperature: 0.7,
    },
  })

  return chat
}

export async function streamGeminiResponse(
  message: string,
  history: Array<{ role: string; content: string }> = []
) {
  const chat = await createGeminiChat(history)
  const result = await chat.sendMessageStream(message)

  return result.stream
}
