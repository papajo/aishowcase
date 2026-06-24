import { z } from "zod"
import { NextResponse } from "next/server"
import { contactSchema } from "@/lib/schemas"
import { sendContactEmail, sendAutoReply } from "@/lib/email"

export async function POST(req: Request) {
  try {
    const { name, email, message } = contactSchema.parse(await req.json())
    const emailResult = await sendContactEmail({ name, email, message })

    if (!emailResult.success) {
      return NextResponse.json({ error: "Failed to send message. Please try again." }, { status: 500 })
    }

    // Send auto-reply (non-blocking)
    sendAutoReply({ name, email }).catch((err) => console.error("Auto-reply failed:", err))

    return NextResponse.json({ success: true, message: "Message received! I'll get back to you soon." })
  } catch (error) {
    if (error instanceof z.ZodError) {
      const zErr = error as { issues: { message: string }[] }
      return NextResponse.json({ error: zErr.issues?.[0]?.message || "Invalid input" }, { status: 400 })
    }
    console.error("Contact form error:", error)
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 })
  }
}
