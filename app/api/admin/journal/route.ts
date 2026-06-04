import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import { z } from "zod"
import { checkAdminAuth } from "@/lib/admin-auth"

const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().optional(),
  tags: z.array(z.string()).optional(),
})

export async function GET(req: Request) {
  const authError = checkAdminAuth(req)
  if (authError) return authError

  try {
    const posts = await prisma.dailyPost.findMany({
      orderBy: { publishedAt: "desc" },
    })
    return NextResponse.json({ success: true, posts })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  const authError = checkAdminAuth(req)
  if (authError) return authError

  try {
    const body = await req.json()
    const data = postSchema.parse(body)

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
      return NextResponse.json(
        { error: error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      )
    }
    console.error("Create post error:", error)
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    )
  }
}
