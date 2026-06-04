import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import { z } from "zod"
import { checkAdminAuth } from "@/lib/admin-auth"

const toolSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  websiteUrl: z.string().optional(),
  logoUrl: z.string().optional(),
  category: z.string().optional(),
  featured: z.boolean().optional(),
})

export async function GET(req: Request) {
  const authError = checkAdminAuth(req)
  if (authError) return authError

  try {
    const tools = await prisma.tool.findMany({
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json({ success: true, tools })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch tools" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  const authError = checkAdminAuth(req)
  if (authError) return authError

  try {
    const body = await req.json()
    const data = toolSchema.parse(body)

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
      return NextResponse.json(
        { error: error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      )
    }
    console.error("Create tool error:", error)
    return NextResponse.json(
      { error: "Failed to create tool" },
      { status: 500 }
    )
  }
}
