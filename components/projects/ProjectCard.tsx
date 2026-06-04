"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Code } from "lucide-react"
import { motion } from "framer-motion"

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
    <Link href={`/projects/${project.slug}`}>
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Card className="group h-full transition-colors hover:border-primary/50">
          <CardContent className="p-5">
            <div className="aspect-video rounded-lg bg-muted mb-4 flex items-center justify-center overflow-hidden">
              {project.thumbnailUrl ? (
                <img
                  src={project.thumbnailUrl}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl">🚀</span>
              )}
            </div>
            <h3 className="font-semibold group-hover:text-primary transition-colors mb-2">
              {project.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {project.techStack.slice(0, 4).map((tech) => (
                <Badge key={tech} variant="outline" className="text-xs">
                  {tech}
                </Badge>
              ))}
              {project.techStack.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{project.techStack.length - 4}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3">
              {project.githubUrl && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Code className="h-3.5 w-3.5" />
                  Code
                </span>
              )}
              {project.liveUrl && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <ExternalLink className="h-3.5 w-3.5" />
                  Live Demo
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  )
}
