import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Only protect admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Check for basic auth
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Basic ")) {
      return new NextResponse("Authentication required", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Admin Area"',
        },
      })
    }

    // Decode credentials
    const base64Credentials = authHeader.split(" ")[1]
    const credentials = atob(base64Credentials)
    const [username, password] = credentials.split(":")

    // Check against env vars
    const adminUser = process.env.ADMIN_USERNAME || "admin"
    const adminPass = process.env.ADMIN_PASSWORD || "password"

    if (username !== adminUser || password !== adminPass) {
      return new NextResponse("Invalid credentials", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Admin Area"',
        },
      })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: "/admin/:path*",
}
