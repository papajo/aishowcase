import { prisma } from "@/lib/db"
import { getMarkdownPosts } from "@/lib/md-utils"
import { PostCard } from "@/components/journal/PostCard"
import { ScrollReveal, ScrollStagger, ScrollStaggerItem } from "@/components/shared/ScrollReveal"

export const metadata = {
  title: "Journal — AI Showcase",
  description: "Daily logs, learnings, and insights from building with AI.",
}

export default async function JournalPage() {
  let dbPosts: any[] = []

  try {
    dbPosts = await prisma.dailyPost.findMany({ orderBy: { publishedAt: "desc" } })
  } catch {
    // Database not available
  }

  // Merge DB posts and markdown file posts, dedupe by slug
  const mdPosts = getMarkdownPosts()
  const seenSlugs = new Set<string>()
  const allPosts: any[] = []

  for (const post of dbPosts) {
    if (!seenSlugs.has(post.slug)) {
      seenSlugs.add(post.slug)
      allPosts.push({ ...post, date: post.publishedAt })
    }
  }
  for (const post of mdPosts) {
    if (!seenSlugs.has(post.slug)) {
      seenSlugs.add(post.slug)
      allPosts.push(post)
    }
  }

  // Sort all posts by date descending (newest first)
  allPosts.sort((a, b) => {
    const dateA = new Date(a.publishedAt || a.date || 0).getTime()
    const dateB = new Date(b.publishedAt || b.date || 0).getTime()
    return dateB - dateA
  })

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <ScrollReveal>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Journal</h1>
        <p className="text-muted-foreground mb-8">
          Daily logs, experiments, and insights from my AI development journey.
        </p>
      </ScrollReveal>

      <ScrollStagger className="space-y-4" staggerDelay={0.1}>
        {allPosts.map((post: any) => (
          <ScrollStaggerItem key={post.slug || post.id}><PostCard post={post} /></ScrollStaggerItem>
        ))}
      </ScrollStagger>

      {allPosts.length === 0 && <p className="text-center text-muted-foreground py-12">No posts yet. Check back soon!</p>}
    </div>
  )
}
