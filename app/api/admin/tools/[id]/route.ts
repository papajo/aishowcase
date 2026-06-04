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

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkAdminAuth(req)
  if (authError) return authError

  try {
    const { id } = await params
    const body = await req.json()
    const data = toolSchema.parse(body)

    const tool = await prisma.tool.update({
      where: { id },
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
    console.error("Update tool error:", error)
    return NextResponse.json(
      { error: "Failed to update tool" },
      { status: 500 }
    )
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

    await prisma.tool.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete tool error:", error)
    return NextResponse.json(
      { error: "Failed to delete tool" },
      { status: 500 }
    )
  }
}
