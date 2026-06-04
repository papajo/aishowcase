import { prisma } from "@/lib/db"
import { ToolsPageClient } from "@/components/tools/ToolsPageClient"

export const metadata = {
  title: "AI Tools Directory — AI Showcase",
  description: "AI tools I've tested and reviewed for building AI applications.",
}

export default async function ToolsPage() {
  let tools: any[] = []

  try {
    tools = await prisma.tool.findMany({
      orderBy: { createdAt: "desc" },
    })
  } catch (e) {
    // Database not available
  }

  return <ToolsPageClient tools={tools} />
}
