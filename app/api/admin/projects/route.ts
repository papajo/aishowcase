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

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = projectSchema.parse(body)

    const project = await prisma.project.create({
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
    console.error("Create project error:", error)
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    )
  }
}
