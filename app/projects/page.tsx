import { prisma } from "@/lib/db"
import { getMarkdownProjects } from "@/lib/md-utils"
import { ProjectCard } from "@/components/projects/ProjectCard"
import { ScrollReveal, ScrollStagger, ScrollStaggerItem } from "@/components/shared/ScrollReveal"

export const metadata = {
  title: "Projects — AI Showcase",
  description: "AI projects I've built and contributed to.",
}

export default async function ProjectsPage() {
  let projects: any[] = []

  try {
    projects = await prisma.project.findMany({ orderBy: { order: "asc" } })
  } catch {
    // Database not available
  }

  // Merge markdown projects, dedupe by slug
  const mdProjects = getMarkdownProjects()
  const seenSlugs = new Set<string>(projects.map((p: any) => p.slug))
  for (const md of mdProjects) {
    if (!seenSlugs.has(md.slug)) {
      seenSlugs.add(md.slug)
      projects.push({
        id: `md-${md.slug}`,
        title: md.title,
        slug: md.slug,
        description: md.description,
        thumbnailUrl: md.thumbnailUrl,
        techStack: md.techStack,
        tags: md.tags,
        githubUrl: md.githubUrl,
        liveUrl: md.liveUrl,
        featured: md.featured,
      })
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <ScrollReveal>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Projects</h1>
        <p className="text-muted-foreground mb-8">AI projects I've built, from RAG pipelines to multi-agent systems.</p>
      </ScrollReveal>

      <ScrollStagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" staggerDelay={0.1}>
        {projects.map((project: any) => (
          <ScrollStaggerItem key={project.id}><ProjectCard project={project} /></ScrollStaggerItem>
        ))}
      </ScrollStagger>

      {projects.length === 0 && <p className="text-center text-muted-foreground py-12">No projects yet. Check back soon!</p>}
    </div>
  )
}
