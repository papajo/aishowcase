import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import { z } from "zod"

const subscribeSchema = z.object({
  email: z.string().email("Invalid email address"),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email } = subscribeSchema.parse(body)

    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: { active: true },
      create: { email },
    })

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed! Check your inbox for confirmation.",
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0]
      return NextResponse.json(
        { error: firstError?.message || "Invalid input" },
        { status: 400 }
      )
    }
    console.error("Newsletter subscription error:", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}
