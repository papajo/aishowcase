"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Save, ArrowLeft, Plus, X } from "lucide-react"
import Link from "next/link"
import { adminFetch } from "@/lib/admin"
import { generateSlug } from "@/lib/utils"

interface ProjectFormProps {
  project?: {
    id: string
    title: string
    slug: string
    description: string
    liveUrl: string
    githubUrl: string
    techStack: string[]
    tags: string[]
    featured: boolean
    order: number
    content: string
  }
}

function TagInput({ label, items, onAdd, onRemove }: {
  label: string
  items: string[]
  onAdd: (v: string) => void
  onRemove: (v: string) => void
}) {
  const [input, setInput] = useState("")
  function add() {
    const v = input.trim()
    if (v && !items.includes(v)) { onAdd(v); setInput("") }
  }
  return (
    <div className="space-y-4">
      <label className="text-sm font-medium mb-2 block">{label}</label>
      <div className="flex gap-2">
        <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder={`Add ${label.toLowerCase()}...`}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add() } }} />
        <Button type="button" variant="outline" onClick={add}><Plus className="h-4 w-4" /></Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-sm">
            {item}
            <button type="button" onClick={() => onRemove(item)} className="hover:text-destructive"><X className="h-3 w-3" /></button>
          </span>
        ))}
      </div>
    </div>
  )
}

export function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: project?.title || "",
    slug: project?.slug || "",
    description: project?.description || "",
    liveUrl: project?.liveUrl || "",
    githubUrl: project?.githubUrl || "",
    techStack: project?.techStack || [],
    tags: project?.tags || [],
    featured: project?.featured || false,
    order: project?.order || 0,
    content: project?.content || "",
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const url = project ? `/api/admin/projects/${project.id}` : "/api/admin/projects"
      const method = project ? "PUT" : "POST"
      const res = await adminFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      const data = await res.json()
      if (res.ok) {
        toast.success(project ? "Project updated!" : "Project created!")
        router.push("/admin/projects")
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
          <Link href="/admin/projects" className="p-2 hover:bg-muted rounded-lg transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">{project ? "Edit Project" : "Add Project"}</h1>
        </div>
        <Button type="submit" disabled={loading}>
          <Save className="h-4 w-4 mr-2" />
          {loading ? "Saving..." : "Save"}
        </Button>
      </div>

      <div className="grid gap-6 max-w-2xl">
        <Card>
          <CardHeader><CardTitle>Basic Info</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Title</label>
              <Input value={form.title} onChange={(e) => {
                const title = e.target.value
                setForm((f) => ({ ...f, title, slug: project ? f.slug : generateSlug(title) }))
              }} placeholder="e.g., RAG Pipeline" required />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Slug</label>
              <Input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} placeholder="e.g., rag-pipeline" required />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Brief description of the project..." className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm" required />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Links</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Live URL</label>
              <Input type="url" value={form.liveUrl} onChange={(e) => setForm((f) => ({ ...f, liveUrl: e.target.value }))} placeholder="https://..." />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">GitHub URL</label>
              <Input type="url" value={form.githubUrl} onChange={(e) => setForm((f) => ({ ...f, githubUrl: e.target.value }))} placeholder="https://github.com/..." />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Tech Stack & Tags</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <TagInput label="Tech Stack" items={form.techStack}
              onAdd={(v) => setForm((f) => ({ ...f, techStack: [...f.techStack, v] }))}
              onRemove={(v) => setForm((f) => ({ ...f, techStack: f.techStack.filter((t) => t !== v) }))} />
            <TagInput label="Tags" items={form.tags}
              onAdd={(v) => setForm((f) => ({ ...f, tags: [...f.tags, v] }))}
              onRemove={(v) => setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== v) }))} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Order</label>
                <Input type="number" value={form.order} onChange={(e) => setForm((f) => ({ ...f, order: parseInt(e.target.value) || 0 }))} />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))} className="h-4 w-4 rounded border-gray-300" />
                <label htmlFor="featured" className="text-sm font-medium">Featured</label>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">MDX Content</label>
              <textarea value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                placeholder="Write your project content in MDX..." className="w-full min-h-[200px] rounded-md border border-input bg-background px-3 py-2 text-sm font-mono" />
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  )
}
