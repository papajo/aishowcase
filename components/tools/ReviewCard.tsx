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
            <div className="h-8 w-8 rounded-full bg-[oklch(0.94_0.01_50)] dark:bg-[oklch(0.18_0.02_40)] flex items-center justify-center text-sm font-medium text-[oklch(0.5_0.03_40)] dark:text-[oklch(0.65_0.03_45)]">
              {review.authorName[0]}
            </div>
            <div>
              <div className="text-sm font-medium text-[oklch(0.15_0.02_40)] dark:text-[oklch(0.92_0.02_60)]">{review.authorName}</div>
              <div className="text-xs text-[oklch(0.5_0.03_40)] dark:text-[oklch(0.65_0.03_45)]">{formattedDate}</div>
            </div>
          </div>
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < review.rating
                    ? "fill-[oklch(0.65_0.12_60)] text-[oklch(0.65_0.12_60)]"
                    : "fill-[oklch(0.94_0.01_50)] text-[oklch(0.94_0.01_50)] dark:fill-[oklch(0.18_0.02_40)] dark:text-[oklch(0.18_0.02_40)]"
                }`}
              />
            ))}
          </div>
        </div>
        <p className="text-sm text-[oklch(0.5_0.03_40)] dark:text-[oklch(0.65_0.03_45)] mb-3">{review.content}</p>
        {(review.pros.length > 0 || review.cons.length > 0) && (
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            {review.pros.length > 0 && (
              <div>
                <div className="font-medium text-[oklch(0.6_0.1_35)] dark:text-[oklch(0.6_0.08_35)] mb-1">Pros</div>
                <ul className="space-y-1">
                  {review.pros.map((pro, i) => (
                    <li key={i} className="text-[oklch(0.5_0.03_40)] dark:text-[oklch(0.65_0.03_45)]">+ {pro}</li>
                  ))}
                </ul>
              </div>
            )}
            {review.cons.length > 0 && (
              <div>
                <div className="font-medium text-destructive mb-1">Cons</div>
                <ul className="space-y-1">
                  {review.cons.map((con, i) => (
                    <li key={i} className="text-[oklch(0.5_0.03_40)] dark:text-[oklch(0.65_0.03_45)]">- {con}</li>
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
