# AI Showcase — Architecture

## Overview

Next.js 16 (App Router) site with a **dual data layer**: content lives either in a **PostgreSQL database** (via Prisma) or as **local Markdown files**, with the same pages serving both sources transparently.

## Route Map

```
/                          → HomePage: hero post, featured projects, tools grid, newsletter
/tools                     → ToolsPage: full directory listing
/tools/[slug]              → ToolPage: tool detail + reviews
/projects                  → ProjectsPage: all projects
/projects/[slug]           → ProjectPage: project detail
/journal                   → JournalPage: all posts
/journal/[slug]            → PostPage: single article
/about                     → AboutPage: bio, skills, experience (from about.md or fallback)
/contact                   → ContactPage: form → email via Resend
/admin                     → AdminDashboard: stats overview
/admin/tools               → CRUD tools (DB only)
/admin/projects            → CRUD projects (DB only)
/admin/journal             → CRUD posts (DB only)
```

## Data Layer Architecture

### Database (Prisma + PostgreSQL)

Models in `prisma/schema.prisma`:
- **Tool** — name, slug, description, category, rating, features, reviews[]
- **Review** — rating, content, pros/cons, authorName → belongs to Tool
- **Project** — title, slug, description, techStack, tags, github/live URLs, content
- **DailyPost** — title, slug, excerpt, content, tags, publishedAt
- **NewsletterSubscriber** — email, active

### Markdown Files (`content/`)

```
content/
├── about.md                → About page data + bio content
├── posts/                  → Journal posts (prefix: YYYYMMDD-HHMMSS-slug.md)
├── tools/                  → Tool directory entries
├── projects/               → Project detail pages
└── drafts/                 → Unpublished drafts (moved to posts/ via publish_drafts.py)
```

Each `.md` file has frontmatter (`---` delimited) matching its type's interface in `lib/md-utils.ts`. The markdown body provides long-form content rendered via `MDXContent` (react-markdown + remark-gfm).

### Hybrid Data Pattern

Every listing page and detail page follows this pattern:

1. **Try the database first** — query Prisma inside a try/catch (graceful if DB is down)
2. **Fall back to markdown** — call `getMarkdown*()` functions from `lib/md-utils.ts`
3. **Merge & deduplicate** — combine both sources, deduping by `slug`
4. **Render** — unified components consume the merged data

This means Markdown files are both a development convenience (no DB needed) and production content sources alongside the database.

## Component Tree

```
app/layout.tsx
├── Providers              → Theme context wrapper
├── Header                 → Sticky nav, theme toggle, mobile menu
├── {page content}         → Page-specific components
└── Footer                 → Links, newsletter form (client-side toast only)

Page-specific:
├── components/ui/         → shadcn primitives (button, card, badge, input, skeleton, sonner)
├── components/shared/     → MDXContent, ScrollReveal, NewsletterSignup, Providers, Skeletons, ThemeToggle, TechnicalIllustrations
├── components/layout/     → Header, Footer, MobileNav, Sidebar (unused)
├── components/tools/      → ToolCard, ToolsPageClient, ReviewCard
├── components/projects/   → ProjectCard
└── components/journal/    → PostCard
```

## API Routes

All admin routes require Basic auth (checked via `checkAdminAuth` in `lib/admin.ts`).

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/admin/tools` | GET, POST | List / create tools |
| `/api/admin/tools/[id]` | PUT, DELETE | Update / delete tool |
| `/api/admin/projects` | GET, POST | List / create projects |
| `/api/admin/projects/[id]` | PUT, DELETE | Update / delete project |
| `/api/admin/journal` | GET, POST | List / create posts |
| `/api/admin/journal/[id]` | PUT, DELETE | Update / delete post |
| `/api/contact` | POST | Contact form → email via Resend |
| `/api/newsletter` | POST | Subscribe → upsert subscriber + welcome email |
| `/api/reviews` | POST | Submit review → recalculate tool rating |

## Key Libraries

- **Next.js 16** — App Router, React 19, RSC data fetching
- **Prisma 7** — PostgreSQL ORM with `@prisma/adapter-pg`
- **TailwindCSS v4** — Utility-first CSS
- **shadcn/ui** — Component primitives via `tw-animate-css`
- **react-markdown + remark-gfm** — Markdown rendering (the "MDX" in MDXContent)
- **Framer Motion** — ScrollReveal animations
- **Lucide React** — Icon set
- **Sonner** — Toast notifications
- **Zod** — Schema validation for API inputs
- **Resend** — Transactional email (newsletter, contact)

## Scripts

- `scripts/auto_generate_post.py` — LLM-powered blog post generator (requires `NVIDIA_API_KEY`, uses `certifi` for SSL)
- `scripts/publish_drafts.py` — Move `published: true` drafts from drafts/ to posts/
- `scripts/weekly_digest.py` — Compile weekly newsletter digest
- `.github/workflows/auto_generate_post.yml` — CI workflow triggering post generation

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string |
| `ADMIN_USERNAME` | Basic auth for admin panel |
| `ADMIN_PASSWORD` | Basic auth for admin panel |
| `RESEND_API_KEY` | Email sending |
| `NVIDIA_API_KEY` | Post generation LLM |
| `NVIDIA_BASE_URL` | Custom LLM endpoint |
| `NVIDIA_MODEL` | Model name for generation |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for OG/metadata |

## Styling Conventions

- **Dark-first**: `<html class="dark">` in layout.tsx
- **CSS variables** in `globals.css` for theme (oklch color space)
- **Category accent colors**: `--cat-llms`, `--cat-vector-dbs`, etc.
- **Utility class system**: `cn()` from `tailwind-merge` + `clsx`
