import { prisma } from "@/lib/db"
import { ProjectCard } from "@/components/projects/ProjectCard"

export const metadata = {
  title: "Projects — AI Showcase",
  description: "AI projects I've built and contributed to.",
}

export default async function ProjectsPage() {
  let projects: any[] = []

  try {
    projects = await prisma.project.findMany({
      orderBy: { order: "asc" },
    })
  } catch (e) {
    // Database not available
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Projects</h1>
      <p className="text-muted-foreground mb-8">
        AI projects I&apos;ve built, from RAG pipelines to multi-agent systems.
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project: any) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {projects.length === 0 && (
        <p className="text-center text-muted-foreground py-12">
          No projects yet. Check back soon!
        </p>
      )}
    </div>
  )
}
