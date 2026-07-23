import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Star, ArrowUpRight } from "lucide-react"

interface ToolCardProps {
  tool: {
    id: string
    name: string
    slug: string
    description: string
    category: string
    logoUrl: string | null
    rating: number
    reviewCount: number
  }
  featured?: boolean
}

const categoryStyles: Record<string, { color: string; bg: string }> = {
  LLMs: { color: "text-[var(--cat-llms)]", bg: "bg-[var(--cat-llms)]/10" },
  "Vector DBs": { color: "text-[var(--cat-vector-dbs)]", bg: "bg-[var(--cat-vector-dbs)]/10" },
  Frameworks: { color: "text-[var(--cat-frameworks)]", bg: "bg-[var(--cat-frameworks)]/10" },
  Agents: { color: "text-[var(--cat-agents)]", bg: "bg-[var(--cat-agents)]/10" },
  IDEs: { color: "text-[var(--cat-ides)]", bg: "bg-[var(--cat-ides)]/10" },
  Deployment: { color: "text-[var(--cat-deployment)]", bg: "bg-[var(--cat-deployment)]/10" },
  Evaluation: { color: "text-[var(--cat-evaluation)]", bg: "bg-[var(--cat-evaluation)]/10" },
}

function getCategoryStyle(category: string) {
  return categoryStyles[category] ?? { color: "text-[oklch(0.5_0.03_40)]", bg: "bg-[oklch(0.94_0.01_50)]" }
}

export function ToolCard({ tool, featured }: ToolCardProps) {
  const cat = getCategoryStyle(tool.category)

  if (featured) {
    return (
      <Link href={`/tools/${tool.slug}`} className="block group">
        <div className="group relative col-span-full overflow-hidden rounded-2xl border border-[oklch(0.88_0.02_50)/60] dark:border-[oklch(0.2_0.02_45)/60] bg-[oklch(0.96_0.01_55)]/50 dark:bg-[oklch(0.13_0.02_45)]/50 backdrop-blur-sm transition-all duration-200 hover:border-[oklch(0.55_0.14_30)/30] dark:hover:border-[oklch(0.68_0.12_30)/30]">
          <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.55_0.14_30)/5] via-transparent to-[oklch(0.65_0.12_60)/5] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative flex flex-col sm:flex-row items-start gap-6 p-6 sm:p-8">
            {tool.logoUrl && (
              <div className="relative shrink-0">
                <img src={tool.logoUrl} alt={tool.name} className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-cover ring-2 ring-[oklch(0.88_0.02_50)/50] dark:ring-[oklch(0.2_0.02_45)/50] group-hover:ring-[oklch(0.55_0.14_30)/30] dark:group-hover:ring-[oklch(0.68_0.12_30)/30] transition-all duration-300" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl sm:text-2xl font-heading font-bold tracking-tight text-[oklch(0.15_0.02_40)] dark:text-[oklch(0.92_0.02_60)] group-hover:text-[oklch(0.55_0.14_30)] dark:group-hover:text-[oklch(0.68_0.12_30)] transition-colors">{tool.name}</h3>
                <Badge className={`${cat.color} ${cat.bg} border-0 text-xs font-medium`}>{tool.category}</Badge>
              </div>
              <p className="text-[oklch(0.5_0.03_40)] dark:text-[oklch(0.65_0.03_45)] text-sm sm:text-base mb-4 max-w-2xl">{tool.description}</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < Math.floor(tool.rating) ? "fill-[oklch(0.65_0.12_60)] text-[oklch(0.65_0.12_60)]" : "fill-[oklch(0.94_0.01_50)] text-[oklch(0.94_0.01_50)] dark:fill-[oklch(0.18_0.02_40)] dark:text-[oklch(0.18_0.02_40)]"}`} />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-[oklch(0.15_0.02_40)] dark:text-[oklch(0.92_0.02_60)]">{tool.rating.toFixed(1)}</span>
                  <span className="text-sm text-[oklch(0.5_0.03_40)] dark:text-[oklch(0.65_0.03_45)]">({tool.reviewCount} reviews)</span>
                </div>
                <div className="hidden sm:flex items-center gap-1 text-sm text-[oklch(0.55_0.14_30)] dark:text-[oklch(0.68_0.12_30)] opacity-0 group-hover:opacity-100 transition-opacity">
                  View details <ArrowUpRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/tools/${tool.slug}`} className="block group h-full">
      <div className="relative h-full rounded-2xl overflow-hidden border border-[oklch(0.88_0.02_50)/40] dark:border-[oklch(0.2_0.02_45)/40] bg-[oklch(0.96_0.01_55)]/80 dark:bg-[oklch(0.13_0.02_45)]/80 backdrop-blur-sm p-5 transition-all duration-200 group-hover:-translate-y-1 group-hover:bg-[oklch(0.96_0.01_55)] dark:group-hover:bg-[oklch(0.13_0.02_45)] group-hover:border-[oklch(0.55_0.14_30)/30] dark:group-hover:border-[oklch(0.68_0.12_30)/30]">
        <div className="flex items-start gap-3">
          {tool.logoUrl && (
            <img src={tool.logoUrl} alt={tool.name} className="h-11 w-11 rounded-xl object-cover ring-1 ring-[oklch(0.88_0.02_50)/50] dark:ring-[oklch(0.2_0.02_45)/50] shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-semibold text-sm tracking-tight text-[oklch(0.15_0.02_40)] dark:text-[oklch(0.92_0.02_60)] group-hover:text-[oklch(0.55_0.14_30)] dark:group-hover:text-[oklch(0.68_0.12_30)] transition-colors truncate">{tool.name}</h3>
              <ArrowUpRight className="h-3.5 w-3.5 text-[oklch(0.5_0.03_40)] dark:text-[oklch(0.65_0.03_45)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </div>
            <Badge className={`${cat.color} ${cat.bg} border-0 text-[10px] font-medium mt-1`}>{tool.category}</Badge>
          </div>
        </div>
        <p className="mt-3 text-xs text-[oklch(0.5_0.03_40)] dark:text-[oklch(0.65_0.03_45)] line-clamp-2 leading-relaxed">{tool.description}</p>
        <div className="mt-3 pt-3 border-t border-[oklch(0.88_0.02_50)/40] dark:border-[oklch(0.2_0.02_45)/40] flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Star className="h-3.5 w-3.5 fill-[oklch(0.65_0.12_60)] text-[oklch(0.65_0.12_60)]" />
            <span className="text-xs font-semibold text-[oklch(0.15_0.02_40)] dark:text-[oklch(0.92_0.02_60)]">{tool.rating.toFixed(1)}</span>
          </div>
          <span className="text-[10px] text-[oklch(0.5_0.03_40)] dark:text-[oklch(0.65_0.03_45)]">{tool.reviewCount} review{tool.reviewCount !== 1 ? "s" : ""}</span>
        </div>
      </div>
    </Link>
  )
}
