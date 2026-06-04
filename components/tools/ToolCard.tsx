"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import { motion } from "framer-motion"

interface ToolCardProps {
  tool: {
    id: string
    name: string
    slug: string
    description: string
    category: string
    logoUrl: string | null
    rating: number
    reviewCount: number
  }
}

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <Link href={`/tools/${tool.slug}`}>
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Card className="group h-full transition-colors hover:border-primary/50">
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              {tool.logoUrl && (
                <img
                  src={tool.logoUrl}
                  alt={tool.name}
                  className="h-12 w-12 rounded-lg object-cover"
                />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold group-hover:text-primary transition-colors">
                  {tool.name}
                </h3>
                <Badge variant="secondary" className="mt-1 text-xs">
                  {tool.category}
                </Badge>
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
              {tool.description}
            </p>
            <div className="mt-3 flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < Math.floor(tool.rating)
                        ? "fill-primary text-primary"
                        : "fill-muted text-muted"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                ({tool.reviewCount})
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  )
}
