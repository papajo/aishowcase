import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"

interface PostCardProps {
  post: {
    id?: string
    title: string
    slug: string
    excerpt: string
    tags: string[]
    publishedAt?: Date
    date?: string | Date
  }
}

export function PostCard({ post }: PostCardProps) {
  const date = new Date(post.publishedAt || post.date || new Date())
  const formattedDate = date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

  return (
    <Link href={`/journal/${post.slug}`} className="block group">
      <Card className="transition-all duration-200 hover:-translate-y-0.5">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 text-xs text-[oklch(0.5_0.03_40)] dark:text-[oklch(0.65_0.03_45)] mb-2">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formattedDate}</span>
          </div>
          <h3 className="font-heading font-semibold text-[oklch(0.15_0.02_40)] dark:text-[oklch(0.92_0.02_60)] group-hover:text-[oklch(0.55_0.14_30)] dark:group-hover:text-[oklch(0.68_0.12_30)] transition-colors mb-2">{post.title}</h3>
          <p className="text-sm text-[oklch(0.5_0.03_40)] dark:text-[oklch(0.65_0.03_45)] line-clamp-2 mb-3">{post.excerpt}</p>
          <div className="flex flex-wrap gap-1.5">
            {(post.tags || []).slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
