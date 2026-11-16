import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import { ProjectForm } from "../ProjectForm"

export const metadata = {
  title: "Edit Project — AI Showcase",
}

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  let project: Awaited<ReturnType<typeof prisma.project.findUnique>> = null

  try {
    project = await prisma.project.findUnique({
      where: { id },
    })
  } catch (e) {
    notFound()
  }

  if (!project) {
    notFound()
  }

  return (
    <ProjectForm
      project={{
        ...project,
        liveUrl: project.liveUrl ?? "",
        githubUrl: project.githubUrl ?? "",
      }}
    />
  )
}
