import { generateText } from "ai"
import { google } from "@ai-sdk/google"

export async function GET() {
  try {
    console.log("Testing Google AI API connection...")
    console.log("Environment:", process.env.NODE_ENV)
    console.log("Has API Key:", !!process.env.GOOGLE_GENERATIVE_AI_API_KEY)

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return Response.json(
        {
          error: "GOOGLE_GENERATIVE_AI_API_KEY environment variable is not set",
          status: "failed",
          environment: process.env.NODE_ENV,
          vercelEnv: process.env.VERCEL_ENV,
        },
        { status: 500 },
      )
    }

    // Test with a simple prompt
    const { text } = await generateText({
      model: google("gemini-1.5-flash"),
      prompt: "Say 'Hello from StudyGenie API!' and confirm the connection is working.",
      maxTokens: 50,
    })

    return Response.json({
      message: text,
      status: "success",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV,
      apiKeyStatus: "✅ Set and working",
    })
  } catch (error) {
    console.error("API Test Error:", error)

    const errorMessage = error instanceof Error ? error.message : "Unknown error"

    return Response.json(
      {
        error: errorMessage,
        status: "failed",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        vercelEnv: process.env.VERCEL_ENV,
        apiKeyStatus: process.env.GOOGLE_GENERATIVE_AI_API_KEY ? "✅ Set but not working" : "❌ Missing",
        troubleshooting: {
          checkApiKey: "Verify your Google AI API key is valid",
          checkQuota: "Check if you have API quota remaining",
          checkBilling: "Ensure billing is enabled in Google Cloud Console",
        },
      },
      { status: 500 },
    )
  }
}
