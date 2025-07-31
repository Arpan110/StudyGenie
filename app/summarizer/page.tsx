"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Upload,
  FileText,
  ArrowLeft,
  Download,
  Sparkles,
  BookOpen,
  HelpCircle,
  Zap,
  Brain,
  Clock,
  Target,
  Github,
  Linkedin,
  Mail,
} from "lucide-react"
import Link from "next/link"

export default function SummarizerPage() {
  const [file, setFile] = useState<File | null>(null)
  const [textInput, setTextInput] = useState("")
  const [summary, setSummary] = useState("")
  const [quiz, setQuiz] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("upload")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showContactModal, setShowContactModal] = useState(false)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile)
    }
  }

  const generateSummary = async () => {
    if (!file && !textInput.trim()) return

    setIsLoading(true)
    try {
      let response;
      
      if (file) {
        // For file uploads, use FormData
        const formData = new FormData()
        formData.append("file", file)
        
        response = await fetch("/api/summarize3", {
          method: "POST",
          body: formData,
        })
      } else {
        // For text input, use JSON
        response = await fetch("/api/summarize3", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: textInput }),
        })
      }

      // Check if response is JSON before parsing
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response. The API might be experiencing issues.")
      }

      let data
      try {
        data = await response.json()
      } catch (jsonError) {
        console.error("JSON parsing error:", jsonError)
        throw new Error("Failed to parse server response. The API might be experiencing issues.")
      }
      
      if (!response.ok) {
        const errorMessage = data.error || "Failed to generate summary"
        throw new Error(errorMessage)
      }

      setSummary(data.summary)
      
      // If there's a note about fallback summary, display it
      if (data.note) {
        console.log("Fallback note:", data.note)
        // Append the note to the summary
        setSummary(prev => `${prev}\n\n**Note:** ${data.note}`)
      }
    } catch (error) {
      console.error("Error:", error)
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"
      setSummary(`Error: ${errorMessage}\n\nPlease try again or use a different document.`)
    } finally {
      setIsLoading(false)
    }
  }

  const generateQuiz = async () => {
    if (!file && !textInput.trim()) return

    setIsLoading(true)
    try {
      const formData = new FormData()
      if (file) {
        formData.append("file", file)
      } else {
        formData.append("text", textInput)
      }

      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        body: formData,
      })

      // Check if response is JSON before parsing
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response. The API might be experiencing issues.")
      }

      let data
      try {
        data = await response.json()
      } catch (jsonError) {
        console.error("JSON parsing error:", jsonError)
        throw new Error("Failed to parse server response. The API might be experiencing issues.")
      }
      
      if (!response.ok) {
        const errorMessage = data.error || "Failed to generate quiz"
        throw new Error(errorMessage)
      }

      setQuiz(data.questions)
    } catch (error) {
      console.error("Error:", error)
      setQuiz([])
      // Display error in summary section if quiz generation fails
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"
      setSummary(`Error generating quiz: ${errorMessage}\n\nPlease try again or use a different document.`)
    } finally {
      setIsLoading(false)
    }
  }

  const features = [
    {
      icon: Brain,
      title: "Smart Summarization",
      description: "AI extracts key points and concepts automatically",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: HelpCircle,
      title: "Auto Quiz Generation",
      description: "Creates practice questions instantly from your content",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: Download,
      title: "Export Results",
      description: "Save summaries and quizzes for offline study",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ]

  // Contact Modal Component (updated)
  const ContactModal = () => (
    <div
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 md:p-4 transition-opacity duration-300 ${showContactModal ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      <div
        className={`bg-white rounded-2xl p-5 md:p-8 max-w-md w-full shadow-2xl transform transition-all duration-300 ${showContactModal ? "scale-100 translate-y-0" : "scale-95 translate-y-4"}`}
      >
        <div className="text-center mb-4 md:mb-6">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4">
            <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-white" />
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1 md:mb-2">Get in Touch</h3>
          <p className="text-sm md:text-base text-gray-600">Need help with summarization? Connect with me!</p>
        </div>

        <div className="space-y-3 md:space-y-4">
          <div className="flex items-center space-x-2 md:space-x-3 p-3 md:p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
              <Mail className="w-5 h-5 md:w-6 md:h-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm md:text-base text-gray-900 dark:text-gray-100">Email</p>
              <a
                href="mailto:arpan0325@gmail.com"
                className="text-xs md:text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
              >
                arpan0325@gmail.com
              </a>
            </div>
          </div>

          <div className="flex items-center space-x-2 md:space-x-3 p-3 md:p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <Linkedin className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm md:text-base text-gray-900 dark:text-gray-100">LinkedIn</p>
              <a
                href="https://www.linkedin.com/in/arpan-paul-a204a3283"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs md:text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                Connect with me
              </a>
            </div>
          </div>

          <div className="flex items-center space-x-2 md:space-x-3 p-3 md:p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-100 dark:bg-gray-600 rounded-xl flex items-center justify-center">
              <Github className="w-5 h-5 md:w-6 md:h-6 text-gray-700 dark:text-gray-300" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm md:text-base text-gray-900 dark:text-gray-100">GitHub</p>
              <a
                href="https://github.com/Arpan110"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs md:text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                @Arpan110
              </a>
            </div>
          </div>
        </div>

        <div className="flex space-x-2 md:space-x-3 mt-4 md:mt-6">
          <Button onClick={() => setShowContactModal(false)} variant="outline" className="flex-1 text-xs md:text-sm py-1 md:py-2">
            Close
          </Button>
          <Button
            onClick={() => {
              window.open("mailto:arpan0325@gmail.com?subject=StudyGenie Summarizer Help", "_blank")
              setShowContactModal(false)
            }}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-xs md:text-sm py-1 md:py-2"
          >
            Send Email
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Enhanced Header */}
      <header className="border-b bg-white/90 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 md:space-x-4">
                <Link href="/">
                  <Button
                    variant="ghost"size="sm"className="text-black hover:bg-black hover:text-white px-2 md:px-3">
                      <ArrowLeft className="w-4 h-4 mr-1 md:mr-2" />
                      <span className="text-sm">Back</span>
                      </Button>

                </Link>
                <div className="flex items-center space-x-2 md:space-x-3">
                  <div className="relative">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                      <FileText className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-orange-500 rounded-full border-2 border-white animate-pulse"></div>
                  </div>
                  <div>
                    <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                      Smart Summarizer
                    </h1>
                    <p className="text-xs text-gray-500 hidden sm:block">Transform content into insights</p>
                  </div>
                </div>
              </div>
              <div className="flex md:hidden items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowContactModal(true)}
                  className="p-1"
                >
                  <HelpCircle className="w-5 h-5 text-gray-600" />
                </Button>
                <Link href="/signin">
                  <Button variant="outline" size="sm" className="px-2 py-1 text-xs">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-3 mt-2 md:mt-0">
             <Badge
            variant="secondary"className="bg-blue-100 text-blue-700 border-blue-200 px-3 py-1 hover:bg-blue-200 transition-colors duration-200">
          <Zap className="w-3 h-3 mr-1" />AI-Powered</Badge>

              <Badge variant="outline" className="hidden md:flex text-black bg-white border-gray-300 px-3 py-1">
                <Clock className="w-3 h-3 mr-1" />
                Fast Mode
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowContactModal(true)}
                className="text-gray-600 hover:text-blue-600 hover:bg-blue-50"
              >
                Help
              </Button>
              <Link href="/signin">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <CardContent className="p-4 md:p-6 text-center">
                <div
                  className={`w-10 h-10 md:w-12 md:h-12 ${feature.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-lg`}
                >
                  <feature.icon className={`w-5 h-5 md:w-6 md:h-6 ${feature.color}`} />
                </div>
                <h3 className="font-semibold text-base md:text-lg mb-1 md:mb-2">{feature.title}</h3>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Enhanced Input Section */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 rounded-t-lg p-4 md:p-6">
            <CardTitle className="flex items-center space-x-2 md:space-x-3">
              <div className="w-7 h-7 md:w-8 md:h-8 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg flex items-center justify-center">
                <Upload className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                </div>
                 <div>
                  <span className="text-base md:text-lg text-gray-700 font-semibold">Upload & Process</span>
                  <p className="text-xs md:text-sm text-gray-600 font-normal">Add your study materials</p>
                  </div>
            </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-4 md:mb-6 bg-gray-100 text-xs md:text-sm">
                  <TabsTrigger value="upload" className="data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm py-1 md:py-2">
                    <FileText className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 text-gray" />
                    Upload PDF
                  </TabsTrigger>
                  <TabsTrigger value="text" className="data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm py-1 md:py-2">
                    <BookOpen className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 text-gray" />
                    Paste Text
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="upload" className="space-y-3 md:space-y-4">
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-2xl p-6 md:p-12 text-center hover:border-green-400 hover:bg-green-50/50 transition-all duration-300 cursor-pointer group"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Upload className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
                    </div>
                    {file ? (
                      <div>
                        <p className="text-green-600 font-semibold text-base md:text-lg mb-1 md:mb-2 break-all">{file.name}</p>
                        <p className="text-xs md:text-sm text-gray-500">Click to change file</p>
                        <Badge variant="secondary" className="mt-2 bg-green-100 text-green-700 text-xs ">
                          Ready to process
                        </Badge>
                      </div>
                    ) : (
                      <div>
                        <p className="text-gray-700 font-medium text-base md:text-lg mb-1 md:mb-2">Drop your PDF here or click to browse</p>
                        <p className="text-xs md:text-sm text-gray-500 mb-3 md:mb-4">Supports PDF files up to 10MB</p>
                        <Badge variant="outline" className="bg-white text-xs text-black border-gray-300 hover:bg-gray-50 transition-all duration-200">
                          <Target className="w-3 h-3 mr-1" />
                          Drag & Drop Enabled
                        </Badge>
                      </div>
                    )}
                  </div>
                  <input ref={fileInputRef} type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" />
                </TabsContent>

                <TabsContent value="text" className="space-y-3 md:space-y-4">
                <Textarea
                placeholder="Paste your notes, textbook content, or any study material here..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="min-h-[200px] md:min-h-[300px] text-sm md:text-base border-2 border-gray-200 focus:border-blue-400 focus:outline-none caret-blue-600 rounded-xl bg-gray-50 focus:bg-white transition-all duration-200 resize-none text-gray-800"/>


                  {textInput && (
                    <div className="flex items-center justify-between text-xs md:text-sm text-gray-500">
                      <span>{textInput.length} characters</span>
                      <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-700 border-blue-200 px-3 py-1 text-xs hover:bg-blue-200 transition-all duration-300">Ready to process</Badge>
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0 mt-6 md:mt-8">
                <Button
                  onClick={generateSummary}
                  disabled={isLoading || (!file && !textInput.trim())}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 py-2 md:py-3 text-sm md:text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <BookOpen className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                  {isLoading ? "Processing..." : "Generate Summary"}
                </Button>
                <Button
                  onClick={generateQuiz}
                  disabled={isLoading || (!file && !textInput.trim())}
                  variant="outline"
                  className="flex-1 py-2 md:py-3 text-sm md:text-base font-semibold border-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 bg-transparent text-gray-800 hover:text-black">
                  <HelpCircle className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                  {isLoading ? "Processing..." : "Create Quiz"}
                </Button>
              </div>
              {(file || textInput.trim() || summary || quiz.length > 0) && (
                <div className="mt-3 md:mt-4 text-center">
                  <Button
                    onClick={() => {
                      setFile(null);
                      setTextInput("");
                      setSummary("");
                      setQuiz([]);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-red-600 hover:bg-red-50 text-xs md:text-sm py-1"
                  >
                    Clear All
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Enhanced Results Section */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg p-4 md:p-6">
              <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center space-x-2 md:space-x-3">
                  <div className="w-7 h-7 md:w-8 md:h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-base md:text-lg text-gray-600 font-normal">AI Results</span>
                    <p className="text-xs md:text-sm text-gray-600 font-normal">Your processed content</p>
                  </div>
                </div>
                {(summary || quiz.length > 0) && (
                  <Button variant="outline" size="sm" className="hover:bg-white bg-transparent text-xs md:text-sm py-1 md:py-2 self-end sm:self-auto">
                    <Download className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                    Export
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <Tabs defaultValue="summary">
                <TabsList className="grid w-full grid-cols-2 mb-4 md:mb-6 bg-gray-100 text-xs md:text-sm">
                  <TabsTrigger value="summary" className="data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm py-1 md:py-2 text-black">
                    <BookOpen className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 text-gray" />
                    Summary
                  </TabsTrigger>
                  <TabsTrigger value="quiz" className="data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm py-1 md:py-2 text-black">
                    <HelpCircle className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 text-gray" />
                    Quiz
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="summary" className="space-y-3 md:space-y-4">
                  {summary ? (
                    <div className={`bg-gradient-to-r rounded-2xl p-4 md:p-6 border ${summary.startsWith('Error') ? 'from-red-50 to-orange-50 border-red-200' : 'from-green-50 to-emerald-50 border-green-200'}`}>
                      <div className="flex items-center space-x-2 mb-3 md:mb-4">
                        <div className={`w-5 h-5 md:w-6 md:h-6 rounded-lg flex items-center justify-center ${summary.startsWith('Error') ? 'bg-red-500' : 'bg-green-500'}`}>
                          {summary.startsWith('Error') ? (
                            <HelpCircle className="w-3 h-3 md:w-4 md:h-4 text-white" />
                          ) : (
                            <BookOpen className="w-3 h-3 md:w-4 md:h-4 text-white" />
                          )}
                        </div>
                        <h3 className={`font-semibold text-sm md:text-base ${summary.startsWith('Error') ? 'text-red-800' : 'text-green-800'}`}>
                          {summary.startsWith('Error') ? 'Error Occurred' : 'Generated Summary'}
                        </h3>
                        <Badge variant="secondary" className={`text-xs ${summary.startsWith('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                          {summary.startsWith('Error') ? 'Try Again' : 'AI-Powered'}
                        </Badge>
                      </div>
                      <div className="prose prose-sm max-w-none">
                        <p className="whitespace-pre-wrap text-gray-700 leading-relaxed text-xs md:text-sm">{summary}</p>
                      </div>
                    </div>
                  ) : isLoading ? (
                    <div className="text-center py-10 md:py-16 text-gray-500">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 animate-pulse">
                        <div className="w-8 h-8 md:w-10 md:h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                      <h3 className="text-base md:text-lg font-semibold mb-1 md:mb-2">Processing Your Content</h3>
                      <p className="text-xs md:text-sm text-gray-600">This may take a few moments depending on the content size...</p>
                    </div>
                  ) : (
                    <div className="text-center py-10 md:py-16 text-gray-500">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6">
                        <BookOpen className="w-8 h-8 md:w-10 md:h-10 text-green-600" />
                      </div>
                      <h3 className="text-base md:text-lg font-semibold mb-1 md:mb-2">Ready to Summarize</h3>
                      <p className="text-xs md:text-sm text-gray-600">Upload a PDF or paste text to generate an intelligent summary</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="quiz" className="space-y-3 md:space-y-4">
                  {quiz.length > 0 ? (
                    <div className="space-y-4 md:space-y-6">
                      <div className="flex items-center space-x-2 mb-3 md:mb-4">
                        <div className="w-5 h-5 md:w-6 md:h-6 bg-blue-500 rounded-lg flex items-center justify-center">
                          <HelpCircle className="w-3 h-3 md:w-4 md:h-4 text-white" />
                        </div>
                        <h3 className="font-semibold text-sm md:text-base text-blue-800">Generated Quiz Questions</h3>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                          {quiz.length} Questions
                        </Badge>
                      </div>
                      {quiz.map((q, index) => (
                        <div
                          key={index}
                          className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 md:p-6 border border-blue-200"
                        >
                          <p className="font-semibold text-base md:text-lg mb-3 md:mb-4 text-gray-900">
                            {index + 1}. {q.question}
                          </p>
                          <div className="space-y-2 md:space-y-3">
                            {q.options.map((option: string, optIndex: number) => (
                              <div key={optIndex} className="flex items-center space-x-2 md:space-x-3">
                                <div
                                  className={`w-6 h-6 md:w-8 md:h-8 rounded-xl border-2 flex items-center justify-center text-xs md:text-sm font-semibold transition-all duration-200 ${
                                    optIndex === q.correct
                                      ? "bg-green-500 border-green-500 text-white shadow-lg"
                                      : "border-gray-300 bg-white hover:border-blue-300"
                                  }`}
                                >
                                  {String.fromCharCode(65 + optIndex)}
                                </div>
                                <span
                                  className={`flex-1 text-xs md:text-sm ${
                                    optIndex === q.correct ? "text-green-700 font-semibold" : "text-gray-700"
                                  }`}
                                >
                                  {option}
                                </span>
                                {optIndex === q.correct && (
                                  <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                                    Correct
                                  </Badge>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : isLoading ? (
                    <div className="text-center py-10 md:py-16 text-gray-500">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 animate-pulse">
                        <div className="w-8 h-8 md:w-10 md:h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                      <h3 className="text-base md:text-lg font-semibold mb-1 md:mb-2">Creating Quiz Questions</h3>
                      <p className="text-xs md:text-sm text-gray-600">This may take a few moments depending on the content size...</p>
                    </div>
                  ) : (
                    <div className="text-center py-10 md:py-16 text-gray-500">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6">
                        <HelpCircle className="w-8 h-8 md:w-10 md:h-10 text-blue-600" />
                      </div>
                      <h3 className="text-base md:text-lg font-semibold mb-1 md:mb-2">Ready to Create Quiz</h3>
                      <p className="text-xs md:text-sm text-gray-600">Upload a PDF or paste text to generate practice questions</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Contact Modal */}
      {showContactModal && <ContactModal />}
    </div>
  )
}
