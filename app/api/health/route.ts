export async function GET() {
  try {
    // Check if API key exists
    const hasApiKey = !!process.env.GOOGLE_GENERATIVE_AI_API_KEY

    // Check environment
    const environment = process.env.NODE_ENV || "development"

    // Get current timestamp
    const timestamp = new Date().toISOString()

    return Response.json({
      status: "healthy",
      timestamp,
      environment,
      hasApiKey,
      version: "1.0.0",
      services: {
        database: "not_configured",
        ai: hasApiKey ? "configured" : "missing_key",
        cache: "not_configured",
      },
    })
  } catch (error) {
    return Response.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
