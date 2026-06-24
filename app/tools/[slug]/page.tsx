import { prisma } from "@/lib/db"
import { getMarkdownToolBySlug, getMarkdownTools } from "@/lib/md-utils"
import { MDXContent } from "@/components/shared/MDXContent"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Star, ExternalLink, Check } from "lucide-react"
import { ToolCard } from "@/components/tools/ToolCard"
import { ReviewCard } from "@/components/tools/ReviewCard"
import type { Metadata } from "next"

interface ToolPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { slug } = await params

  try {
    const tool = await prisma.tool.findUnique({ where: { slug } })
    if (tool) return { title: `${tool.name} — AI Tools Directory`, description: tool.description }
  } catch {
    // DB not available
  }

  const mdTool = getMarkdownToolBySlug(slug)
  if (mdTool) return { title: `${mdTool.name} — AI Tools Directory`, description: mdTool.description }

  return { title: "Tool Not Found" }
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params

  let tool: any = null
  let relatedTools: any[] = []
  let isMarkdown = false
  let mdContent: string | null = null

  try {
    tool = await prisma.tool.findUnique({
      where: { slug },
      include: { reviews: true },
    })
    if (tool) {
      relatedTools = await prisma.tool.findMany({
        where: { category: tool.category, id: { not: tool.id } },
        take: 4,
      })
    }
  } catch {
    // Database not available
  }

  // Fall back to markdown tool
  if (!tool) {
    const mdTool = getMarkdownToolBySlug(slug)
    if (!mdTool) notFound()
    tool = {
      id: `md-${mdTool!.slug}`,
      name: mdTool!.name,
      slug: mdTool!.slug,
      description: mdTool!.description,
      longDescription: mdTool!.longDescription,
      category: mdTool!.category,
      logoUrl: mdTool!.logoUrl,
      websiteUrl: mdTool!.websiteUrl,
      rating: mdTool!.rating,
      reviewCount: mdTool!.reviewCount,
      features: mdTool!.features,
      pricing: null,
      reviews: [],
    }
    isMarkdown = true
    mdContent = mdTool!.content
    const allMd = getMarkdownTools()
    relatedTools = allMd
      .filter((t) => t.category === mdTool!.category && t.slug !== mdTool!.slug)
      .slice(0, 4)
      .map((t) => ({
        id: `md-${t.slug}`,
        name: t.name,
        slug: t.slug,
        description: t.description,
        category: t.category,
        logoUrl: t.logoUrl,
        rating: t.rating,
        reviewCount: t.reviewCount,
        featured: t.featured,
      }))
  }

  const features = (tool.features as string[] | null) || []
  const pricing = tool.pricing as { plan: string; price: string }[] | null
  const reviews = tool.reviews || []

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      {/* Hero */}
      <div className="flex items-start gap-6 mb-8">
        {tool.logoUrl && (
          <img src={tool.logoUrl} alt={tool.name} className="h-20 w-20 rounded-xl" />
        )}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold tracking-tight">{tool.name}</h1>
            <Badge>{tool.category}</Badge>
          </div>
          <p className="text-muted-foreground mb-3">{tool.description}</p>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < Math.floor(tool.rating) ? "fill-primary text-primary" : "fill-muted text-muted"}`} />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {tool.rating.toFixed(1)} ({tool.reviewCount} reviews)
            </span>
          </div>
        </div>
        {tool.websiteUrl && (
          <a href={tool.websiteUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80 transition-colors">
            <ExternalLink className="h-4 w-4" />
            Visit Site
          </a>
        )}
      </div>

      {/* Features */}
      {features.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Features</h2>
          <ul className="grid sm:grid-cols-2 gap-2">
            {features.map((feature: string, i: number) => (
              <li key={i} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-accent shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Pricing (DB tools only) */}
      {pricing && pricing.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Pricing</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {pricing.map((p: { plan: string; price: string }, i: number) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">{p.plan}</div>
                  <div className="text-xl font-bold mt-1">{p.price}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Reviews */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Reviews ({reviews.length})</h2>
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review: any) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No reviews yet.</p>
        )}
      </section>

      {/* Markdown content (markdown tools) or DB long description */}
      {isMarkdown && mdContent ? (
        <article className="prose prose-invert max-w-none mb-12">
          <MDXContent content={mdContent} />
        </article>
      ) : tool.longDescription && (
        <article className="prose prose-invert max-w-none mb-12">
          <MDXContent content={tool.longDescription} />
        </article>
      )}

      {/* Related Tools */}
      {relatedTools.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Related Tools</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {relatedTools.map((t: any) => (
              <ToolCard key={t.id} tool={t} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
