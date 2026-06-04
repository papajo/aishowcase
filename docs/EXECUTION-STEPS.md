# Phased Execution Steps

This is the step-by-step guide to building the AI Showcase platform. Follow these phases in order.

---

## PHASE 1: Foundation (Days 1-3)

### Step 1.1: Initialize Project
```bash
# Create Next.js project
npx create-next-app@latest ai-showcase \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir=false \
  --import-alias="@/*"

cd ai-showcase
```

### Step 1.2: Install Dependencies
```bash
# Core
npm install prisma @prisma/client
npm install next-mdx-remote remark-gfm rehype-highlight rehype-slug
npm install next-sitemap
npm install zod
npm install framer-motion

# shadcn/ui
npx shadcn@latest init
npx shadcn@latest add button card input badge dialog sheet
npx shadcn@latest add toast separator avatar dropdown-menu

# Dev tools
npm install -D @types/node
```

### Step 1.3: Configure Prisma
```bash
# Initialize Prisma
npx prisma init --datasource-provider postgresql
```

Create `prisma/schema.prisma`:
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Tool {
  id            String   @id @default(cuid())
  name          String
  slug          String   @unique
  description   String
  longDescription String? @db.Text
  category      String
  logoUrl       String?
  websiteUrl    String?
  rating        Float    @default(0)
  reviewCount   Int      @default(0)
  features      Json?
  pricing       Json?
  featured      Boolean  @default(false)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  reviews       Review[]

  @@index([category])
  @@index([rating])
  @@index([createdAt])
}

model Review {
  id          String   @id @default(cuid())
  toolId      String
  rating      Int
  content     String
  pros        String[]
  cons        String[]
  authorName  String
  createdAt   DateTime @default(now())
  tool        Tool     @relation(fields: [toolId], references: [id], onDelete: Cascade)

  @@index([toolId])
}

model Project {
  id            String   @id @default(cuid())
  title         String
  slug          String   @unique
  description   String
  thumbnailUrl  String?
  techStack     String[]
  tags          String[]
  githubUrl     String?
  liveUrl       String?
  content       String   @db.Text
  featured      Boolean  @default(false)
  order         Int      @default(0)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@index([featured])
  @@index([createdAt])
}

model DailyPost {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  excerpt     String
  content     String   @db.Text
  tags        String[]
  publishedAt DateTime @default(now())
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([publishedAt])
}

model NewsletterSubscriber {
  id            String   @id @default(cuid())
  email         String   @unique
  subscribedAt  DateTime @default(now())
  active        Boolean  @default(true)
}
```

### Step 1.4: Setup Database
```bash
# Create .env.local
echo 'DATABASE_URL="postgresql://user:pass@host:5432/ai_showcase"' > .env.local

# Run migration
npx prisma migrate dev --name init

# Generate client
npx prisma generate
```

### Step 1.5: Create Prisma Client Singleton
```typescript
// lib/db.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### Step 1.6: Configure Tailwind Theme
```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#3b82f6",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#8b5cf6",
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "#10b981",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
}
export default config
```

### Step 1.7: Setup Global Styles
```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 0 0% 3.9%;
    --muted: 0 0% 96.1%;
    --muted-foreground: 0 0% 45.1%;
  }

  .dark {
    --background: 0 0% 4%;
    --foreground: 0 0% 95%;
    --card: 0 0% 7%;
    --card-foreground: 0 0% 95%;
    --muted: 0 0% 12%;
    --muted-foreground: 0 0% 55%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

### Step 1.8: Build Root Layout
```tsx
// app/layout.tsx
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { ThemeProvider } from "@/components/shared/ThemeProvider"
import { Sidebar } from "@/components/layout/Sidebar"
import { MobileNav } from "@/components/layout/MobileNav"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" })

export const metadata: Metadata = {
  title: "AI Showcase — My AI Journey",
  description: "Building, testing, and sharing AI tools and projects daily.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrains.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 pb-16 md:pb-0 md:ml-64">
              {children}
            </main>
            <MobileNav />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### Step 1.9: Build Layout Components
```tsx
// components/layout/Sidebar.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/shared/ThemeToggle"

const navItems = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/tools", label: "AI Tools", icon: "🛠" },
  { href: "/projects", label: "Projects", icon: "🚀" },
  { href: "/journal", label: "Journal", icon: "📝" },
  { href: "/about", label: "About", icon: "👤" },
  { href: "/contact", label: "Contact", icon: "✉️" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 flex-col border-r bg-card p-6">
      <Link href="/" className="mb-8 text-xl font-bold">
        AI<span className="text-primary">Showcase</span>
      </Link>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
              pathname === item.href
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <ThemeToggle />
    </aside>
  )
}
```

---

## PHASE 2: Content Pages (Days 4-7)

### Step 2.1: Build Homepage
```tsx
// app/page.tsx
import { prisma } from "@/lib/db"
import { ToolCard } from "@/components/tools/ToolCard"
import { ProjectCard } from "@/components/projects/ProjectCard"
import { PostCard } from "@/components/journal/PostCard"
import { NewsletterSignup } from "@/components/shared/NewsletterSignup"

export default async function HomePage() {
  const [tools, projects, posts] = await Promise.all([
    prisma.tool.findMany({ take: 6, orderBy: { createdAt: "desc" } }),
    prisma.project.findMany({ take: 3, orderBy: { createdAt: "desc" } }),
    prisma.dailyPost.findMany({ take: 5, orderBy: { publishedAt: "desc" } }),
  ])

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      {/* Hero */}
      <section className="mb-16">
        <h1 className="mb-4 text-4xl font-bold">
          Hi, I'm <span className="text-primary">[Your Name]</span>
        </h1>
        <p className="text-lg text-muted-foreground">
          AI developer building, testing, and sharing tools daily.
          This is my showcase of projects, tools, and learnings.
        </p>
      </section>

      {/* Featured Projects */}
      <section className="mb-16">
        <h2 className="mb-6 text-2xl font-semibold">Featured Projects</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* Tools */}
      <section className="mb-16">
        <h2 className="mb-6 text-2xl font-semibold">AI Tools I Use</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      {/* Recent Posts */}
      <section className="mb-16">
        <h2 className="mb-6 text-2xl font-semibold">Latest from the Journal</h2>
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <NewsletterSignup />
    </div>
  )
}
```

### Step 2.2: Build Tool Components
```tsx
// components/tools/ToolCard.tsx
import Link from "next/link"
import { RatingStars } from "./RatingStars"
import { Badge } from "@/components/ui/badge"

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
}

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <Link href={`/tools/${tool.slug}`}>
      <div className="group rounded-xl border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
        <div className="flex items-start gap-4">
          {tool.logoUrl && (
            <img
              src={tool.logoUrl}
              alt={tool.name}
              className="h-12 w-12 rounded-lg object-cover"
            />
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold group-hover:text-primary transition-colors">
              {tool.name}
            </h3>
            <Badge variant="secondary" className="mt-1 text-xs">
              {tool.category}
            </Badge>
          </div>
        </div>
        <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
          {tool.description}
        </p>
        <div className="mt-3 flex items-center gap-2">
          <RatingStars rating={tool.rating} />
          <span className="text-xs text-muted-foreground">
            ({tool.reviewCount} reviews)
          </span>
        </div>
      </div>
    </Link>
  )
}
```

### Step 2.3: Build Tools Directory Page
```tsx
// app/tools/page.tsx
import { prisma } from "@/lib/db"
import { ToolCard } from "@/components/tools/ToolCard"
import { ToolFilters } from "@/components/tools/ToolFilters"
import { ToolSearch } from "@/components/tools/ToolSearch"

export default async function ToolsPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string }
}) {
  const where = {
    ...(searchParams.category && { category: searchParams.category }),
    ...(searchParams.search && {
      OR: [
        { name: { contains: searchParams.search, mode: "insensitive" } },
        { description: { contains: searchParams.search, mode: "insensitive" } },
      ],
    }),
  }

  const tools = await prisma.tool.findMany({
    where,
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="mb-2 text-3xl font-bold">AI Tools Directory</h1>
      <p className="mb-8 text-muted-foreground">
        Tools I've tested and reviewed. Filter by category or search.
      </p>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <ToolSearch />
          <ToolFilters selected={searchParams.category} />
        </aside>

        {/* Grid */}
        <div className="flex-1">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
          {tools.length === 0 && (
            <p className="text-center text-muted-foreground py-12">
              No tools found matching your criteria.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
```

### Step 2.4: Build Tool Detail Page
```tsx
// app/tools/[slug]/page.tsx
import { prisma } from "@/lib/db"
import { RatingStars } from "@/components/tools/RatingStars"
import { ReviewCard } from "@/components/tools/ReviewCard"
import { ToolCard } from "@/components/tools/ToolCard"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function ToolPage({
  params,
}: {
  params: { slug: string }
}) {
  const tool = await prisma.tool.findUnique({
    where: { slug: params.slug },
    include: { reviews: true },
  })

  if (!tool) return <div className="p-12 text-center">Tool not found</div>

  const relatedTools = await prisma.tool.findMany({
    where: { category: tool.category, id: { not: tool.id } },
    take: 4,
  })

  const features = tool.features as string[] | null
  const pricing = tool.pricing as { plan: string; price: string }[] | null

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      {/* Hero */}
      <div className="flex items-start gap-6 mb-8">
        {tool.logoUrl && (
          <img src={tool.logoUrl} alt={tool.name} className="h-20 w-20 rounded-xl" />
        )}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{tool.name}</h1>
            <Badge>{tool.category}</Badge>
          </div>
          <p className="text-muted-foreground mb-3">{tool.description}</p>
          <div className="flex items-center gap-3">
            <RatingStars rating={tool.rating} size="lg" />
            <span className="text-sm text-muted-foreground">
              {tool.reviewCount} reviews
            </span>
          </div>
        </div>
        {tool.websiteUrl && (
          <Button asChild>
            <a href={tool.websiteUrl} target="_blank" rel="noopener noreferrer">
              Visit Site
            </a>
          </Button>
        )}
      </div>

      {/* Features */}
      {features && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Features</h2>
          <ul className="grid sm:grid-cols-2 gap-2">
            {features.map((feature, i) => (
              <li key={i} className="flex items-center gap-2 text-sm">
                <span className="text-accent">✓</span> {feature}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Pricing */}
      {pricing && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Pricing</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {pricing.map((p, i) => (
              <div key={i} className="rounded-lg border bg-card p-4">
                <div className="text-sm text-muted-foreground">{p.plan}</div>
                <div className="text-xl font-bold mt-1">{p.price}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Reviews */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Reviews ({tool.reviews.length})
        </h2>
        <div className="space-y-4">
          {tool.reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </section>

      {/* Related Tools */}
      {relatedTools.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Related Tools</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {relatedTools.map((t) => (
              <ToolCard key={t.id} tool={t} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
```

---

## PHASE 3: Database & API (Days 8-9)

### Step 3.1: Create Seed Script
```typescript
// prisma/seed.ts
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

async function main() {
  // Seed Tools
  const tools = [
    {
      name: "OpenAI GPT-4",
      slug: "openai-gpt4",
      description: "Large language model for complex reasoning and code generation",
      category: "LLMs",
      rating: 4.7,
      reviewCount: 156,
      features: ["Function calling", "Vision", "Code interpreter", "Fine-tuning"],
      pricing: [
        { plan: "Pay-as-you-go", price: "$0.03/1K tokens" },
        { plan: "Enterprise", price: "Custom" },
      ],
    },
    {
      name: "Anthropic Claude",
      slug: "anthropic-claude",
      description: "Constitutional AI with strong safety and reasoning capabilities",
      category: "LLMs",
      rating: 4.8,
      reviewCount: 132,
      features: ["200K context", "Tool use", "Artifacts", "Projects"],
      pricing: [
        { plan: "Free", price: "$0" },
        { plan: "Pro", price: "$20/mo" },
        { plan: "Team", price: "$25/user/mo" },
      ],
    },
    // Add 10 more tools...
  ]

  for (const tool of tools) {
    await prisma.tool.upsert({
      where: { slug: tool.slug },
      update: tool,
      create: tool,
    })
  }

  // Seed Projects
  const projects = [
    {
      title: "RAG Pipeline for Docs",
      slug: "rag-pipeline",
      description: "A retrieval-augmented generation system for querying documentation",
      techStack: ["LangChain", "Pinecone", "OpenAI", "Next.js"],
      tags: ["RAG", "Vector Search", "LLM"],
      featured: true,
      content: "# RAG Pipeline\n\nFull project content in MDX...",
    },
    // Add more projects...
  ]

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: project,
      create: project,
    })
  }

  // Seed Posts
  const posts = [
    {
      title: "Building a RAG Pipeline from Scratch",
      slug: "rag-pipeline-journal",
      excerpt: "Today I built a complete RAG system using LangChain and Pinecone.",
      content: "# Building RAG\n\nToday's learnings...",
      tags: ["RAG", "LangChain", "Pinecone"],
    },
    // Add more posts...
  ]

  for (const post of posts) {
    await prisma.dailyPost.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    })
  }

  console.log("Seed data created!")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

### Step 3.2: Create API Routes
```typescript
// app/api/newsletter/route.ts
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import { z } from "zod"

const subscribeSchema = z.object({
  email: z.string().email("Invalid email address"),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email } = subscribeSchema.parse(body)

    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: { active: true },
      create: { email },
    })

    return NextResponse.json({ success: true, message: "Subscribed!" })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
```

---

## PHASE 4: Polish & SEO (Days 10-11)

### Step 4.1: Add SEO Metadata
```tsx
// app/tools/[slug]/page.tsx
import type { Metadata } from "next"

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const tool = await prisma.tool.findUnique({
    where: { slug: params.slug },
  })

  if (!tool) return { title: "Tool Not Found" }

  return {
    title: `${tool.name} — AI Tools Directory`,
    description: tool.description,
    openGraph: {
      title: tool.name,
      description: tool.description,
      images: [tool.logoUrl || "/og-default.png"],
    },
  }
}
```

### Step 4.2: Create Sitemap
```typescript
// next.config.mjs
import nextSitemap from "next-sitemap"

const config = {
  siteUrl: "https://yourdomain.com",
  generateRobotsTxt: true,
  sitemapSize: 7000,
}

export default nextSitemap(config)
```

---

## PHASE 5: Deploy & Launch (Day 12)

### Step 5.1: Deploy to Vercel
```bash
# Initialize git
git init && git add . && git commit -m "Initial commit"

# Push to GitHub
git remote add origin https://github.com/yourusername/ai-showcase.git
git push -u origin main

# Deploy via Vercel CLI
npx vercel

# Or connect repo at vercel.com/new
```

### Step 5.2: Set Up Production Database
```bash
# Option A: Neon (recommended)
# 1. Create account at neon.tech
# 2. Create project
# 3. Copy connection string
# 4. Add to Vercel env vars

# Option B: Vercel Postgres
# 1. Create in Vercel dashboard
# 2. Auto-linked to project

# Run migrations in production
npx prisma migrate deploy
npx prisma db seed
```

### Step 5.3: Configure Domain
```bash
# In Vercel dashboard:
# 1. Go to Settings > Domains
# 2. Add your custom domain
# 3. Configure DNS records
# 4. Enable SSL (automatic)
```

### Step 5.4: Final Checklist
- [ ] All pages load correctly
- [ ] Dark/light mode works
- [ ] Mobile responsive
- [ ] Forms work (newsletter, contact)
- [ ] SEO metadata present
- [ ] Sitemap generates
- [ ] Analytics tracking
- [ ] Error pages (404, 500)
- [ ] Performance score > 90
- [ ] Content is real (not placeholder)
