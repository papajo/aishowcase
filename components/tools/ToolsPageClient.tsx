"use client"

import { useState, useMemo } from "react"
import { ToolCard } from "@/components/tools/ToolCard"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { SlideUp } from "@/components/shared/Motion"

interface Tool {
  id: string
  name: string
  slug: string
  description: string
  category: string
  logoUrl: string | null
  rating: number
  reviewCount: number
}

interface ToolsPageClientProps {
  tools: Tool[]
}

const categories = [
  "All",
  "LLMs",
  "Vector DBs",
  "Frameworks",
  "Agents",
  "IDEs",
  "Deployment",
  "Evaluation",
]

export function ToolsPageClient({ tools }: ToolsPageClientProps) {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesSearch =
        tool.name.toLowerCase().includes(search.toLowerCase()) ||
        tool.description.toLowerCase().includes(search.toLowerCase())
      const matchesCategory =
        selectedCategory === "All" || tool.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [tools, search, selectedCategory])

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <SlideUp>
        <h1 className="text-3xl font-bold tracking-tight mb-2">AI Tools Directory</h1>
        <p className="text-muted-foreground mb-8">
          Tools I&apos;ve tested and reviewed. Filter by category or search.
        </p>
      </SlideUp>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <SlideUp delay={0.1}>
          <aside className="w-full md:w-64 shrink-0">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tools..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="space-y-1">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedCategory === category
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </aside>
        </SlideUp>

        {/* Grid */}
        <div className="flex-1">
          <motion.div
            layout
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {filteredTools.map((tool) => (
                <motion.div
                  key={tool.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <ToolCard tool={tool} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          {filteredTools.length === 0 && (
            <p className="text-center text-muted-foreground py-12">
              No tools found matching your criteria.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
