import { prisma } from "@/lib/db"
import { ProjectsList } from "./ProjectsList"

export const metadata = {
  title: "Manage Projects — AI Showcase",
}

export default async function AdminProjectsPage() {
  let projects: any[] = []

  try {
    projects = await prisma.project.findMany({
      orderBy: { order: "asc" },
    })
  } catch (e) {
    // Database not available
  }

  return <ProjectsList projects={projects} />
}
