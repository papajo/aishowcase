import { prisma } from "@/lib/db"
import { getMarkdownTools } from "@/lib/md-utils"
import { ToolsPageClient } from "@/components/tools/ToolsPageClient"

export const metadata = {
  title: "AI Tools Directory — AI Showcase",
  description: "AI tools I've tested and reviewed for building AI applications.",
}

interface ToolListItem {
  id: string
  name: string
  slug: string
  description: string
  category: string
  logoUrl: string | null
  rating: number
  reviewCount: number
  featured: boolean
  affiliateUrl: string | null
  sponsorTier: "none" | "basic" | "featured"
  createdAt: string
}

export default async function ToolsPage() {
  let tools: ToolListItem[] = []

  try {
    const dbTools = await prisma.tool.findMany({
      orderBy: { createdAt: "desc" },
    })
    tools = dbTools.map((t) => ({
      ...t,
      createdAt: t.createdAt.toISOString(),
    }))
  } catch {
    // Database not available
  }

  // Merge markdown tools, dedupe by slug
  const mdTools = getMarkdownTools()
  const seenSlugs = new Set<string>(tools.map((t) => t.slug))
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
        affiliateUrl: md.affiliateUrl,
        sponsorTier: md.sponsorTier,
        createdAt: new Date(0).toISOString(),
      })
    }
  }

  return <ToolsPageClient tools={tools} />
}
