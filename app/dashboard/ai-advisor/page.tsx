"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Send, Bot, User, Sparkles, TrendingUp, Target, BookOpen } from "lucide-react"
import { toast } from "sonner"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface Message {
  role: "user" | "assistant"
  content: string
}

const SUGGESTED_PROMPTS = [
  {
    icon: TrendingUp,
    text: "How can I improve my GPA?",
    prompt: "Analyze my performance and suggest specific ways I can improve my GPA. What should I focus on?"
  },
  {
    icon: Target,
    text: "Calculate required GPA",
    prompt: "I want to achieve a 4.5 CGPA. What GPA do I need in my remaining semesters?"
  },
  {
    icon: BookOpen,
    text: "Study strategies",
    prompt: "Can you recommend effective study strategies based on my current performance?"
  },
  {
    icon: Sparkles,
    text: "Motivational advice",
    prompt: "I'm feeling discouraged about my grades. Can you give me some motivation and advice?"
  }
]

export default function AIAdvisorPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (messageText?: string) => {
    const messageToSend = messageText || input.trim()
    
    if (!messageToSend || isLoading) return

    const userMessage: Message = {
      role: "user",
      content: messageToSend
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageToSend,
          includeContext: true
        })
      })

      if (!response.ok) {
        // Try to get error details from response
        let errorMessage = "Failed to get response"
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorData.error || errorMessage
          console.error("API Error Details:", errorData)
        } catch (e) {
          console.error("Could not parse error response")
        }
        throw new Error(errorMessage)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) throw new Error("No reader available")

      let assistantMessage = ""

      // Add empty assistant message
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "" }
      ])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split("\n")

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6)
            
            if (data === "[DONE]") {
              break
            }

            try {
              const parsed = JSON.parse(data)
              if (parsed.content) {
                assistantMessage += parsed.content
                
                // Update the last message
                setMessages((prev) => {
                  const newMessages = [...prev]
                  newMessages[newMessages.length - 1] = {
                    role: "assistant",
                    content: assistantMessage
                  }
                  return newMessages
                })
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error)
      toast.error("Failed to get response. Please try again.")
      
      // Remove the empty assistant message if error occurs
      setMessages((prev) => prev.slice(0, -1))
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col p-6 gap-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Bot className="h-8 w-8 text-purple-600" />
          <h1 className="text-3xl font-bold">AI Academic Advisor</h1>
          <Badge variant="secondary" className="ml-2">
            Powered by Gemini
          </Badge>
        </div>
        <p className="text-gray-600">
          Get personalized academic advice and insights powered by Grok AI
        </p>
      </div>

      <div className="flex-1 grid lg:grid-cols-3 gap-6 min-h-0">
        {/* Chat Area */}
        <Card className="lg:col-span-2 flex flex-col">
          <CardHeader className="border-b border-gray-200">
            <div className="flex items-center justify-between">
              <CardTitle>Chat</CardTitle>
              <Badge variant="secondary">
                <Sparkles className="h-3 w-3 mr-1" />
                AI-Powered
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center max-w-md">
                    <Bot className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold mb-2">
                      Welcome to AI Academic Advisor
                    </h3>
                    <p className="text-sm text-gray-600">
                      Ask me anything about your academic performance, study strategies,
                      or how to improve your grades. Try one of the suggested prompts!
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex gap-3 ${
                        message.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {message.role === "assistant" && (
                        <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center flex-shrink-0">
                          <Bot className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-3 ${
                          message.role === "user"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        {message.role === "assistant" ? (
                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {message.content || "Thinking..."}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          <p className="text-sm">{message.content}</p>
                        )}
                      </div>
                      {message.role === "user" && (
                        <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                          <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask me anything about your academics..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isLoading}
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Suggested Prompts */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Suggested Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {SUGGESTED_PROMPTS.map((prompt, index) => {
                const Icon = prompt.icon
                return (
                  <button
                    key={index}
                    onClick={() => sendMessage(prompt.prompt)}
                    disabled={isLoading}
                    className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-start gap-3">
                      <Icon className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">{prompt.text}</p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-600">
              <p>💡 Be specific about your concerns</p>
              <p>📊 I have access to your academic data</p>
              <p>🎯 Ask about goal setting and planning</p>
              <p>📚 Request study strategies</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
