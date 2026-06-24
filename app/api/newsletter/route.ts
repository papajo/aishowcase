import { z } from "zod"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import { subscribeSchema } from "@/lib/schemas"
import { sendWelcomeEmail } from "@/lib/email"

export async function POST(req: Request) {
  try {
    const { email } = subscribeSchema.parse(await req.json())

    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: { active: true },
      create: { email },
    })

    sendWelcomeEmail(email).catch((err) => console.error("Welcome email failed:", err))

    return NextResponse.json({ success: true, message: "Successfully subscribed!" })
  } catch (error) {
    if (error instanceof z.ZodError) {
      const zErr = error as { issues: { message: string }[] }
      return NextResponse.json({ error: zErr.issues?.[0]?.message || "Invalid input" }, { status: 400 })
    }
    console.error("Newsletter subscription error:", error)
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 })
  }
}
