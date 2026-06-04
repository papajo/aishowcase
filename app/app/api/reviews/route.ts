import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import { z } from "zod"

const reviewSchema = z.object({
  toolId: z.string(),
  rating: z.number().min(1).max(5),
  content: z.string().min(10, "Review must be at least 10 characters"),
  pros: z.array(z.string()),
  cons: z.array(z.string()),
  authorName: z.string().min(1, "Name is required"),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = reviewSchema.parse(body)

    const review = await prisma.review.create({
      data,
    })

    // Update tool's review count and average rating
    const toolReviews = await prisma.review.findMany({
      where: { toolId: data.toolId },
    })

    const avgRating =
      toolReviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / toolReviews.length

    await prisma.tool.update({
      where: { id: data.toolId },
      data: {
        reviewCount: toolReviews.length,
        rating: Math.round(avgRating * 10) / 10,
      },
    })

    return NextResponse.json({
      success: true,
      review,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0]
      return NextResponse.json(
        { error: firstError?.message || "Invalid input" },
        { status: 400 }
      )
    }
    console.error("Review submission error:", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}
