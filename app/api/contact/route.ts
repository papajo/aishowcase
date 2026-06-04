import { NextResponse } from "next/server"
import { z } from "zod"

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, message } = contactSchema.parse(body)

    // In production, you would:
    // 1. Send an email via Resend/SendGrid
    // 2. Store in database
    // 3. Send to Slack webhook

    console.log("Contact form submission:", { name, email, message })

    return NextResponse.json({
      success: true,
      message: "Message received! I'll get back to you soon.",
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0]
      return NextResponse.json(
        { error: firstError?.message || "Invalid input" },
        { status: 400 }
      )
    }
    console.error("Contact form error:", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}
