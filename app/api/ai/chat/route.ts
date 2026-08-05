import { NextRequest } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import Student from "@/models/Student"
import Result from "@/models/Result"
import Course from "@/models/Course"
import Programme from "@/models/Programme"
import Department from "@/models/Department"
import ChatHistory from "@/models/ChatHistory"
import { openai, SYSTEM_PROMPT, getModelName } from "@/lib/openai"
import { streamGeminiResponse } from "@/lib/gemini"
import { calculateGPA } from "@/lib/utils"

// Removed edge runtime as it can cause compatibility issues
// export const runtime = "edge"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      )
    }

    const { message, includeContext } = await request.json()

    if (!message) {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }

    // Check if we should use fallback mode
    const aiMode = process.env.AI_MODE || "fallback"
    
    if (aiMode === "fallback") {
      // Use simple fallback responses
      return handleFallbackMode(message, session.user.name)
    }

    // Check if we should use Gemini
    if (aiMode === "gemini") {
      return handleGeminiMode(request, message, session, includeContext)
    }

    // Connect to database for other AI modes
    await connectDB()

    // Get student data if context is needed
    let contextMessage = ""
    
    if (includeContext) {
      const student = await Student.findOne({ userId: session.user.id }).lean()

      if (student) {
        const [results, programme, department] = await Promise.all([
          Result.find({ studentId: student._id.toString() })
            .sort({ createdAt: -1 })
            .limit(20)
            .lean(),
          student.programmeId ? Programme.findById(student.programmeId).lean() : null,
          student.departmentId ? Department.findById(student.departmentId).lean() : null
        ])

        // Populate course details
        const resultsWithCourses = await Promise.all(
          results.slice(0, 10).map(async (r) => {
            const course = await Course.findById(r.courseId).lean()
            return {
              course: course?.title,
              code: course?.code,
              grade: r.grade,
              score: r.score,
              creditUnits: r.creditUnits
            }
          })
        )

        const cgpa = results.length
          ? calculateGPA(
              results.map((r) => ({
                gradePoint: r.gradePoint,
                creditUnits: r.creditUnits,
              }))
            )
          : 0

        contextMessage = `
Student Context:
- Name: ${session.user.name}
- Programme: ${programme?.name || "Not set"}
- Department: ${department?.name || "Not set"}
- Current Level: ${student.level || "Not set"}
- Current CGPA: ${cgpa > 0 ? cgpa.toFixed(2) : "No results yet"}
- Credits Earned: ${student.creditsEarned || 0}
- Target CGPA: ${student.targetCGPA || "Not set"}

Recent Results:
${resultsWithCourses.length > 0 ? JSON.stringify(resultsWithCourses, null, 2) : "No results recorded yet"}
`
      } else {
        // No profile yet - still provide basic context
        contextMessage = `
Student Context:
- Name: ${session.user.name}
- Email: ${session.user.email}
- Profile Status: Not completed yet
- Note: The student hasn't completed their profile setup yet. You can still provide general academic advice, answer questions about CGPA calculations, study tips, and guide them on how to use the system.
`
      }
    }

    // Get chat history (only if student profile exists)
    const student = await Student.findOne({ userId: session.user.id }).lean()
    const chatHistory = student 
      ? await ChatHistory.find({ studentId: student._id.toString() })
          .sort({ timestamp: 1 })
          .limit(10)
          .lean()
      : []

    const messages = [
      { role: "system" as const, content: SYSTEM_PROMPT },
      ...(contextMessage ? [{ role: "system" as const, content: contextMessage }] : []),
      ...chatHistory.map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
      { role: "user" as const, content: message },
    ]

    const stream = await openai.chat.completions.create({
      model: getModelName(),
      messages,
      stream: true,
      temperature: 0.7,
      max_tokens: 1000,
    })

    // Create a TransformStream to handle the streaming response
    const encoder = new TextEncoder()

    let fullResponse = ""

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || ""
            fullResponse += content
            
            // Send the chunk to the client
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`))
          }

          // Save to chat history (only if student profile exists)
          const student = await Student.findOne({ userId: session.user.id }).lean()

          if (student) {
            await ChatHistory.insertMany([
              {
                studentId: student._id.toString(),
                role: "user",
                content: message
              },
              {
                studentId: student._id.toString(),
                role: "assistant",
                content: fullResponse
              }
            ])
          }

          controller.enqueue(encoder.encode("data: [DONE]\n\n"))
          controller.close()
        } catch (error) {
          console.error("Streaming error:", error)
          controller.error(error)
        }
      },
    })

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (error: any) {
    console.error("Chat error:", error)
    console.error("Error details:", {
      message: error.message,
      status: error.status,
      code: error.code,
      type: error.type
    })
    return new Response(
      JSON.stringify({ 
        error: "Internal server error", 
        message: error.message,
        details: error.status ? `API Error ${error.status}` : "Unknown error"
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}

// Gemini mode handler
async function handleGeminiMode(request: NextRequest, message: string, session: any, includeContext: boolean) {
  try {
    await connectDB()
    
    // Build context message if needed
    let contextMessage = ""
    
    if (includeContext) {
      const student = await Student.findOne({ userId: session.user.id }).lean()

      if (student) {
        const [results, programme, department] = await Promise.all([
          Result.find({ studentId: student._id.toString() })
            .sort({ createdAt: -1 })
            .limit(20)
            .lean(),
          student.programmeId ? Programme.findById(student.programmeId).lean() : null,
          student.departmentId ? Department.findById(student.departmentId).lean() : null
        ])

        const resultsWithCourses = await Promise.all(
          results.slice(0, 10).map(async (r) => {
            const course = await Course.findById(r.courseId).lean()
            return {
              course: course?.title,
              code: course?.code,
              grade: r.grade,
              score: r.score,
              creditUnits: r.creditUnits
            }
          })
        )

        const cgpa = results.length
          ? calculateGPA(
              results.map((r) => ({
                gradePoint: r.gradePoint,
                creditUnits: r.creditUnits,
              }))
            )
          : 0

        contextMessage = `Student Context: Name: ${session.user.name}, Programme: ${programme?.name || "Not set"}, Department: ${department?.name || "Not set"}, Current Level: ${student.level || "Not set"}, Current CGPA: ${cgpa > 0 ? cgpa.toFixed(2) : "No results yet"}, Credits Earned: ${student.creditsEarned || 0}, Target CGPA: ${student.targetCGPA || "Not set"}, Recent Results: ${resultsWithCourses.length > 0 ? JSON.stringify(resultsWithCourses) : "No results recorded yet"}`
      } else {
        contextMessage = `Student Context: Name: ${session.user.name}, Email: ${session.user.email}, Profile Status: Not completed yet. Note: The student hasn't completed their profile setup yet.`
      }
    }

    // Get chat history
    const student = await Student.findOne({ userId: session.user.id }).lean()
    const chatHistory = student 
      ? await ChatHistory.find({ studentId: student._id.toString() })
          .sort({ timestamp: 1 })
          .limit(10)
          .lean()
      : []

    // Build history for Gemini
    const history = [
      ...(contextMessage ? [{ role: 'user', content: contextMessage }, { role: 'assistant', content: 'I understand the student context.' }] : []),
      ...chatHistory.map((msg) => ({ role: msg.role, content: msg.content }))
    ]

    // Stream Gemini response
    const stream = await streamGeminiResponse(message, history)

    const encoder = new TextEncoder()
    let fullResponse = ""

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const chunkText = chunk.text()
            fullResponse += chunkText
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: chunkText })}\n\n`))
          }

          // Save chat history if student exists
          if (student) {
            await ChatHistory.insertMany([
              { studentId: student._id.toString(), role: "user", content: message },
              { studentId: student._id.toString(), role: "assistant", content: fullResponse }
            ])
          }

          controller.enqueue(encoder.encode("data: [DONE]\n\n"))
          controller.close()
        } catch (error) {
          console.error("Gemini streaming error:", error)
          controller.error(error)
        }
      },
    })

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (error: any) {
    console.error("Gemini error:", error)
    return new Response(
      JSON.stringify({ error: "Gemini API error", message: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}

// Fallback mode handler - provides simple AI responses without external API
function handleFallbackMode(message: string, userName: string) {
  const response = generateFallbackResponse(message, userName)
  
  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      try {
        // Send response with streaming effect
        for (let i = 0; i < response.length; i++) {
          const char = response[i]
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: char })}\n\n`))
          await new Promise(resolve => setTimeout(resolve, 15))
        }
        
        controller.enqueue(encoder.encode("data: [DONE]\n\n"))
        controller.close()
      } catch (error) {
        console.error("Streaming error:", error)
        controller.error(error)
      }
    },
  })

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}

function generateFallbackResponse(message: string, userName: string): string {
  const lowerMessage = message.toLowerCase()

  // CGPA and GPA related
  if (lowerMessage.includes("cgpa") || lowerMessage.includes("calculate") || lowerMessage.includes("gpa")) {
    return `Great question about CGPA! Your Cumulative Grade Point Average (CGPA) is calculated by taking the weighted average of all your course grades.

Here's the formula:
CGPA = (Sum of Grade Points × Credit Units) / Total Credit Units

For example:
- Course A: Grade B (4.0 GP) × 3 units = 12 points
- Course B: Grade A (5.0 GP) × 4 units = 20 points  
- Course C: Grade C (3.0 GP) × 2 units = 6 points
Total: 38 points ÷ 9 units = 4.22 CGPA

Add your results in the "My Results" section to see your actual CGPA calculated automatically!`
  }

  // Profile and setup
  if (lowerMessage.includes("profile") || lowerMessage.includes("setup") || lowerMessage.includes("start")) {
    return `Hi ${userName}! Welcome to CGPA AI. To get personalized insights, complete your profile:

1. Go to Profile Setup from the sidebar
2. Enter your matric number and academic details
3. Select your faculty, department, and programme
4. Set your current level and semester

Once complete, you can:
- Add your course results
- Track your CGPA automatically
- View performance analytics
- Get personalized study recommendations`
  }

  // Study tips and improvement
  if (lowerMessage.includes("study") || lowerMessage.includes("improve") || lowerMessage.includes("tips") || lowerMessage.includes("better")) {
    return `Here are effective study strategies to improve your academic performance:

1. **Time Management**: Use the Pomodoro Technique (25 min study, 5 min break)
2. **Active Recall**: Test yourself regularly instead of just re-reading
3. **Spaced Repetition**: Review material at increasing intervals
4. **Study Groups**: Collaborate with classmates for difficult topics
5. **Office Hours**: Ask lecturers for clarification
6. **Past Papers**: Practice with previous exam questions

Focus on understanding concepts rather than memorization. Quality study time beats quantity!`
  }

  // Grading system
  if (lowerMessage.includes("grade") || lowerMessage.includes("point") || lowerMessage.includes("score")) {
    return `The typical grading system:

- **A (70-100%)**: 5.0 Grade Points - Excellent
- **B (60-69%)**: 4.0 Grade Points - Very Good  
- **C (50-59%)**: 3.0 Grade Points - Good
- **D (45-49%)**: 2.0 Grade Points - Fair
- **E (40-44%)**: 1.0 Grade Points - Pass
- **F (0-39%)**: 0.0 Grade Points - Fail

**Class of Degree:**
- First Class: 4.50 - 5.00
- Second Class Upper: 3.50 - 4.49
- Second Class Lower: 2.40 - 3.49
- Third Class: 1.50 - 2.39`
  }

  // System usage
  if (lowerMessage.includes("how") && (lowerMessage.includes("use") || lowerMessage.includes("work"))) {
    return `CGPA AI helps you track and improve your academic performance:

**Dashboard**: View overall CGPA, recent results, and quick stats

**My Results**: Add, view, and manage course results
- Click "Add Result" to enter a new result
- Select course, semester, and enter score
- Grade and GPA calculated automatically

**Analytics**: See detailed performance insights
- GPA trends over semesters
- Grade distribution charts
- Best and worst performing courses

**AI Advisor**: Get personalized academic advice
- Ask questions about calculations
- Get study recommendations
- Plan target CGPA strategies`
  }

  // Greetings
  if (lowerMessage.match(/^(hi|hello|hey|good morning|good afternoon|good evening)/)) {
    return `Hello ${userName}! 👋 Great to see you here. I'm your AI Academic Advisor, and I'm here to help you succeed in your studies.

You can ask me anything - whether it's about your academics, general questions, or just chat. I'm here to help!

Some things I can help with:
- Academic planning and CGPA calculations
- Study strategies and tips
- General knowledge questions
- Course advice and guidance
- Motivation and support

What's on your mind today?`
  }

  // Thank you
  if (lowerMessage.includes("thank") || lowerMessage.includes("thanks")) {
    return `You're very welcome, ${userName}! 😊 I'm always here to help. Feel free to ask me anything anytime - whether it's about your studies or just a friendly chat. Good luck with your academics! 🎓`
  }

  // Motivation and encouragement
  if (lowerMessage.includes("motivate") || lowerMessage.includes("encourage") || lowerMessage.includes("stressed") || lowerMessage.includes("worried")) {
    return `Hey ${userName}, I hear you! Academic life can be challenging, but remember:

✨ **Every expert was once a beginner** - You're learning and growing every day
📚 **Progress over perfection** - Small consistent steps lead to big results
🎯 **You've got this!** - You're already taking steps by using this tool
💪 **Challenges are opportunities** - Each difficulty makes you stronger

Remember to:
- Take breaks and rest when needed
- Celebrate small wins
- Ask for help when you need it
- Believe in your ability to improve

You're doing great by being proactive about your academics. Keep going! 🌟`
  }

  // General conversation - be friendly and helpful
  return `Hi ${userName}! I'm your AI Academic Advisor. I can chat with you about anything - academics, general questions, or just a friendly conversation!

I'm particularly good at helping with:
- 📊 CGPA and GPA calculations
- 📚 Study strategies and tips
- 🎯 Academic planning and goal setting
- 💡 General knowledge and questions
- 🤝 Academic support and motivation

Feel free to ask me anything! What would you like to talk about today?

**Note**: I'm currently in simplified mode. For more advanced, personalized insights based on your actual academic data, we'll need to configure the full AI service. But I'm still here to help however I can!`
}
