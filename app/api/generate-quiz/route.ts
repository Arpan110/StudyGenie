import { generateText } from "ai"
import { google } from "@ai-sdk/google"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const text = formData.get("text") as string

    // Check if API key is available with correct variable name
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.error("GOOGLE_GENERATIVE_AI_API_KEY is not set")
      const response = Response.json({ error: "API key not configured" }, { status: 500 })
      response.headers.set("Content-Type", "application/json")
      return response
    }

    let content = ""

    if (file) {
      // Sample content for demonstration
      content = `Sample educational content from ${file.name}: This content covers important academic concepts including fundamental principles, key theories, practical applications, and critical analysis methods. Students should understand the main ideas, be able to explain relationships between concepts, and apply knowledge to solve problems.`
    } else if (text) {
      content = text
    } else {
      const response = Response.json({ error: "No content provided" }, { status: 400 })
      response.headers.set("Content-Type", "application/json")
      return response
    }

    console.log("Making request to Gemini API for quiz generation...")

    const { text: quizData } = await generateText({
      model: google("gemini-1.5-flash"),
      system: `You are an expert quiz generator. Create multiple-choice questions based on the provided content. Return your response as a valid JSON array with this exact format:

[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct": 0
  }
]

Generate 3-5 questions that test understanding of key concepts. Make sure questions are clear, options are plausible, and the correct answer index is accurate (0-based). Return ONLY the JSON array, no additional text.`,
      prompt: `Create quiz questions based on this content:\n\n${content}`,
      maxTokens: 1000,
    })

    console.log("Quiz generation completed, parsing response...")

    try {
      // Clean the response to ensure it's valid JSON
      let cleanedResponse = quizData.trim()
      if (cleanedResponse.startsWith("```json")) {
        cleanedResponse = cleanedResponse.replace(/```json\n?/, "").replace(/\n?```$/, "")
      }
      if (cleanedResponse.startsWith("```")) {
        cleanedResponse = cleanedResponse.replace(/```\n?/, "").replace(/\n?```$/, "")
      }

      const questions = JSON.parse(cleanedResponse)

      // Validate the structure
      if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error("Invalid quiz format")
      }

      const response = Response.json({ questions })
      response.headers.set("Content-Type", "application/json")
      return response
    } catch (parseError) {
      console.error("JSON parsing failed:", parseError)
      console.log("Raw response:", quizData)

      // Fallback questions
      const fallbackQuestions = [
        {
          question: "What is the main concept discussed in the provided content?",
          options: ["Fundamental principles", "Advanced theories", "Practical applications", "Historical context"],
          correct: 0,
        },
        {
          question: "Which approach is most effective for understanding this material?",
          options: ["Memorization only", "Critical analysis and application", "Passive reading", "Quick review"],
          correct: 1,
        },
        {
          question: "What should students focus on when studying this content?",
          options: ["Minor details", "Key concepts and relationships", "Dates and names only", "Personal opinions"],
          correct: 1,
        },
      ]
      const response = Response.json({ questions: fallbackQuestions })
      response.headers.set("Content-Type", "application/json")
      return response
    }
  } catch (error) {
    console.error("Quiz generation API error:", error)

    if (error instanceof Error) {
      console.error("Error message:", error.message)

      if (error.message.includes("API key")) {
        const response = Response.json({ error: "Invalid API key. Please check your Google AI API key." }, { status: 401 })
        response.headers.set("Content-Type", "application/json")
        return response
      }

      const response = Response.json({ error: `Quiz generation failed: ${error.message}` }, { status: 500 })
      response.headers.set("Content-Type", "application/json")
      return response
    }

    const response = Response.json({ error: "Failed to generate quiz. Please try again." }, { status: 500 })
    response.headers.set("Content-Type", "application/json")
    return response
  }
}
