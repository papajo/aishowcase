import { NextResponse } from "next/server"

export function checkAdminAuth(req: Request): NextResponse | null {
  const authHeader = req.headers.get("authorization")

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const base64Credentials = authHeader.split(" ")[1]
  const credentials = atob(base64Credentials)
  const [username, password] = credentials.split(":")

  const adminUser = process.env.ADMIN_USERNAME || "admin"
  const adminPass = process.env.ADMIN_PASSWORD || "password"

  if (username !== adminUser || password !== adminPass) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }

  return null // null means authorized
}
