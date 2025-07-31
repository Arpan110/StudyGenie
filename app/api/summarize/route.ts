// app/api/summarize/route.ts

import pdfParse from "@/lib/pdf-parse-fix"
import { generateText } from "ai"
import { google } from "@ai-sdk/google"

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const text = formData.get("text") as string | null

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

    if (file) {
      console.log("📄 PDF uploaded:", file.name)
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      try {
        const pdfData = await pdfParse(buffer)
        content = pdfData.text
        console.log("✅ Extracted PDF text:", content.slice(0, 300))
        if (!content.trim()) {
          const response = Response.json({ error: "The uploaded PDF is empty or contains no readable text." }, { status: 400 })
          response.headers.set("Content-Type", "application/json")
          return response
        }
      } catch (pdfError) {
        console.error("❌ Failed to parse PDF:", pdfError)
        const response = Response.json({ error: "Failed to read PDF content. Ensure it's not an image-based file." }, { status: 500 })
        response.headers.set("Content-Type", "application/json")
        return response
      }
    } else if (text) {
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
