import { generateText } from "ai"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { google } from "@ai-sdk/google"

// Enhanced configuration with better error handling and rate limiting
const MAX_RETRIES = 4 // Increased from 3 to 4 attempts
const INITIAL_DELAY = 1500 // Increased from 1000ms to 1500ms
const MAX_BACKOFF_DELAY = 10000 // Maximum backoff delay of 10 seconds
const REQUEST_TIMEOUT = 30000 // 30 seconds

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Helper function to detect rate limit errors
const isRateLimitError = (error: any): boolean => {
  if (!error) return false;
  const errorMessage = error.message?.toLowerCase() || '';
  return errorMessage.includes('quota') || 
         errorMessage.includes('limit') || 
         errorMessage.includes('rate') ||
         errorMessage.includes('429');
}

// Initialize the Google Generative AI client as a fallback
const initGoogleAI = () => {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
  if (!apiKey) {
    throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is not set")
  }
  return new GoogleGenerativeAI(apiKey)
}

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json()

    // Validate input
    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return Response.json({ error: "Please provide a valid question" }, { status: 400 })
    }

    if (message.length > 2000) {
      return Response.json({ error: "Question is too long. Please keep it under 2000 characters." }, { status: 400 })
    }

    // Check if API key is available
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.error("GOOGLE_GENERATIVE_AI_API_KEY is not set")
      return Response.json(
        {
          error: "AI service is currently unavailable. Please check the API configuration.",
          response:
            "I'm sorry, but I'm currently unable to process your request due to a configuration issue. Please contact support or try again later.",
          notice: "API configuration error",
        },
        { status: 500 },
      )
    }

    // Create context from conversation history
    const conversationContext = (history || [])
      .slice(-5) // Keep last 5 messages for context
      .map((msg: any) => `${msg.role}: ${msg.content}`)
      .join("\n")

    const systemPrompt = `You are StudyGenie's AI assistant, a helpful and knowledgeable tutor designed to help students learn and understand academic concepts. You should:

1. Provide clear, detailed explanations for academic questions
2. Break down complex concepts into understandable parts
3. Use examples and analogies when helpful
4. Encourage learning and critical thinking
5. Be patient and supportive
6. Cover all academic subjects (math, science, history, literature, etc.)
7. Provide step-by-step solutions for problems when appropriate
8. Ask follow-up questions to ensure understanding

Keep your responses informative but concise (under 800 words), and always maintain an encouraging, educational tone.`

    let lastError: Error | null = null

    // Retry logic with exponential backoff
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        // Calculate exponential backoff delay (except for first attempt)
        if (attempt > 0) {
          const backoffDelay = INITIAL_DELAY * Math.pow(2, attempt - 1);
          const jitter = Math.random() * 200; // Add random jitter up to 200ms
          const delay = backoffDelay + jitter;
          console.log(`Retry attempt ${attempt+1}/${MAX_RETRIES} after ${delay.toFixed(0)}ms delay`);
          await wait(delay);
        }
        
        console.log(`Making request to Gemini API (attempt ${attempt + 1}/${MAX_RETRIES})...`)

        // Create a timeout promise
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error("Request timeout")), REQUEST_TIMEOUT)
        })

        let responseText = ""

        // First try with AI SDK
        if (attempt < 2) {
          try {
            console.log("Attempting with AI SDK...")
            // Race between API call and timeout
            const apiPromise = generateText({
              model: google("gemini-1.5-flash"),
              system: systemPrompt,
              prompt: `Previous conversation:\n${conversationContext}\n\nStudent question: ${message}`,
              maxTokens: 1000,
            })

            const { text } = (await Promise.race([apiPromise, timeoutPromise])) as any
            responseText = text
          } catch (sdkError) {
            console.error("AI SDK attempt failed, falling back to direct API:", sdkError)
            throw sdkError // Re-throw to trigger fallback or retry
          }
        } 
        // Fallback to direct Google Generative AI client
        else {
          console.log("Falling back to direct Google Generative AI client...")
          const genAI = initGoogleAI()
          const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

          const chatPrompt = [
            { role: "system", parts: [{ text: systemPrompt }] },
            { role: "user", parts: [{ text: `Previous conversation:\n${conversationContext}\n\nStudent question: ${message}` }] }
          ]

          const result = await Promise.race([
            model.generateContent({ contents: chatPrompt }),
            timeoutPromise
          ])

          // @ts-ignore - Type is complex but we know the structure
          responseText = result.response?.text() || ""
        }

        console.log("Gemini API response received successfully")
        return Response.json({
          response: responseText,
          timestamp: new Date().toISOString(),
          status: "success",
        })
      } catch (error) {
        lastError = error as Error
        console.error(`Attempt ${attempt + 1} failed:`, error)
        
        // Check if this is a rate limit error
        if (isRateLimitError(error)) {
          console.warn(`Rate limit detected on attempt ${attempt + 1}. Applying longer backoff...`);
          // If we hit a rate limit, use a longer backoff
          const rateLimitBackoff = MAX_BACKOFF_DELAY * 1.5;
          console.log(`Waiting ${rateLimitBackoff}ms before retry due to rate limiting...`);
          await wait(rateLimitBackoff);
        }

        // Check if this is the last attempt
        if (attempt === MAX_RETRIES - 1) {
          break
        }

        // Wait before retrying with improved backoff strategy
        const backoffDelay = Math.min(INITIAL_DELAY * Math.pow(2, attempt), MAX_BACKOFF_DELAY);
        const jitter = Math.random() * (backoffDelay * 0.1); // Add 0-10% random jitter
        const delay = backoffDelay + jitter;
        console.log(`Waiting ${delay.toFixed(0)}ms before retry attempt ${attempt + 2}/${MAX_RETRIES}...`)
        await wait(delay)
      }
    }

    // All retries failed, handle the error gracefully
    console.error("All retry attempts failed. Last error:", lastError)

    const errorMessage = lastError?.message?.toLowerCase() || ""

    // More comprehensive error handling
    if (errorMessage.includes("api key") || errorMessage.includes("authentication") || errorMessage.includes("auth")) {
      return Response.json(
        {
          response:
            "I'm having trouble with my authentication. The system administrator should check that the API key is properly configured.",
          notice: "Authentication error - please contact the administrator",
          error: "API authentication failed",
        },
        { status: 500 },
      )
    }

    if (isRateLimitError(lastError)) {
      // Enhanced logging for rate limit errors
      console.error("=== RATE LIMIT ERROR DETECTED ===");
      console.error(`Timestamp: ${new Date().toISOString()}`);
      console.error(`Error message: ${errorMessage}`);
      console.error(`API Key: ${process.env.GOOGLE_GENERATIVE_AI_API_KEY?.substring(0, 5)}...`);
      console.error(`Failed after ${MAX_RETRIES} retry attempts`);
      console.error("=== END RATE LIMIT ERROR LOG ===");
      
      // Implement a more informative response with guidance
      return Response.json(
        {
          response:
            "I'm currently experiencing high demand and have reached my usage limits. Please try again in 5-10 minutes. If this issue persists, please contact the administrator as the API quota may need to be increased or a different API key may need to be used.",
          notice: "Rate limit or quota exceeded - Please try again later",
          error: "API quota exceeded",
        },
        { status: 429 },
      )
    }

    if (errorMessage.includes("timeout") || errorMessage.includes("timed out")) {
      return Response.json(
        {
          response:
            "Your request took too long to process. This might be due to high server load or a complex question. Please try again with a simpler question or try later.",
          notice: "Request timeout - please try a simpler question",
          error: "Request timeout",
        },
        { status: 408 },
      )
    }

    if (errorMessage.includes("content") && (errorMessage.includes("filter") || errorMessage.includes("block") || errorMessage.includes("policy"))) {
      return Response.json(
        {
          response:
            "I'm unable to respond to this question due to content policy restrictions. Please rephrase your question or ask about a different topic.",
          notice: "Content policy restriction",
          error: "Content filtered",
        },
        { status: 400 },
      )
    }

    // Generic fallback
    return Response.json(
      {
        response:
          "I'm experiencing technical difficulties right now. Please try again in a few minutes. If the problem persists, please contact the system administrator.",
        notice: "Technical issue - please try again",
        error: lastError?.message || "Unknown error",
      },
      { status: 500 },
    )
  } catch (error) {
    console.error("Unexpected error in chat API:", error)
    
    // Attempt to provide more helpful error messages based on error type
    let errorMessage = "I'm experiencing technical difficulties. Please try again later."
    let errorNotice = "Unexpected error occurred"
    let statusCode = 500
    
    if (error instanceof SyntaxError) {
      errorMessage = "There was a problem processing your request due to invalid data format."
      errorNotice = "Invalid request format"
      statusCode = 400
    } else if (error instanceof TypeError) {
      errorMessage = "There was a problem with the types of data in your request."
      errorNotice = "Type error in request processing"
    } else if (error instanceof Error && error.message.includes("network")) {
      errorMessage = "There was a network issue connecting to the AI service. Please check your internet connection and try again."
      errorNotice = "Network connectivity issue"
    }

    return Response.json(
      {
        response: errorMessage,
        notice: errorNotice,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: statusCode },
    )
  }
}
