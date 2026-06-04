"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"

interface Post {
  id: string
  title: string
  excerpt: string
  publishedAt: string
}

export function JournalList({ posts }: { posts: Post[] }) {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Journal</h1>
          <p className="text-muted-foreground mt-1">
            Manage your journal entries.
          </p>
        </div>
        <Link href="/admin/journal/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Entry
          </Button>
        </Link>
      </div>

      {posts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No entries yet.</p>
            <Link href="/admin/journal/new">
              <Button>Write Your First Entry</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold truncate">{post.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {post.excerpt}
                  </p>
                  <div className="flex gap-2 mt-2 text-xs text-muted-foreground">
                    <span>
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/admin/journal/${post.id}`}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => {
                      if (confirm("Delete this entry?")) {
                        fetch(`/api/admin/journal/${post.id}`, {
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
