"use client"

import { useState, useMemo } from "react"
import { ToolCard } from "@/components/tools/ToolCard"
import { Input } from "@/components/ui/input"
import { Search, SlidersHorizontal } from "lucide-react"
import { ScrollReveal } from "@/components/shared/ScrollReveal"

interface Tool {
  id: string
  name: string
  slug: string
  description: string
  category: string
  logoUrl: string | null
  rating: number
  reviewCount: number
  featured: boolean
  createdAt: string
}

interface ToolsPageClientProps {
  tools: Tool[]
}

const categories = ["All", "LLMs", "Vector DBs", "Frameworks", "Agents", "IDEs", "Deployment", "Evaluation"]

type SortKey = "popular" | "newest" | "rated"

const sortOptions: { key: SortKey; label: string }[] = [
  { key: "popular", label: "Popular" },
  { key: "newest", label: "Newest" },
  { key: "rated", label: "Top Rated" },
]

function sortTools(tools: Tool[], sort: SortKey): Tool[] {
  const sorted = [...tools]
  switch (sort) {
    case "popular": return sorted.sort((a, b) => b.reviewCount - a.reviewCount)
    case "newest": return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    case "rated": return sorted.sort((a, b) => b.rating - a.rating)
  }
}

export function ToolsPageClient({ tools }: ToolsPageClientProps) {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState<SortKey>("popular")

  const filteredTools = useMemo(() => {
    const filtered = tools.filter((tool) => {
      const matchesSearch = tool.name.toLowerCase().includes(search.toLowerCase()) || tool.description.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = selectedCategory === "All" || tool.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    return sortTools(filtered, sortBy)
  }, [tools, search, selectedCategory, sortBy])

  const featured = filteredTools.find((t) => t.featured)
  const rest = filteredTools.filter((t) => t !== featured)

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <ScrollReveal>
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight mb-2 text-[oklch(0.15_0.02_40)] dark:text-[oklch(0.92_0.02_60)]">AI Tools Directory</h1>
          <p className="text-[oklch(0.5_0.03_40)] dark:text-[oklch(0.65_0.03_45)]">
            Tools I&apos;ve tested and reviewed.
            <span className="ml-1 text-[oklch(0.15_0.02_40)]/60 dark:text-[oklch(0.92_0.02_60)]/60">{filteredTools.length} tool{filteredTools.length !== 1 ? "s" : ""}</span>
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.05}>
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[oklch(0.5_0.03_40)] dark:text-[oklch(0.65_0.03_45)]" />
            <Input placeholder="Search tools..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-[oklch(0.96_0.01_55)]/50 dark:bg-[oklch(0.13_0.02_45)]/50 border-[oklch(0.88_0.02_50)/50] dark:border-[oklch(0.2_0.02_45)/50]" />
          </div>
          <div className="flex items-center gap-1 bg-[oklch(0.96_0.01_55)]/50 dark:bg-[oklch(0.13_0.02_45)]/50 border border-[oklch(0.88_0.02_50)/50] dark:border-[oklch(0.2_0.02_45)/50] rounded-lg p-1">
            <SlidersHorizontal className="h-4 w-4 text-[oklch(0.5_0.03_40)] dark:text-[oklch(0.65_0.03_45)] mx-2" />
            {sortOptions.map((opt) => (
              <button key={opt.key} onClick={() => setSortBy(opt.key)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${sortBy === opt.key ? "bg-[oklch(0.55_0.14_30)] text-white dark:bg-[oklch(0.68_0.12_30)] dark:text-[oklch(0.09_0.01_40)] shadow-sm" : "text-[oklch(0.5_0.03_40)] hover:text-[oklch(0.15_0.02_40)] dark:text-[oklch(0.65_0.03_45)] dark:hover:text-[oklch(0.92_0.02_60)] hover:bg-[oklch(0.94_0.01_50)] dark:hover:bg-[oklch(0.18_0.02_40)]"}`}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 -mx-6 px-6">
          {categories.map((category) => (
            <button key={category} onClick={() => setSelectedCategory(category)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === category ? "bg-[oklch(0.55_0.14_30)] text-white dark:bg-[oklch(0.68_0.12_30)] dark:text-[oklch(0.09_0.01_40)] shadow-sm shadow-[oklch(0.55_0.14_30)/25]" : "bg-[oklch(0.96_0.01_55)]/50 dark:bg-[oklch(0.13_0.02_45)]/50 border border-[oklch(0.88_0.02_50)/50] dark:border-[oklch(0.2_0.02_45)/50] text-[oklch(0.5_0.03_40)] dark:text-[oklch(0.65_0.03_45)] hover:text-[oklch(0.15_0.02_40)] dark:hover:text-[oklch(0.92_0.02_60)] hover:border-[oklch(0.88_0.02_50)] dark:hover:border-[oklch(0.2_0.02_45)] hover:bg-[oklch(0.96_0.01_55)] dark:hover:bg-[oklch(0.13_0.02_45)]"}`}>
              {category}
            </button>
          ))}
        </div>
      </ScrollReveal>

      <div className="space-y-6">
        {featured && (
          <ScrollReveal delay={0.15}>
            <ToolCard tool={featured} featured />
          </ScrollReveal>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rest.map((tool, idx) => (
            <ScrollReveal key={tool.id} delay={0.15 + idx * 0.03}>
              <ToolCard tool={tool} />
            </ScrollReveal>
          ))}
        </div>
        {filteredTools.length === 0 && (
          <p className="text-center text-[oklch(0.5_0.03_40)] dark:text-[oklch(0.65_0.03_45)] italic py-20">No tools matched your search.</p>
        )}
      </div>
    </div>
  )
}
