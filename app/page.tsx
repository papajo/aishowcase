import { prisma } from "@/lib/db"
import { ToolCard } from "@/components/tools/ToolCard"
import { ProjectCard } from "@/components/projects/ProjectCard"
import { PostCard } from "@/components/journal/PostCard"
import { NewsletterSignup } from "@/components/shared/NewsletterSignup"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SlideUp, Stagger, StaggerItem } from "@/components/shared/Motion"
import { ScrollReveal, ScrollStagger, ScrollStaggerItem } from "@/components/shared/ScrollReveal"

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
        <SlideUp>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Hi, I&apos;m <span className="text-primary">[Your Name]</span>
          </h1>
        </SlideUp>
        <SlideUp delay={0.1}>
          <p className="text-lg text-muted-foreground max-w-2xl">
            AI developer building, testing, and sharing tools daily.
            This is my showcase of projects, tools, and learnings on the frontier of AI development.
          </p>
        </SlideUp>
      </section>

      {/* Featured Projects */}
      <section className="mb-16">
        <ScrollReveal>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Featured Projects</h2>
            <Link href="/projects">
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </ScrollReveal>
        <ScrollStagger className="grid gap-6 md:grid-cols-3" staggerDelay={0.15}>
          {projects.map((project: any) => (
            <ScrollStaggerItem key={project.id}>
              <ProjectCard project={project} />
            </ScrollStaggerItem>
          ))}
        </ScrollStagger>
        {projects.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            No projects yet. Run the seed script to populate data.
          </p>
        )}
      </section>

      {/* AI Tools */}
      <section className="mb-16">
        <ScrollReveal>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">AI Tools I Use</h2>
            <Link href="/tools">
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </ScrollReveal>
        <ScrollStagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" staggerDelay={0.1}>
          {tools.map((tool: any) => (
            <ScrollStaggerItem key={tool.id}>
              <ToolCard tool={tool} />
            </ScrollStaggerItem>
          ))}
        </ScrollStagger>
        {tools.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            No tools yet. Run the seed script to populate data.
          </p>
        )}
      </section>

      {/* Recent Posts */}
      <section className="mb-16">
        <ScrollReveal>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Latest from the Journal</h2>
            <Link href="/journal">
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </ScrollReveal>
        <ScrollStagger className="space-y-4" staggerDelay={0.1}>
          {posts.map((post: any) => (
            <ScrollStaggerItem key={post.id}>
              <PostCard post={post} />
            </ScrollStaggerItem>
          ))}
        </ScrollStagger>
        {posts.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            No posts yet. Run the seed script to populate data.
          </p>
        )}
      </section>

      {/* Newsletter */}
      <ScrollReveal>
        <NewsletterSignup />
      </ScrollReveal>
    </div>
  )
}
