import { z } from "zod"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import { reviewSchema } from "@/lib/schemas"

export async function POST(req: Request) {
  try {
    const data = reviewSchema.parse(await req.json())
    const review = await prisma.review.create({ data })

    // Update tool's average rating and count
    const toolReviews = await prisma.review.findMany({ where: { toolId: data.toolId } })
    const avgRating = toolReviews.reduce((sum, r) => sum + r.rating, 0) / toolReviews.length

    await prisma.tool.update({
      where: { id: data.toolId },
      data: {
        reviewCount: toolReviews.length,
        rating: Math.round(avgRating * 10) / 10,
      },
    })

    return NextResponse.json({ success: true, review })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message || "Invalid input" }, { status: 400 })
    }
    console.error("Review submission error:", error)
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 })
  }
}
