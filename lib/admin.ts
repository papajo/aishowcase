import { NextResponse } from "next/server"

/** Check Basic auth on server-side API routes. Returns error response or null if authorized. */
export function checkAdminAuth(req: Request): NextResponse | null {
  const authHeader = req.headers.get("authorization")

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const credentials = atob(authHeader.split(" ")[1])
  const [username, password] = credentials.split(":")

  const adminUser = process.env.ADMIN_USERNAME || "admin"
  const adminPass = process.env.ADMIN_PASSWORD || "password"

  if (username !== adminUser || password !== adminPass) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }

  return null
}

/** Client-side helper: get auth headers from sessionStorage */
export function getAuthHeaders(): Record<string, string> {
  const auth = sessionStorage.getItem("admin_auth")
  return auth ? { Authorization: `Basic ${auth}` } : {}
}

/** Client-side fetch wrapper that auto-includes admin auth headers */
export async function adminFetch(url: string, options: RequestInit = {}): Promise<Response> {
  return fetch(url, { ...options, headers: { ...options.headers, ...getAuthHeaders() } })
}
