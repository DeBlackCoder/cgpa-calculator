import { NextRequest } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// Fallback AI chat endpoint (without Grok API)
// Use this temporarily if Grok API is not working
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      )
    }

    const { message } = await request.json()

    if (!message) {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }

    // Generate a simple contextual response
    const response = generateFallbackResponse(message, session.user.name)

    // Create streaming response
    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          // Send response character by character for streaming effect
          for (let i = 0; i < response.length; i++) {
            const char = response[i]
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: char })}\n\n`))
            // Small delay for streaming effect
            await new Promise(resolve => setTimeout(resolve, 20))
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
    console.error("Chat fallback error:", error)
    return new Response(
      JSON.stringify({ error: "Internal server error", message: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}

function generateFallbackResponse(message: string, userName: string): string {
  const lowerMessage = message.toLowerCase()

  // CGPA calculation questions
  if (lowerMessage.includes("cgpa") || lowerMessage.includes("calculate") || lowerMessage.includes("gpa")) {
    return `Great question about CGPA! Your Cumulative Grade Point Average (CGPA) is calculated by taking the weighted average of all your course grades.

Here's the formula:
CGPA = (Sum of Grade Points × Credit Units) / Total Credit Units

For example:
- Course A: Grade B (4.0 GP) × 3 units = 12 points
- Course B: Grade A (5.0 GP) × 4 units = 20 points
- Course C: Grade C (3.0 GP) × 2 units = 6 points
Total: 38 points ÷ 9 units = 4.22 CGPA

You can add your results in the "My Results" section to see your actual CGPA calculated automatically!`
  }

  // Profile setup questions
  if (lowerMessage.includes("profile") || lowerMessage.includes("setup") || lowerMessage.includes("start")) {
    return `Hi ${userName}! Welcome to CGPA AI. To get personalized insights, you should complete your profile:

1. Go to Profile Setup from the sidebar
2. Enter your matric number and academic details
3. Select your faculty, department, and programme
4. Set your current level and semester

Once your profile is complete, you can:
- Add your course results
- Track your CGPA automatically
- View performance analytics
- Get personalized study recommendations

Would you like help with anything specific?`
  }

  // Study tips
  if (lowerMessage.includes("study") || lowerMessage.includes("improve") || lowerMessage.includes("tips")) {
    return `Here are some effective study strategies to improve your academic performance:

1. **Time Management**: Use the Pomodoro Technique (25 min study, 5 min break)
2. **Active Recall**: Test yourself regularly instead of just re-reading
3. **Spaced Repetition**: Review material at increasing intervals
4. **Study Groups**: Collaborate with classmates for difficult topics
5. **Office Hours**: Don't hesitate to ask lecturers for clarification
6. **Past Papers**: Practice with previous exam questions

Focus on understanding concepts rather than memorization. Quality study time beats quantity every time!

What specific area would you like more help with?`
  }

  // Grading system
  if (lowerMessage.includes("grade") || lowerMessage.includes("point") || lowerMessage.includes("score")) {
    return `The typical grading system works as follows:

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
- Third Class: 1.50 - 2.39
- Pass: 1.00 - 1.49

You can add your results and the system will automatically calculate your grades and CGPA!`
  }

  // System usage
  if (lowerMessage.includes("how") || lowerMessage.includes("use") || lowerMessage.includes("work")) {
    return `CGPA AI helps you track and improve your academic performance. Here's how to use it:

**Dashboard**: View your overall CGPA, recent results, and quick stats

**My Results**: Add, view, and manage your course results
- Click "Add Result" to enter a new result
- Select course, semester, and enter your score
- Grade and GPA calculated automatically

**Analytics**: See detailed performance insights
- GPA trends over semesters
- Grade distribution charts
- Best and worst performing courses

**AI Advisor**: Get personalized academic advice (that's me!)
- Ask questions about calculations
- Get study recommendations
- Plan target CGPA strategies

Start by completing your profile, then add your course results to unlock all features!`
  }

  // Default response
  return `Hi ${userName}! I'm your AI Academic Advisor. I can help you with:

- Understanding CGPA and GPA calculations
- Study tips and improvement strategies
- Using this system effectively
- Academic planning and goal setting
- Explaining grading systems
- Analyzing your performance

**Note**: I'm currently running in limited mode. The full AI features with personalized insights based on your actual data will be available once the AI service is configured.

What would you like to know about?`
}
