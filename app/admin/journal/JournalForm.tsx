"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Save, ArrowLeft, Plus, X } from "lucide-react"
import Link from "next/link"
import { adminFetch } from "@/lib/admin-client"

interface JournalFormProps {
  post?: {
    id: string
    title: string
    slug: string
    excerpt: string
    content: string
    tags: string[]
  }
}

export function JournalForm({ post }: JournalFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [tagInput, setTagInput] = useState("")
  const [form, setForm] = useState({
    title: post?.title || "",
    slug: post?.slug || "",
    excerpt: post?.excerpt || "",
    content: post?.content || "",
    tags: post?.tags || [],
  })

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  function addTag() {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm((f) => ({
        ...f,
        tags: [...f.tags, tagInput.trim()],
      }))
      setTagInput("")
    }
  }

  function removeTag(tag: string) {
    setForm((f) => ({
      ...f,
      tags: f.tags.filter((t) => t !== tag),
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const url = post
        ? `/api/admin/journal/${post.id}`
        : "/api/admin/journal"
      const method = post ? "PUT" : "POST"

      const res = await adminFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (res.ok) {
        toast.success(post ? "Entry updated!" : "Entry created!")
        router.push("/admin/journal")
        router.refresh()
      } else {
        toast.error("Error", { description: data.error })
      }
    } catch {
      toast.error("Error", { description: "Something went wrong" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/journal"
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">
            {post ? "Edit Entry" : "New Entry"}
          </h1>
        </div>
        <Button type="submit" disabled={loading}>
          <Save className="h-4 w-4 mr-2" />
          {loading ? "Saving..." : "Save"}
        </Button>
      </div>

      <div className="grid gap-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Basic Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Title</label>
              <Input
                value={form.title}
                onChange={(e) => {
                  const title = e.target.value
                  setForm((f) => ({
                    ...f,
                    title,
                    slug: post ? f.slug : generateSlug(title),
                  }))
                }}
                placeholder="e.g., Day 42: Building a RAG Pipeline"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Slug</label>
              <Input
                value={form.slug}
                onChange={(e) =>
                  setForm((f) => ({ ...f, slug: e.target.value }))
                }
                placeholder="e.g., day-42-building-a-rag-pipeline"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Excerpt</label>
              <textarea
                value={form.excerpt}
                onChange={(e) =>
                  setForm((f) => ({ ...f, excerpt: e.target.value }))
                }
                placeholder="Brief excerpt of the entry..."
                className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add tag..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addTag()
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={addTag}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content (MDX)</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              value={form.content}
              onChange={(e) =>
                setForm((f) => ({ ...f, content: e.target.value }))
              }
              placeholder="Write your journal entry in MDX..."
              className="w-full min-h-[400px] rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
            />
          </CardContent>
        </Card>
      </div>
    </form>
  )
}
