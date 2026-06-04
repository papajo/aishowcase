import { prisma } from "@/lib/db"
import { ToolsList } from "./ToolsList"

export const metadata = {
  title: "Manage Tools — AI Showcase",
}

export default async function AdminToolsPage() {
  let tools: any[] = []

  try {
    tools = await prisma.tool.findMany({
      orderBy: { createdAt: "desc" },
    })
  } catch (e) {
    // Database not available
  }

  return <ToolsList tools={tools} />
}
