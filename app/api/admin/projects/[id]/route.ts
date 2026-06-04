import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import { z } from "zod"

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  liveUrl: z.string().optional(),
  githubUrl: z.string().optional(),
  techStack: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  order: z.number().optional(),
  content: z.string().optional(),
})

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const data = projectSchema.parse(body)

    const project = await prisma.project.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        liveUrl: data.liveUrl || null,
        githubUrl: data.githubUrl || null,
        techStack: data.techStack || [],
        tags: data.tags || [],
        featured: data.featured || false,
        order: data.order || 0,
        content: data.content || "",
      },
    })

    return NextResponse.json({ success: true, project })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      )
    }
    console.error("Update project error:", error)
    return NextResponse.json(
      { error: "Failed to update project" },
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

    await prisma.project.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete project error:", error)
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    )
  }
}
