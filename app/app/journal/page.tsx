import { prisma } from "@/lib/db"
import { PostCard } from "@/components/journal/PostCard"
import { SlideUp } from "@/components/shared/Motion"
import { ScrollStagger, ScrollStaggerItem } from "@/components/shared/ScrollReveal"

export const metadata = {
  title: "Journal — AI Showcase",
  description: "Daily logs, learnings, and insights from building with AI.",
}

export default async function JournalPage() {
  let posts: any[] = []

  try {
    posts = await prisma.dailyPost.findMany({
      orderBy: { publishedAt: "desc" },
    })
  } catch (e) {
    // Database not available
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <SlideUp>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Journal</h1>
        <p className="text-muted-foreground mb-8">
          Daily logs, experiments, and insights from my AI development journey.
        </p>
      </SlideUp>

      <ScrollStagger className="space-y-4" staggerDelay={0.1}>
        {posts.map((post: any) => (
          <ScrollStaggerItem key={post.id}>
            <PostCard
              post={{
                ...post,
                publishedAt: post.publishedAt,
              }}
            />
          </ScrollStaggerItem>
        ))}
      </ScrollStagger>

      {posts.length === 0 && (
        <p className="text-center text-muted-foreground py-12">
          No posts yet. Check back soon!
        </p>
      )}
    </div>
  )
}
