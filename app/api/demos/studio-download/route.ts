import fs from "fs"
import path from "path"
import { z } from "zod"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { subscribeSchema } from "@/lib/schemas"
import { sendWelcomeEmail } from "@/lib/email"

const STUDIO_FILE = path.join(
  process.cwd(),
  "content",
  "downloads",
  "ml-knowledge-graph-studio.html"
)

export async function POST(req: Request) {
  try {
    const { email } = subscribeSchema.parse(await req.json())

    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: { active: true },
      create: { email },
    })

    sendWelcomeEmail(email).catch((err) =>
      console.error("Welcome email failed:", err)
    )

    if (!fs.existsSync(STUDIO_FILE)) {
      return NextResponse.json(
        { error: "Download artifact is unavailable." },
        { status: 404 }
      )
    }

    const html = fs.readFileSync(STUDIO_FILE, "utf-8")
    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition":
          'attachment; filename="ml-knowledge-graph-studio.html"',
        "Cache-Control": "no-store",
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Please enter a valid email address." },
        { status: 400 }
      )
    }
    console.error("Studio download error:", error)
    return NextResponse.json(
      { error: "Failed to process signup. Please try again." },
      { status: 500 }
    )
  }
}
