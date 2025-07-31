"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Send,
  Bot,
  User,
  Sparkles,
  ArrowLeft,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Zap,
  Brain,
  BookOpen,
  CheckCircle2,
  Github,
  Linkedin,
  Mail,
} from "lucide-react"
import Link from "next/link"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your AI study assistant powered by Gemini. I can help you with any academic questions, explain complex concepts, solve problems, and provide detailed explanations. What would you like to learn about today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  
  // Set isMounted to true after component mounts to prevent hydration issues
  useEffect(() => {
    setIsMounted(true)
    
    // Add a cleanup function to abort any pending requests when unmounting
    return () => {
      // This helps prevent memory leaks and abort errors
    }
  }, [])
  const [likedMessages, setLikedMessages] = useState<Set<string>>(new Set())
  const [dislikedMessages, setDislikedMessages] = useState<Set<string>>(new Set())
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [showContactModal, setShowContactModal] = useState(false)

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Add a client-side timeout to prevent hanging requests
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

      try {
        // Import the API utility function
        const { createApiUrl } = await import('@/lib/api-utils')
        
        const response = await fetch(createApiUrl("/api/chat"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: input.trim(),
            history: messages.slice(-5), // Only send last 5 messages for context
          }),
          signal: controller.signal,
          // Add cache control to prevent caching issues
          cache: 'no-store',
        })

        clearTimeout(timeoutId) // Clear the timeout if request completes

      // Process response based on status code
      let responseContent = ""
      let noticePrefix = ""

      if (response.ok) {
        const data = await response.json()
        
        // Handle both successful responses and fallback responses
        responseContent = data.response || 
          "I apologize, but I'm having trouble generating a response right now. Please try again in a moment."

        // Add notice if provided
        if (data.notice) {
          noticePrefix = `⚠️ ${data.notice}\n\n`
        }
      } else {
        // Handle different error status codes
        switch (response.status) {
          case 400:
            responseContent = "I couldn't process your question. Please try rephrasing it or asking something else."
            noticePrefix = "⚠️ Invalid request\n\n"
            break
          case 408:
            responseContent = "Your request took too long to process. Please try a simpler question or try again later."
            noticePrefix = "⚠️ Request timeout\n\n"
            break
          case 429:
            responseContent = "I'm currently experiencing high demand and have reached my usage limits. Please try again in 5-10 minutes. If this issue persists, please contact the administrator."
            noticePrefix = "⚠️ Rate limit or quota exceeded\n\n"
            break
          default:
            responseContent = "I'm experiencing technical difficulties. Please try again later."
            noticePrefix = "⚠️ Service error\n\n"
        }

        // Try to get more detailed error info from response body
        try {
          const errorData = await response.json()
          if (errorData.response) {
            responseContent = errorData.response
          }
          if (errorData.notice) {
            noticePrefix = `⚠️ ${errorData.notice}\n\n`
          }
        } catch (e) {
          // If we can't parse the error response, use the default messages
          console.error("Error parsing error response:", e)
        }
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: noticePrefix + responseContent,
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      } catch (error) {
        clearTimeout(timeoutId)
        console.error("Error:", error)

        let errorContent = "🔧 I'm experiencing technical difficulties right now. This might be due to:\n\n• High server demand\n• Temporary API issues\n• Network connectivity problems\n\nPlease try again in a few minutes! While you wait, consider:\n• Breaking your question into smaller parts\n• Checking your course materials\n• Using online educational resources as backup"

        // Provide more specific error messages for common errors
        if (error instanceof DOMException && error.name === "AbortError") {
          errorContent = "⏱️ Your request took too long to complete and was automatically cancelled. This might be because:\n\n• The server is experiencing high load\n• Your question was very complex\n• There are network connectivity issues\n\nPlease try again with a simpler question or try later when the system is less busy."
        } else if (error instanceof TypeError && error.message.includes("fetch")) {
          errorContent = "🌐 I couldn't connect to the AI service. This might be due to:\n\n• Your internet connection is offline\n• The server is temporarily unavailable\n\nPlease check your connection and try again in a moment."
        }

        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: errorContent,
          role: "assistant",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorMessage])
      } finally {
        setIsLoading(false)
      }
    } catch (outerError) {
      // Handle any errors that might occur outside the fetch try/catch
      console.error("Outer error:", outerError)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "An unexpected error occurred. Please try again later.",
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedMessageId(messageId)
      setTimeout(() => setCopiedMessageId(null), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const handleLike = (messageId: string) => {
    setLikedMessages((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(messageId)) {
        newSet.delete(messageId)
      } else {
        newSet.add(messageId)
        // Remove from disliked if it was disliked
        setDislikedMessages((prevDisliked) => {
          const newDislikedSet = new Set(prevDisliked)
          newDislikedSet.delete(messageId)
          return newDislikedSet
        })
      }
      return newSet
    })
  }

  const handleDislike = (messageId: string) => {
    setDislikedMessages((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(messageId)) {
        newSet.delete(messageId)
      } else {
        newSet.add(messageId)
        // Remove from liked if it was liked
        setLikedMessages((prevLiked) => {
          const newLikedSet = new Set(prevLiked)
          newLikedSet.delete(messageId)
          return newLikedSet
        })
      }
      return newSet
    })
  }

  const suggestedQuestions = [
    "Explain quantum physics in simple terms",
    "Help me solve calculus derivatives",
    "What are the key concepts in organic chemistry?",
    "Explain the causes of World War I",
    "How does photosynthesis work?",
  ]

  // Contact Modal Component (updated)
  const ContactModal = () => (
    <div
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        showContactModal ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl transform transition-all duration-300 ${
          showContactModal ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Get in Touch</h3>
          <p className="text-gray-600 dark:text-gray-400">Connect with me through these platforms!</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
              <Mail className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 dark:text-gray-100">Email</p>
              <a
                href="mailto:arpan0325@gmail.com"
                className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors text-sm"
              >
                arpan0325@gmail.com
              </a>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <Linkedin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 dark:text-gray-100">LinkedIn</p>
              <a
                href="https://www.linkedin.com/in/arpan-paul-a204a3283"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors text-sm"
              >
                Connect with me
              </a>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-600 rounded-xl flex items-center justify-center">
              <Github className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 dark:text-gray-100">GitHub</p>
              <a
                href="https://github.com/Arpan110"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors text-sm"
              >
                @Arpan110
              </a>
            </div>
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <Button onClick={() => setShowContactModal(false)} variant="outline" className="flex-1">
            Close
          </Button>
          <Button
            onClick={() => {
              window.open("mailto:arpan0325@gmail.com?subject=StudyGenie Chat Help", "_blank")
              setShowContactModal(false)
            }}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Send Email
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
      {/* Enhanced Header */}
      <header className="border-b bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl sticky top-0 z-50 shadow-sm border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="hover:bg-blue-50 dark:hover:bg-blue-900/20">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    AI Study Assistant
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Always ready to help</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge
                variant="secondary"
                className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700 px-3 py-1"
              >
                <Zap className="w-3 h-3 mr-1" />
                Powered by Gemini
              </Badge>
              <Badge variant="outline" className="hidden md:flex">
                <Brain className="w-3 h-3 mr-1" />
                Smart Mode
              </Badge>
              <ThemeToggle />
              <Link href="/signin">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={() => setShowContactModal(true)}>
                Contact
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <Card className="h-[calc(100vh-200px)] flex flex-col shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-t-lg">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-lg text-gray-900 dark:text-gray-100">Study Assistant</span>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-normal">
                    Ask me anything about your studies
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">Online</span>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages */}
            <ScrollArea className="flex-1 px-6" ref={scrollAreaRef}>
              <div className="space-y-6 py-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-4 ${
                      message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                        message.role === "user"
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600"
                          : "bg-gradient-to-r from-green-500 to-emerald-500"
                      }`}
                    >
                      {message.role === "user" ? (
                        <User className="w-5 h-5 text-white" />
                      ) : (
                        <Bot className="w-5 h-5 text-white" />
                      )}
                    </div>

                    <div className={`flex-1 max-w-[80%] ${message.role === "user" ? "text-right" : ""}`}>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {message.role === "user" ? "You" : "StudyGenie AI"}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {isMounted ? message.timestamp.toLocaleTimeString() : ''}
                        </span>
                      </div>

                      <div
                        className={`rounded-2xl px-6 py-4 shadow-sm ${
                          message.role === "user"
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white ml-auto"
                            : "bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600"
                        }`}
                      >
                        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                      </div>

                      {message.role === "assistant" && (
                        <div className="flex items-center space-x-2 mt-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(message.content, message.id)}
                            className={`h-8 px-3 text-xs transition-all duration-200 ${
                              copiedMessageId === message.id
                                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30"
                                : "hover:bg-gray-100 dark:hover:bg-gray-700"
                            }`}
                          >
                            {copiedMessageId === message.id ? (
                              <>
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3 mr-1" />
                                Copy
                              </>
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLike(message.id)}
                            className={`h-8 px-3 transition-all duration-200 ${
                              likedMessages.has(message.id)
                                ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30"
                                : "hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400"
                            }`}
                          >
                            <ThumbsUp className={`w-3 h-3 ${likedMessages.has(message.id) ? "fill-current" : ""}`} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDislike(message.id)}
                            className={`h-8 px-3 transition-all duration-200 ${
                              dislikedMessages.has(message.id)
                                ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30"
                                : "hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
                            }`}
                          >
                            <ThumbsDown
                              className={`w-3 h-3 ${dislikedMessages.has(message.id) ? "fill-current" : ""}`}
                            />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-2xl px-6 py-4 border border-gray-200 dark:border-gray-600">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-gray-400 dark:bg-gray-300 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 dark:bg-gray-300 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 dark:bg-gray-300 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Suggested Questions */}
            {messages.length === 1 && (
              <div className="px-6 py-4 border-t bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10 border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2 mb-3">
                  <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Try asking about:</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setInput(question)}
                      className="text-xs bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200 dark:hover:border-blue-700 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-200"
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Enhanced Input Form */}
            <div className="p-6 border-t bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <form onSubmit={handleSubmit} className="flex space-x-3">
                <div className="flex-1 relative">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me anything about your studies..."
                    disabled={isLoading}
                    className="pr-12 py-3 text-base border-2 border-gray-200 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-500 rounded-xl bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 transition-all duration-200"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Sparkles className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </Button>
              </form>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                StudyGenie AI can make mistakes. Please verify important information.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      {showContactModal && <ContactModal />}
    </div>
  )
}
