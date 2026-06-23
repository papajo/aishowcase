"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Star, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

interface ToolCardProps {
  tool: {
    id: string;
    name: string;
    slug: string;
    description: string;
    category: string;
    logoUrl: string | null;
    rating: number;
    reviewCount: number;
  };
  featured?: boolean;
}

const categoryStyles: Record<string, { color: string; bg: string }> = {
  LLMs: { color: "text-[var(--cat-llms)]", bg: "bg-[var(--cat-llms)]/10" },
  "Vector DBs": {
    color: "text-[var(--cat-vector-dbs)]",
    bg: "bg-[var(--cat-vector-dbs)]/10",
  },
  Frameworks: {
    color: "text-[var(--cat-frameworks)]",
    bg: "bg-[var(--cat-frameworks)]/10",
  },
  Agents: {
    color: "text-[var(--cat-agents)]",
    bg: "bg-[var(--cat-agents)]/10",
  },
  IDEs: { color: "text-[var(--cat-ides)]", bg: "bg-[var(--cat-ides)]/10" },
  Deployment: {
    color: "text-[var(--cat-deployment)]",
    bg: "bg-[var(--cat-deployment)]/10",
  },
  Evaluation: {
    color: "text-[var(--cat-evaluation)]",
    bg: "bg-[var(--cat-evaluation)]/10",
  },
};

function getCategoryStyle(category: string) {
  return (
    categoryStyles[category] ?? {
      color: "text-muted-foreground",
      bg: "bg-muted",
    }
  );
}

export function ToolCard({ tool, featured }: ToolCardProps) {
  const cat = getCategoryStyle(tool.category);

  if (featured) {
    return (
      <Link href={`/tools/${tool.slug}`}>
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="group relative col-span-full overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative flex flex-col sm:flex-row items-start gap-6 p-6 sm:p-8">
            {tool.logoUrl && (
              <div className="relative shrink-0">
                <img
                  src={tool.logoUrl}
                  alt={tool.name}
                  className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-cover ring-2 ring-border/50 group-hover:ring-primary/30 transition-all duration-300"
                />
                <div className="absolute -inset-1 rounded-2xl bg-primary/10 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight group-hover:text-primary transition-colors">
                  {tool.name}
                </h3>
                <Badge
                  className={`${cat.color} ${cat.bg} border-0 text-xs font-medium`}
                >
                  {tool.category}
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm sm:text-base mb-4 max-w-2xl">
                {tool.description}
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(tool.rating)
                            ? "fill-amber-400 text-amber-400"
                            : "fill-muted text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">
                    {tool.rating.toFixed(1)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    ({tool.reviewCount} reviews)
                  </span>
                </div>
                <div className="hidden sm:flex items-center gap-1 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  View details <ArrowUpRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    );
  }

  return (
    <Link href={`/tools/${tool.slug}`}>
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="group relative h-full"
      >
        <div className="gradient-border relative h-full rounded-2xl overflow-hidden">
          <div className="h-full bg-card/80 backdrop-blur-sm border border-border/30 rounded-2xl p-5 transition-colors group-hover:bg-card">
            <div className="flex items-start gap-3">
              {tool.logoUrl && (
                <div className="relative shrink-0">
                  <img
                    src={tool.logoUrl}
                    alt={tool.name}
                    className="h-11 w-11 rounded-xl object-cover ring-1 ring-border/50"
                  />
                  <div className="absolute -inset-0.5 rounded-xl bg-primary/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm tracking-tight group-hover:text-primary transition-colors truncate">
                    {tool.name}
                  </h3>
                  <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </div>
                <Badge
                  className={`${cat.color} ${cat.bg} border-0 text-[10px] font-medium mt-1`}
                >
                  {tool.category}
                </Badge>
              </div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {tool.description}
            </p>
            <div className="mt-3 pt-3 border-t border-border/30 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="text-xs font-semibold">
                  {tool.rating.toFixed(1)}
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground">
                {tool.reviewCount} review{tool.reviewCount !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
