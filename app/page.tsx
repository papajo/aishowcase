import { prisma } from "@/lib/db"
import { getMarkdownPosts, getMarkdownTools, getMarkdownProjects } from "@/lib/md-utils"
import { ArrowRight, Star, ExternalLink, Code, Calendar } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ScrollReveal, ScrollStagger, ScrollStaggerItem } from "@/components/shared/ScrollReveal"
import { NewsletterSignup } from "@/components/shared/NewsletterSignup"
import {
  ElectricGridIllustration,
  DatabasePerformanceIllustration,
  GearsIllustration,
  DatabaseLockIllustration,
  FactoryDatabaseIllustration,
  TimeDelayIllustration,
  RowVsColumnarIllustration,
  LaptopClockIllustration,
  PlantFloorIllustration,
  ApexAnalyticsIllustration,
} from "@/components/shared/TechnicalIllustrations"

export default async function HomePage() {
  let tools: any[] = []
  let projects: any[] = []
  let posts: any[] = []

  try {
    ;[tools, projects, posts] = await Promise.all([
      prisma.tool.findMany({ take: 6, orderBy: { createdAt: "desc" } }),
      prisma.project.findMany({ take: 3, orderBy: { order: "asc" } }),
      prisma.dailyPost.findMany({ take: 6, orderBy: { publishedAt: "desc" } }),
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
  // We need 6 posts: 1 for hero featured, 5 for side list
  posts = posts.slice(0, 6)

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

  // Star Rating Helper
  function StarRating({ rating }: { rating: number }) {
    const fullStars = Math.floor(rating)
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-3.5 w-3.5 ${
              i < fullStars ? "fill-amber-400 text-amber-400" : "text-zinc-300 dark:text-zinc-700"
            }`}
          />
        ))}
      </div>
    )
  }

  // Define maps for illustrations
  const projectIllustrations = [
    <DatabasePerformanceIllustration className="w-full aspect-[2/1] object-cover mb-4" />,
    <GearsIllustration className="w-full aspect-[2/1] object-cover mb-4" />,
    <DatabaseLockIllustration className="w-full aspect-[2/1] object-cover mb-4" />,
  ]

  const toolIllustrations = [
    <FactoryDatabaseIllustration className="w-full aspect-[2/1] object-cover mb-4" />,
    <TimeDelayIllustration className="w-full aspect-[2/1] object-cover mb-4" />,
    <RowVsColumnarIllustration className="w-full aspect-[2/1] object-cover mb-4" />,
    <LaptopClockIllustration className="w-full aspect-[2/1] object-cover mb-4" />,
    <PlantFloorIllustration className="w-full aspect-[2/1] object-cover mb-4" />,
    <ApexAnalyticsIllustration className="w-full aspect-[2/1] object-cover mb-4" />,
  ]

  const featuredPost = posts[0]
  const sidePosts = posts.slice(1)

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 transition-colors duration-200">
      
      {/* 1. Hero Section */}
      <section className="mb-16 border-b border-zinc-200 dark:border-zinc-800 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column: Big Featured Post */}
          <div className="lg:col-span-2 space-y-6">
            {featuredPost ? (
              <ScrollReveal>
                <Link href={`/journal/${featuredPost.slug}`} className="group block">
                  <div className="relative overflow-hidden rounded-xl">
                    <ElectricGridIllustration className="w-full aspect-[2/1]" />
                  </div>
                  
                  <div className="mt-6 space-y-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 font-mono">
                      {featuredPost.tags?.[0] || "Featured log"}
                    </span>
                    <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 group-hover:text-zinc-600 dark:group-hover:text-zinc-350 transition-colors">
                      {featuredPost.title}
                    </h2>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-2xl leading-relaxed">
                      {featuredPost.excerpt}
                    </p>
                    <div className="text-[11px] text-zinc-450 dark:text-zinc-550 font-mono pt-1">
                      {new Date(featuredPost.publishedAt || featuredPost.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} • 8 min read
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ) : (
              <p className="text-muted-foreground">No featured posts yet.</p>
            )}
          </div>

          {/* Right Column: Vertical list of recent posts */}
          <div className="lg:col-span-1 flex flex-col justify-start">
            <ScrollReveal>
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 font-mono mb-6 pb-2 border-b border-zinc-200/60 dark:border-zinc-850">
                Latest journal logs
              </h3>
            </ScrollReveal>
            
            <ScrollStagger className="space-y-6" staggerDelay={0.08}>
              {sidePosts.map((post) => (
                <ScrollStaggerItem key={post.id} className="border-b border-zinc-150/60 dark:border-zinc-800/40 last:border-b-0 pb-4 last:pb-0">
                  <Link href={`/journal/${post.slug}`} className="group block space-y-1.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-mono">
                      {post.tags?.[0] || "Daily update"}
                    </span>
                    <h4 className="font-semibold text-sm leading-snug text-zinc-900 dark:text-zinc-50 group-hover:text-zinc-600 dark:group-hover:text-zinc-350 transition-colors">
                      {post.title}
                    </h4>
                    <span className="text-[10px] text-zinc-450 dark:text-zinc-550 font-mono block">
                      {new Date(post.publishedAt || post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </Link>
                </ScrollStaggerItem>
              ))}
              {sidePosts.length === 0 && (
                <p className="text-xs text-zinc-400 dark:text-zinc-500 italic py-4">No recent articles found.</p>
              )}
            </ScrollStagger>
          </div>

        </div>
      </section>

      {/* 2. Featured Projects Grid (3 columns) */}
      <section className="mb-16 border-b border-zinc-200 dark:border-zinc-800 pb-16">
        <ScrollReveal>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 font-mono">
              Featured Projects
            </h3>
            <Link href="/projects" className="text-xs font-bold uppercase tracking-wider text-zinc-650 dark:text-zinc-350 hover:underline flex items-center gap-1">
              View all projects <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </ScrollReveal>

        <ScrollStagger className="grid grid-cols-1 md:grid-cols-3 gap-8" staggerDelay={0.1}>
          {projects.map((project, idx) => (
            <ScrollStaggerItem key={project.id}>
              <Link href={`/projects/${project.slug}`} className="group block space-y-4">
                <div className="rounded-xl overflow-hidden bg-zinc-50 dark:bg-zinc-900/10">
                  {projectIllustrations[idx % projectIllustrations.length]}
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 font-mono">
                    {project.techStack?.[0] || "Project"}
                  </span>
                  <h4 className="font-bold text-base text-zinc-900 dark:text-zinc-50 group-hover:text-zinc-600 dark:group-hover:text-zinc-350 transition-colors">
                    {project.title}
                  </h4>
                  <p className="text-zinc-500 dark:text-zinc-400 text-xs line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex items-center gap-3 pt-2 text-[10px] text-zinc-450 dark:text-zinc-550 font-mono">
                    {project.githubUrl && <span className="flex items-center gap-1"><Code className="h-3 w-3" />Code</span>}
                    {project.liveUrl && <span className="flex items-center gap-1"><ExternalLink className="h-3 w-3" />Live Demo</span>}
                  </div>
                </div>
              </Link>
            </ScrollStaggerItem>
          ))}
          {projects.length === 0 && (
            <p className="col-span-3 text-center text-zinc-400 dark:text-zinc-500 italic py-10">No projects found. Seed the database to populate.</p>
          )}
        </ScrollStagger>
      </section>

      {/* 3. AI Tools Grid ("AI Tools for Everything", 6 items) */}
      <section className="mb-16 pb-16">
        <ScrollReveal>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
              AI Tools for Everything
            </h3>
            <Link href="/tools" className="text-xs font-bold uppercase tracking-wider text-zinc-650 dark:text-zinc-350 hover:underline flex items-center gap-1">
              All categories <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </ScrollReveal>

        <ScrollStagger className="grid grid-cols-1 md:grid-cols-3 gap-8" staggerDelay={0.08}>
          {tools.map((tool, idx) => (
            <ScrollStaggerItem key={tool.id}>
              <Link href={`/tools/${tool.slug}`} className="group block space-y-4">
                <div className="rounded-xl overflow-hidden bg-zinc-50 dark:bg-zinc-900/10">
                  {toolIllustrations[idx % toolIllustrations.length]}
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 font-mono">
                    {tool.category}
                  </span>
                  <h4 className="font-bold text-base text-zinc-900 dark:text-zinc-50 group-hover:text-zinc-600 dark:group-hover:text-zinc-350 transition-colors">
                    {tool.name}
                  </h4>
                  <p className="text-zinc-500 dark:text-zinc-400 text-xs line-clamp-2 leading-relaxed">
                    {tool.description}
                  </p>
                  
                  {/* Rating / Review footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-150/60 dark:border-zinc-800/40">
                    <div className="flex items-center gap-2">
                      <StarRating rating={tool.rating} />
                      <span className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 font-mono">
                        {tool.rating.toFixed(1)}
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-450 dark:text-zinc-550 font-mono">
                      ({tool.reviewCount} reviews)
                    </span>
                  </div>
                </div>
              </Link>
            </ScrollStaggerItem>
          ))}
          {tools.length === 0 && (
            <p className="col-span-3 text-center text-zinc-400 dark:text-zinc-500 italic py-10">No tools found. Seed the database to populate.</p>
          )}
        </ScrollStagger>

        {/* View All / Load More Button */}
        {tools.length > 0 && (
          <ScrollReveal className="flex justify-center mt-12">
            <Link href="/tools">
              <button className="border border-zinc-350 dark:border-zinc-750 text-zinc-850 dark:text-zinc-250 text-xs font-semibold px-6 py-2.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
                Load more
              </button>
            </Link>
          </ScrollReveal>
        )}
      </section>

      {/* 4. Newsletter Banner */}
      <ScrollReveal>
        <NewsletterSignup />
      </ScrollReveal>

    </div>
  )
}
