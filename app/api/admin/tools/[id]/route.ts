import { z } from "zod"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import { toolSchema } from "@/lib/schemas"
import { checkAdminAuth } from "@/lib/admin"

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkAdminAuth(req)
  if (authError) return authError

  try {
    const { id } = await params
    const data = toolSchema.parse(await req.json())
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
      const zErr = error as { issues: { message: string }[] }
      return NextResponse.json({ error: zErr.issues?.[0]?.message || "Invalid input" }, { status: 400 })
    }
    console.error("Update tool error:", error)
    return NextResponse.json({ error: "Failed to update tool" }, { status: 500 })
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
    await prisma.tool.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete tool error:", error)
    return NextResponse.json({ error: "Failed to delete tool" }, { status: 500 })
  }
}
