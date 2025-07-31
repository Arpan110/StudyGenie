// app/api/summarize3/route.ts

import { generateText } from "ai"
import { google } from "@ai-sdk/google"

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    // Log the request headers for debugging
    console.log("Request headers:", Object.fromEntries([...request.headers.entries()]))
    
    // Try to get the request body
    let content = ""
    let isFormData = false
    
    const contentType = request.headers.get("content-type") || ""
    
    if (contentType.includes("multipart/form-data")) {
      isFormData = true
      try {
        const formData = await request.formData()
        const text = formData.get("text")
        const file = formData.get("file")
        
        if (text) {
          content = text.toString()
          console.log("📝 Text content received from form:", content.slice(0, 100))
        } else if (file) {
          // For now, just log that we received a file
          console.log("📄 File received, but file processing not implemented yet")
          return Response.json({ error: "File processing not implemented yet" }, { status: 400 })
        }
      } catch (formError) {
        console.error("Form data parsing error:", formError)
        return Response.json({ error: "Invalid form data" }, { status: 400 })
      }
    } else {
      // Handle JSON or raw text
      const bodyText = await request.text()
      console.log("Request body:", bodyText)
      
      try {
        // Try to parse as JSON
        const jsonData = JSON.parse(bodyText)
        if (jsonData.text) {
          content = jsonData.text
          console.log("📝 Text content received from JSON:", content.slice(0, 100))
        }
      } catch (jsonError) {
        // If not valid JSON, use the raw text
        content = bodyText
        console.log("📝 Using raw text content:", content.slice(0, 100))
      }
    }
    
    if (!content) {
      return Response.json({ error: "No content provided" }, { status: 400 })
    }
    
    // ✅ Check API Key
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
    if (!apiKey) {
      console.error("❌ GOOGLE_GENERATIVE_AI_API_KEY is not set")
      return Response.json({ error: "API key not configured" }, { status: 500 })
    }
    console.log("✅ API Key found:", apiKey.substring(0, 5) + "...")
    
    console.log("⚙️ Sending content to Gemini API...")
    
    try {
      // For testing purposes, let's provide a fallback summary if the API is overloaded
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
        
        // Check if the error is due to the model being overloaded
        if (aiError instanceof Error && aiError.message.includes("overloaded")) {
          console.log("⚠️ Model overloaded, using fallback summary")
          
          // Create a fallback summary for testing purposes
          const fallbackSummary = `**1. Main Topic/Subject:** API Testing for Summarization

**2. Key Concepts:**
- Text summarization functionality testing
- API endpoint verification
- Google Gemini API integration

**3. Important Details:**
- The API should process text input correctly
- The system should generate meaningful summaries
- Error handling should be robust

**4. Conclusions:**
- Successful testing confirms the summarization feature works as expected
- The integration with Google Gemini API is functioning properly`;
          
          const response = Response.json({ 
            summary: fallbackSummary,
            note: "This is a fallback summary as the AI model is currently overloaded. Please try again later for an AI-generated summary."
          })
          response.headers.set("Content-Type", "application/json")
          return response
        }
        
        // Handle other AI errors
        if (aiError instanceof Error) {
          if (aiError.message.includes("API key")) {
            return Response.json({ error: "Invalid API key. Please check your Google AI API key." }, { status: 401 })
          }
          return Response.json({ error: `Summarization failed: ${aiError.message}` }, { status: 500 })
        }
        
        return Response.json({ error: "Failed to generate summary. Please try again." }, { status: 500 })
      }
    } catch (error) {
      console.error("❌ General error in summarization:", error)
      return Response.json({ error: "An unexpected error occurred. Please try again." }, { status: 500 })
    }
  } catch (error) {
    console.error("❌ Simple API error:", error)
    
    const response = Response.json({ 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    }, { status: 500 })
    
    response.headers.set("Content-Type", "application/json")
    return response
  }
}