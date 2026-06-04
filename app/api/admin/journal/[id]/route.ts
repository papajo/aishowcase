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

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const data = postSchema.parse(body)

    const post = await prisma.dailyPost.update({
      where: { id },
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
    console.error("Update post error:", error)
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.dailyPost.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete post error:", error)
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    )
  }
}
