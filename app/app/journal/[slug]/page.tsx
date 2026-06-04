import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock } from "lucide-react"
import { MDXContent } from "@/components/shared/MDXContent"
import type { Metadata } from "next"

interface PostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params

  try {
    const post = await prisma.dailyPost.findUnique({
      where: { slug },
    })

    if (!post) return { title: "Post Not Found" }

    return {
      title: `${post.title} — Journal`,
      description: post.excerpt,
    }
  } catch {
    return { title: "Post Not Found" }
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params

  let post: any = null

  try {
    post = await prisma.dailyPost.findUnique({
      where: { slug },
    })

    if (!post) notFound()
  } catch (e) {
    notFound()
  }

  const date = new Date(post.publishedAt)
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  // Estimate reading time (rough: 200 words per minute)
  const wordCount = post.content.split(/\s+/).length
  const readingTime = Math.max(1, Math.ceil(wordCount / 200))

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span>{readingTime} min read</span>
          </div>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-4">
          {post.title}
        </h1>
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag: string) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Content */}
      <article className="prose prose-invert max-w-none">
        <MDXContent content={post.content} />
      </article>
    </div>
  )
}
