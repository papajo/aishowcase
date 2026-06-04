import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Code } from "lucide-react"
import { MDXContent } from "@/components/shared/MDXContent"
import { ProjectCard } from "@/components/projects/ProjectCard"
import type { Metadata } from "next"

interface ProjectPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params

  try {
    const project = await prisma.project.findUnique({
      where: { slug },
    })

    if (!project) return { title: "Project Not Found" }

    return {
      title: `${project.title} — AI Showcase`,
      description: project.description,
    }
  } catch {
    return { title: "Project Not Found" }
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params

  let project: any = null
  let relatedProjects: any[] = []

  try {
    project = await prisma.project.findUnique({
      where: { slug },
    })

    if (!project) notFound()

    relatedProjects = await prisma.project.findMany({
      where: { id: { not: project.id } },
      take: 3,
      orderBy: { order: "asc" },
    })
  } catch (e) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      {/* Hero */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          {project.title}
        </h1>
        <p className="text-lg text-muted-foreground mb-4">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {project.techStack.map((tech: string) => (
            <Badge key={tech} variant="secondary">
              {tech}
            </Badge>
          ))}
        </div>

        <div className="flex gap-3">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
            >
              <Code className="h-4 w-4" />
              View Code
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              Live Demo
            </a>
          )}
        </div>
      </div>

      {/* Content */}
      <article className="prose prose-invert max-w-none mb-12">
        <MDXContent content={project.content} />
      </article>

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6">Other Projects</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {relatedProjects.map((p: any) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
