"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react"
import Link from "next/link"

interface Project {
  id: string
  title: string
  description: string
  techStack: string[]
  liveUrl: string | null
  featured: boolean
}

export function ProjectsList({ projects }: { projects: Project[] }) {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-1">
            Manage your AI projects.
          </p>
        </div>
        <Link href="/admin/projects/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No projects yet.</p>
            <Link href="/admin/projects/new">
              <Button>Add Your First Project</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <Card key={project.id}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold truncate">{project.title}</h3>
                    {project.featured && (
                      <Badge variant="secondary" className="text-xs">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {project.description}
                  </p>
                  <div className="flex gap-2 mt-2">
                    {project.techStack &&
                      project.techStack.slice(0, 3).map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                  <Link
                    href={`/admin/projects/${project.id}`}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => {
                      if (confirm("Delete this project?")) {
                        fetch(`/api/admin/projects/${project.id}`, {
                          method: "DELETE",
                        }).then(() => location.reload())
                      }
                    }}
                    className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
