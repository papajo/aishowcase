import { NextResponse } from "next/server"
import { z } from "zod"
import { sendContactEmail, sendAutoReply } from "@/lib/email"

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, message } = contactSchema.parse(body)

    // Send email to site owner
    const emailResult = await sendContactEmail({ name, email, message })

    if (!emailResult.success) {
      return NextResponse.json(
        { error: "Failed to send message. Please try again." },
        { status: 500 }
      )
    }

    // Send auto-reply to sender (non-blocking)
    sendAutoReply({ name, email }).catch((err) =>
      console.error("Auto-reply failed:", err)
    )

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
