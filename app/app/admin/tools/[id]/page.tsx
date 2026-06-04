import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import { ToolForm } from "../ToolForm"

export const metadata = {
  title: "Edit Tool — AI Showcase",
}

export default async function EditToolPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  let tool: any = null

  try {
    tool = await prisma.tool.findUnique({
      where: { id },
    })
  } catch (e) {
    notFound()
  }

  if (!tool) {
    notFound()
  }

  return <ToolForm tool={tool} />
}
