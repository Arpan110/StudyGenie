import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Add CORS headers for API routes
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const response = NextResponse.next()

    // Set CORS headers
    response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
    
    // Ensure content-type is set for API responses
    if (!response.headers.has("Content-Type")) {
      response.headers.set("Content-Type", "application/json")
    }

    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: "/api/:path*",
}
