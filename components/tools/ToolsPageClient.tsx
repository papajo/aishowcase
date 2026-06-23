"use client";

import { useState, useMemo } from "react";
import { ToolCard } from "@/components/tools/ToolCard";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SlideUp } from "@/components/shared/Motion";

interface Tool {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  logoUrl: string | null;
  rating: number;
  reviewCount: number;
  featured: boolean;
  createdAt: string;
}

interface ToolsPageClientProps {
  tools: Tool[];
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
];

type SortKey = "popular" | "newest" | "rated";

const sortOptions: { key: SortKey; label: string }[] = [
  { key: "popular", label: "Popular" },
  { key: "newest", label: "Newest" },
  { key: "rated", label: "Top Rated" },
];

function sortTools(tools: Tool[], sort: SortKey): Tool[] {
  const sorted = [...tools];
  switch (sort) {
    case "popular":
      return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
    case "newest":
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    case "rated":
      return sorted.sort((a, b) => b.rating - a.rating);
  }
}

export function ToolsPageClient({ tools }: ToolsPageClientProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<SortKey>("popular");

  const filteredTools = useMemo(() => {
    let result = tools.filter((tool) => {
      const matchesSearch =
        tool.name.toLowerCase().includes(search.toLowerCase()) ||
        tool.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || tool.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
    return sortTools(result, sortBy);
  }, [tools, search, selectedCategory, sortBy]);

  const featured = filteredTools.find((t) => t.featured);
  const rest = filteredTools.filter((t) => t !== featured);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      {/* Header */}
      <SlideUp>
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
            AI Tools Directory
          </h1>
          <p className="text-muted-foreground">
            Tools I&apos;ve tested and reviewed.
            <span className="ml-1 text-foreground/60">
              {filteredTools.length} tool{filteredTools.length !== 1 ? "s" : ""}
            </span>
          </p>
        </div>
      </SlideUp>

      {/* Search + Sort bar */}
      <SlideUp delay={0.05}>
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tools..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-card/50 border-border/50"
            />
          </div>
          <div className="flex items-center gap-1 bg-card/50 border border-border/50 rounded-lg p-1">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground mx-2" />
            {sortOptions.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setSortBy(opt.key)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  sortBy === opt.key
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </SlideUp>

      {/* Category tabs */}
      <SlideUp delay={0.1}>
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 tools-scroll -mx-6 px-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25"
                  : "bg-card/50 border border-border/50 text-muted-foreground hover:text-foreground hover:border-border hover:bg-card"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </SlideUp>

      {/* Featured hero */}
      {featured && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <ToolCard tool={featured} featured />
        </motion.div>
      )}

      {/* Bento grid */}
      <motion.div layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {rest.map((tool) => (
            <motion.div
              key={tool.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <ToolCard tool={tool} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredTools.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg mb-2">No tools found</p>
          <p className="text-sm text-muted-foreground/60">
            Try adjusting your search or category filter
          </p>
        </div>
      )}
    </div>
  );
}
