import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import { z } from "zod"

const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().optional(),
  tags: z.array(z.string()).optional(),
})

export async function POST(req: Request) {
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
