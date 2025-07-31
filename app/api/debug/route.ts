export async function GET() {
  try {
    const debug = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      hasGoogleApiKey: !!process.env.GOOGLE_GENERATIVE_AI_API_KEY,
      apiKeyLength: process.env.GOOGLE_GENERATIVE_AI_API_KEY?.length || 0,
      vercelEnv: process.env.VERCEL_ENV,
      vercelUrl: process.env.VERCEL_URL,
      nodeVersion: process.version,
      platform: process.platform,
      headers: {
        host: process.env.VERCEL_URL || "localhost",
        userAgent: "StudyGenie-Debug",
      },
    }

    return Response.json(debug)
  } catch (error) {
    return Response.json(
      {
        error: "Debug endpoint failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
