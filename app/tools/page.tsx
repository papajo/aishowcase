import { prisma } from "@/lib/db"
import { getMarkdownTools } from "@/lib/md-utils"
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
  } catch {
    // Database not available
  }

  // Merge markdown tools, dedupe by slug
  const mdTools = getMarkdownTools()
  const seenSlugs = new Set<string>(tools.map((t: any) => t.slug))
  for (const md of mdTools) {
    if (!seenSlugs.has(md.slug)) {
      seenSlugs.add(md.slug)
      tools.push({
        id: `md-${md.slug}`,
        name: md.name,
        slug: md.slug,
        description: md.description,
        category: md.category,
        logoUrl: md.logoUrl,
        rating: md.rating,
        reviewCount: md.reviewCount,
        featured: md.featured,
      })
    }
  }

  return <ToolsPageClient tools={tools} />
}
