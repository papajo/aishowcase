import { z } from "zod"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import { toolSchema } from "@/lib/schemas"
import { checkAdminAuth } from "@/lib/admin"

export async function GET(req: Request) {
  const authError = checkAdminAuth(req)
  if (authError) return authError

  try {
    const tools = await prisma.tool.findMany({ orderBy: { createdAt: "desc" } })
    return NextResponse.json({ success: true, tools })
  } catch {
    return NextResponse.json({ error: "Failed to fetch tools" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const authError = checkAdminAuth(req)
  if (authError) return authError

  try {
    const data = toolSchema.parse(await req.json())
    const tool = await prisma.tool.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        category: data.category || "Uncategorized",
        websiteUrl: data.websiteUrl || null,
        logoUrl: data.logoUrl || null,
        featured: data.featured || false,
      },
    })
    return NextResponse.json({ success: true, tool })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message || "Invalid input" }, { status: 400 })
    }
    console.error("Create tool error:", error)
    return NextResponse.json({ error: "Failed to create tool" }, { status: 500 })
  }
}
