"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"
import { motion } from "framer-motion"

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
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return (
    <Link href={`/journal/${post.slug}`}>
      <motion.div
        whileHover={{ y: -2, scale: 1.005 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Card className="group transition-colors hover:border-primary/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <Calendar className="h-3.5 w-3.5" />
              <span>{formattedDate}</span>
            </div>
            <h3 className="font-semibold group-hover:text-primary transition-colors mb-2">
              {post.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {post.excerpt}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {post.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  )
}
