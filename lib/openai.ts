import OpenAI from 'openai'

// Configure AI provider based on environment
const aiMode = process.env.AI_MODE || 'fallback'

// Warn if no API key is configured
if (aiMode === 'groq' && !process.env.GROQ_API_KEY) {
  console.warn('Warning: GROQ_API_KEY environment variable is not set. AI features will not work.')
}

if (aiMode === 'openai' && !process.env.OPENAI_API_KEY) {
  console.warn('Warning: OPENAI_API_KEY environment variable is not set. AI features will not work.')
}

if (aiMode === 'grok' && !process.env.XAI_API_KEY) {
  console.warn('Warning: XAI_API_KEY environment variable is not set. AI features will not work.')
}

// Initialize OpenAI client based on mode (Groq uses OpenAI-compatible API)
export const openai = new OpenAI({
  apiKey: aiMode === 'groq' 
    ? (process.env.GROQ_API_KEY || 'dummy-key')
    : aiMode === 'grok'
    ? (process.env.XAI_API_KEY || 'dummy-key')
    : (process.env.OPENAI_API_KEY || 'dummy-key'),
  baseURL: aiMode === 'groq' 
    ? "https://api.groq.com/openai/v1"  // Groq endpoint
    : aiMode === 'grok' 
    ? "https://api.x.ai/v1"  // Grok endpoint
    : undefined  // OpenAI default
})

// Get the appropriate model name based on AI mode
export const getModelName = () => {
  const aiMode = process.env.AI_MODE || 'fallback'
  
  switch (aiMode) {
    case 'groq':
      return 'llama-3.3-70b-versatile' // Groq's best model - FREE and FAST!
    case 'openai':
      return 'gpt-4o-mini' // OpenAI's affordable, fast model
    case 'grok':
      return 'grok-beta' // Grok model
    default:
      return 'gpt-3.5-turbo' // Fallback
  }
}

export const SYSTEM_PROMPT = `You are an AI Academic Advisor for a university CGPA management system. Your role is to:

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

export async function streamChatCompletion(
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
  onToken?: (token: string) => void
) {
  const modelName = getModelName()
  
  const stream = await openai.chat.completions.create({
    model: modelName,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages
    ],
    stream: true,
    temperature: 0.7,
    max_tokens: 1000
  })

  let fullResponse = ''

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || ''
    fullResponse += content
    if (onToken) {
      onToken(content)
    }
  }

  return fullResponse
}

export async function generateAcademicInsights(studentData: {
  cgpa: number
  results: Array<{
    course: string
    grade: string
    score: number
  }>
  level: number
}) {
  const modelName = getModelName()
  
  const prompt = `Analyze this student's academic performance and provide insights:
  
Current CGPA: ${studentData.cgpa}
Level: ${studentData.level}
Recent Results: ${JSON.stringify(studentData.results, null, 2)}

Provide:
1. Performance summary
2. Strengths and weaknesses
3. Specific improvement strategies
4. Motivational message`

  const completion = await openai.chat.completions.create({
    model: modelName,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: prompt }
    ],
    temperature: 0.7,
    max_tokens: 500
  })

  return completion.choices[0].message.content
}
