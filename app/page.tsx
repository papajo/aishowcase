import { prisma } from "@/lib/db"
import { ToolCard } from "@/components/tools/ToolCard"
import { ProjectCard } from "@/components/projects/ProjectCard"
import { PostCard } from "@/components/journal/PostCard"
import { NewsletterSignup } from "@/components/shared/NewsletterSignup"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function HomePage() {
  let tools: any[] = []
  let projects: any[] = []
  let posts: any[] = []

  try {
    ;[tools, projects, posts] = await Promise.all([
      prisma.tool.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
      }),
      prisma.project.findMany({
        take: 3,
        orderBy: { order: "asc" },
      }),
      prisma.dailyPost.findMany({
        take: 5,
        orderBy: { publishedAt: "desc" },
      }),
    ])
  } catch (e) {
    // Database not available — render with empty data
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      {/* Hero Section */}
      <section className="mb-16">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Hi, I&apos;m <span className="text-primary">[Your Name]</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          AI developer building, testing, and sharing tools daily.
          This is my showcase of projects, tools, and learnings on the frontier of AI development.
        </p>
      </section>

      {/* Featured Projects */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Featured Projects</h2>
          <Link href="/projects">
            <Button variant="ghost" size="sm">
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {projects.map((project: any) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        {projects.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            No projects yet. Run the seed script to populate data.
          </p>
        )}
      </section>

      {/* AI Tools */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">AI Tools I Use</h2>
          <Link href="/tools">
            <Button variant="ghost" size="sm">
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool: any) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
        {tools.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            No tools yet. Run the seed script to populate data.
          </p>
        )}
      </section>

      {/* Recent Posts */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Latest from the Journal</h2>
          <Link href="/journal">
            <Button variant="ghost" size="sm">
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
        <div className="space-y-4">
          {posts.map((post: any) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
        {posts.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            No posts yet. Run the seed script to populate data.
          </p>
        )}
      </section>

      {/* Newsletter */}
      <NewsletterSignup />
    </div>
  )
}
