// app/api/summarize2/route.ts

import pdfParse from "@/lib/pdf-parse-fix"
import { generateText } from "ai"
import { google } from "@ai-sdk/google"

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    let text: string | null = null
    
    // Try to parse as form data first
    try {
      const formData = await request.formData()
      text = formData.get("text") as string | null
    } catch (formError) {
      console.log("Form data parsing failed, trying JSON...", formError)
      // If form data fails, try JSON
      try {
        const jsonData = await request.json()
        text = jsonData.text
      } catch (jsonError) {
        console.log("JSON parsing failed, trying text...", jsonError)
        // If JSON fails, try text
        try {
          const textData = await request.text()
          // Try to extract text from the raw body
          const textMatch = textData.match(/name="text"[\r\n]+[\r\n]+([^\r\n]+)/)
          if (textMatch && textMatch[1]) {
            text = textMatch[1]
          } else {
            // Just use the whole text as input if we can't parse it
            text = textData
          }
        } catch (textError) {
          console.log("Text parsing failed", textError)
        }
      }
    }

    // ✅ Check API Key
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
    if (!apiKey) {
      console.error("❌ GOOGLE_GENERATIVE_AI_API_KEY is not set")
      const response = Response.json({ error: "API key not configured" }, { status: 500 })
      response.headers.set("Content-Type", "application/json")
      return response
    }
    console.log("✅ API Key found:", apiKey.substring(0, 5) + "...")

    let content = ""

    if (text) {
      content = text
      console.log("📝 Text content received:", content.slice(0, 300))
    } else {
      const response = Response.json({ error: "No content provided" }, { status: 400 })
      response.headers.set("Content-Type", "application/json")
      return response
    }

    console.log("⚙️ Sending content to Gemini API...")

    try {
      const { text: summary } = await generateText({
        model: google("gemini-1.5-flash"),
        system: `You are an expert academic summarizer. Create concise, well-structured summaries that capture the key points, main concepts, and important details from study materials. Format your summaries with:

1. Main topic/subject
2. Key concepts (bullet points)
3. Important details
4. Conclusions or takeaways

Keep summaries clear, organized, and focused on the most important information for studying.`,
        prompt: `Please create a comprehensive summary of the following content:\n\n${content}`,
        maxTokens: 800,
      })

      console.log("✅ Summary generated successfully!")
      const response = Response.json({ summary })
      response.headers.set("Content-Type", "application/json")
      return response
    } catch (aiError) {
      console.error("❌ AI Generation error:", aiError)
      
      if (aiError instanceof Error) {
        if (aiError.message.includes("API key")) {
          const response = Response.json({ error: "Invalid API key. Please check your Google AI API key." }, { status: 401 })
          response.headers.set("Content-Type", "application/json")
          return response
        }
        const response = Response.json({ error: `Summarization failed: ${aiError.message}` }, { status: 500 })
        response.headers.set("Content-Type", "application/json")
        return response
      }
      
      const response = Response.json({ error: "Failed to generate summary. Please try again." }, { status: 500 })
      response.headers.set("Content-Type", "application/json")
      return response
    }

  } catch (error) {
    console.error("❌ Summarize API error:", error)

    // Handle different types of errors with appropriate status codes
    if (error instanceof Error) {
      // Check for specific error types
      if (error.message.includes("API key")) {
        const response = Response.json({ error: "Invalid API key. Please check your Google AI API key." }, { status: 401 })
        response.headers.set("Content-Type", "application/json")
        return response
      }
      
      if (error.message.includes("content provided")) {
        const response = Response.json({ error: error.message }, { status: 400 })
        response.headers.set("Content-Type", "application/json")
        return response
      }

      const response = Response.json(
        { error: `Summarization failed: ${error.message}` },
        { status: 500 }
      )
      response.headers.set("Content-Type", "application/json")
      return response
    }

    // Generic error fallback
    const response = Response.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    )
    response.headers.set("Content-Type", "application/json")
    return response
  }
}