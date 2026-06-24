import { prisma } from "@/lib/db"
import { getMarkdownPosts, getMarkdownTools, getMarkdownProjects } from "@/lib/md-utils"
import { ToolCard } from "@/components/tools/ToolCard"
import { ProjectCard } from "@/components/projects/ProjectCard"
import { PostCard } from "@/components/journal/PostCard"
import { NewsletterSignup } from "@/components/shared/NewsletterSignup"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ScrollReveal, ScrollStagger, ScrollStaggerItem } from "@/components/shared/ScrollReveal"

export default async function HomePage() {
  let tools: any[] = []
  let projects: any[] = []
  let posts: any[] = []

  try {
    ;[tools, projects, posts] = await Promise.all([
      prisma.tool.findMany({ take: 6, orderBy: { createdAt: "desc" } }),
      prisma.project.findMany({ take: 3, orderBy: { order: "asc" } }),
      prisma.dailyPost.findMany({ take: 5, orderBy: { publishedAt: "desc" } }),
    ])
  } catch {
    // Database not available — render with empty data
  }

  // Merge markdown content with DB content, dedupe by slug
  const mdPosts = getMarkdownPosts()
  const mdTools = getMarkdownTools()
  const mdProjects = getMarkdownProjects()

  const seenPostSlugs = new Set<string>(posts.map((p: any) => p.slug))
  for (const md of mdPosts) {
    if (!seenPostSlugs.has(md.slug)) {
      seenPostSlugs.add(md.slug)
      posts.push({ id: `md-${md.slug}`, ...md, date: md.date, publishedAt: md.date })
    }
  }
  posts.sort((a: any, b: any) => new Date(b.publishedAt || b.date || 0).getTime() - new Date(a.publishedAt || a.date || 0).getTime())
  posts = posts.slice(0, 5)

  const seenToolSlugs = new Set<string>(tools.map((t: any) => t.slug))
  for (const md of mdTools) {
    if (!seenToolSlugs.has(md.slug)) {
      seenToolSlugs.add(md.slug)
      tools.push({ id: `md-${md.slug}`, name: md.name, slug: md.slug, description: md.description, category: md.category, logoUrl: md.logoUrl, rating: md.rating, reviewCount: md.reviewCount, featured: md.featured })
    }
  }
  tools = tools.slice(0, 6)

  const seenProjectSlugs = new Set<string>(projects.map((p: any) => p.slug))
  for (const md of mdProjects) {
    if (!seenProjectSlugs.has(md.slug)) {
      seenProjectSlugs.add(md.slug)
      projects.push({ id: `md-${md.slug}`, title: md.title, slug: md.slug, description: md.description, thumbnailUrl: md.thumbnailUrl, techStack: md.techStack, tags: md.tags, githubUrl: md.githubUrl, liveUrl: md.liveUrl, featured: md.featured })
    }
  }
  projects = projects.slice(0, 3)

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      {/* Hero */}
      <section className="mb-16">
        <ScrollReveal>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Hi, I'm <span className="text-primary">PJ</span>
          </h1>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <p className="text-lg text-muted-foreground max-w-2xl">
            AI developer building, testing, and sharing tools daily.
            This is my showcase of projects, tools, and learnings on the frontier of AI development.
          </p>
        </ScrollReveal>
      </section>

      {/* Featured Projects */}
      <section className="mb-16">
        <ScrollReveal>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Featured Projects</h2>
            <Link href="/projects">
              <Button variant="ghost" size="sm">View All <ArrowRight className="h-4 w-4 ml-1" /></Button>
            </Link>
          </div>
        </ScrollReveal>
        <ScrollStagger className="grid gap-6 md:grid-cols-3" staggerDelay={0.15}>
          {projects.map((project: any) => (
            <ScrollStaggerItem key={project.id}><ProjectCard project={project} /></ScrollStaggerItem>
          ))}
        </ScrollStagger>
        {projects.length === 0 && <p className="text-center text-muted-foreground py-8">No projects yet. Run the seed script to populate data.</p>}
      </section>

      {/* AI Tools */}
      <section className="mb-16">
        <ScrollReveal>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">AI Tools I Use</h2>
            <Link href="/tools">
              <Button variant="ghost" size="sm">View All <ArrowRight className="h-4 w-4 ml-1" /></Button>
            </Link>
          </div>
        </ScrollReveal>
        <ScrollStagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" staggerDelay={0.1}>
          {tools.map((tool: any) => (
            <ScrollStaggerItem key={tool.id}><ToolCard tool={tool} /></ScrollStaggerItem>
          ))}
        </ScrollStagger>
        {tools.length === 0 && <p className="text-center text-muted-foreground py-8">No tools yet. Run the seed script to populate data.</p>}
      </section>

      {/* Recent Posts */}
      <section className="mb-16">
        <ScrollReveal>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Latest from the Journal</h2>
            <Link href="/journal">
              <Button variant="ghost" size="sm">View All <ArrowRight className="h-4 w-4 ml-1" /></Button>
            </Link>
          </div>
        </ScrollReveal>
        <ScrollStagger className="space-y-4" staggerDelay={0.1}>
          {posts.map((post: any) => (
            <ScrollStaggerItem key={post.id}><PostCard post={post} /></ScrollStaggerItem>
          ))}
        </ScrollStagger>
        {posts.length === 0 && <p className="text-center text-muted-foreground py-8">No posts yet. Run the seed script to populate data.</p>}
      </section>

      {/* Newsletter */}
      <ScrollReveal><NewsletterSignup /></ScrollReveal>
    </div>
  )
}
