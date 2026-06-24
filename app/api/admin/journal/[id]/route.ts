import { z } from "zod"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import { postSchema } from "@/lib/schemas"
import { checkAdminAuth } from "@/lib/admin"

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkAdminAuth(req)
  if (authError) return authError

  try {
    const { id } = await params
    const data = postSchema.parse(await req.json())
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
      const zErr = error as { issues: { message: string }[] }
      return NextResponse.json({ error: zErr.issues?.[0]?.message || "Invalid input" }, { status: 400 })
    }
    console.error("Update post error:", error)
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkAdminAuth(req)
  if (authError) return authError

  try {
    const { id } = await params
    await prisma.dailyPost.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete post error:", error)
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 })
  }
}
