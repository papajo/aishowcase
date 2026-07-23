import { z } from "zod"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import { projectSchema } from "@/lib/schemas"
import { checkAdminAuth } from "@/lib/admin"

export async function GET(req: Request) {
  const authError = checkAdminAuth(req)
  if (authError) return authError

  try {
    const projects = await prisma.project.findMany({ orderBy: { order: "asc" } })
    return NextResponse.json({ success: true, projects })
  } catch {
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const authError = checkAdminAuth(req)
  if (authError) return authError

  try {
    const data = projectSchema.parse(await req.json())
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
      return NextResponse.json({ error: error.issues[0]?.message || "Invalid input" }, { status: 400 })
    }
    console.error("Create project error:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}
