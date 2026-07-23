import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Code } from "lucide-react"

interface ProjectCardProps {
  project: {
    id: string
    title: string
    slug: string
    description: string
    thumbnailUrl: string | null
    techStack: string[]
    tags: string[]
    githubUrl: string | null
    liveUrl: string | null
  }
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.slug}`} className="block group">
      <Card className="h-full transition-all duration-200 hover:-translate-y-1 hover:border-[oklch(0.55_0.14_30)/50] dark:hover:border-[oklch(0.68_0.12_30)/50]">
        <CardContent className="p-5">
          <div className="aspect-video rounded-lg bg-[oklch(0.94_0.01_50)] dark:bg-[oklch(0.18_0.02_40)] mb-4 flex items-center justify-center overflow-hidden">
            {project.thumbnailUrl ? (
              <img src={project.thumbnailUrl} alt={project.title} className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl font-heading font-bold text-[oklch(0.5_0.03_40)] dark:text-[oklch(0.65_0.03_45)]">A</span>
            )}
          </div>
          <h3 className="font-heading font-semibold text-[oklch(0.15_0.02_40)] dark:text-[oklch(0.92_0.02_60)] group-hover:text-[oklch(0.55_0.14_30)] dark:group-hover:text-[oklch(0.68_0.12_30)] transition-colors mb-2">{project.title}</h3>
          <p className="text-sm text-[oklch(0.5_0.03_40)] dark:text-[oklch(0.65_0.03_45)] line-clamp-2 mb-3">{project.description}</p>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {project.techStack.slice(0, 4).map((tech) => (
              <Badge key={tech} variant="outline" className="text-xs">{tech}</Badge>
            ))}
            {project.techStack.length > 4 && <Badge variant="outline" className="text-xs">+{project.techStack.length - 4}</Badge>}
          </div>
          <div className="flex items-center gap-3">
            {project.githubUrl && <span className="flex items-center gap-1 text-xs text-[oklch(0.5_0.03_40)] dark:text-[oklch(0.65_0.03_45)]"><Code className="h-3.5 w-3.5" />Code</span>}
            {project.liveUrl && <span className="flex items-center gap-1 text-xs text-[oklch(0.5_0.03_40)] dark:text-[oklch(0.65_0.03_45)]"><ExternalLink className="h-3.5 w-3.5" />Live Demo</span>}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
