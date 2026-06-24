"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react"
import Link from "next/link"
import { adminFetch } from "@/lib/admin"

interface Tool {
  id: string
  name: string
  description: string
  category: string
  logoUrl: string | null
  websiteUrl: string | null
  featured: boolean
}

export function ToolsList({ tools }: { tools: Tool[] }) {
  function handleDelete(id: string) {
    if (confirm("Delete this tool?")) {
      adminFetch(`/api/admin/tools/${id}`, { method: "DELETE" }).then(() =>
        location.reload()
      )
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tools</h1>
          <p className="text-muted-foreground mt-1">
            Manage your AI tools directory.
          </p>
        </div>
        <Link href="/admin/tools/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Tool
          </Button>
        </Link>
      </div>

      {tools.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No tools yet.</p>
            <Link href="/admin/tools/new">
              <Button>Add Your First Tool</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {tools.map((tool) => (
            <Card key={tool.id}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center text-xl shrink-0">
                  {tool.logoUrl ? (
                    <img
                      src={tool.logoUrl}
                      alt={tool.name}
                      className="h-8 w-8 object-contain"
                    />
                  ) : (
                    "🔧"
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold truncate">{tool.name}</h3>
                    {tool.featured && (
                      <Badge variant="secondary" className="text-xs">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {tool.description}
                  </p>
                  <div className="flex gap-2 mt-2">
                    {tool.category && (
                      <Badge variant="outline" className="text-xs">
                        {tool.category}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {tool.websiteUrl && (
                    <a
                      href={tool.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                  <Link
                    href={`/admin/tools/${tool.id}`}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(tool.id)}
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
