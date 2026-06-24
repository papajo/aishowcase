import { z } from "zod"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import { postSchema } from "@/lib/schemas"
import { checkAdminAuth } from "@/lib/admin"

export async function GET(req: Request) {
  const authError = checkAdminAuth(req)
  if (authError) return authError

  try {
    const posts = await prisma.dailyPost.findMany({
      orderBy: { publishedAt: "desc" },
    })
    return NextResponse.json({ success: true, posts })
  } catch {
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const authError = checkAdminAuth(req)
  if (authError) return authError

  try {
    const data = postSchema.parse(await req.json())
    const post = await prisma.dailyPost.create({
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content || "",
        tags: data.tags || [],
      },
    })
    return NextResponse.json({ success: true, post })
  } catch (error) {
    if (error instanceof z.ZodError) {
      const zErr = error as { issues: { message: string }[] }
      return NextResponse.json({ error: zErr.issues?.[0]?.message || "Invalid input" }, { status: 400 })
    }
    console.error("Create post error:", error)
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
  }
}
