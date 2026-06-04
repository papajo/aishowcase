"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

interface ReviewCardProps {
  review: {
    id: string
    rating: number
    content: string
    pros: string[]
    cons: string[]
    authorName: string
    createdAt: Date
  }
}

export function ReviewCard({ review }: ReviewCardProps) {
  const date = new Date(review.createdAt)
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
              {review.authorName[0]}
            </div>
            <div>
              <div className="text-sm font-medium">{review.authorName}</div>
              <div className="text-xs text-muted-foreground">{formattedDate}</div>
            </div>
          </div>
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < review.rating
                    ? "fill-primary text-primary"
                    : "fill-muted text-muted"
                }`}
              />
            ))}
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-3">{review.content}</p>
        {(review.pros.length > 0 || review.cons.length > 0) && (
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            {review.pros.length > 0 && (
              <div>
                <div className="font-medium text-accent mb-1">Pros</div>
                <ul className="space-y-1">
                  {review.pros.map((pro, i) => (
                    <li key={i} className="text-muted-foreground">+ {pro}</li>
                  ))}
                </ul>
              </div>
            )}
            {review.cons.length > 0 && (
              <div>
                <div className="font-medium text-destructive mb-1">Cons</div>
                <ul className="space-y-1">
                  {review.cons.map((con, i) => (
                    <li key={i} className="text-muted-foreground">- {con}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
