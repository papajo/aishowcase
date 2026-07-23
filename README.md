# AI Showcase

A curated directory of AI tools, projects, and a journal — built with Next.js 16 (App Router), Prisma + PostgreSQL, and a fallback Markdown content layer.

## Quick Start

```bash
pnpm install
cp .env.example .env.local   # fill in DATABASE_URL, ADMIN_USERNAME, ADMIN_PASSWORD
pnpm prisma migrate dev      # set up PostgreSQL schema
pnpm dev                     # → http://localhost:3000
```

## Project Map

| Directory | Purpose |
|-----------|---------|
| `app/api/` | Route handlers (admin CRUD, contact, newsletter, reviews) |
| `app/admin/` | Admin panel pages (tools, projects, journal management) |
| `components/` | React components — ui/, shared/, layout/, tools/, projects/, journal/ |
| `lib/` | Utilities — db, admin auth, schemas, markdown helpers, mail |
| `content/` | Markdown files — posts/, drafts/, tools/, projects/, about.md |
| `scripts/` | Python tools — auto-generate posts, publish drafts |
| `prisma/` | Schema + migrations |

## Key Concepts

- **Hybrid data layer** — content from both PostgreSQL and local Markdown files, merged by slug
- **Admin panel** — Basic auth-protected CRUD at `/admin/` for tools, projects, and journal posts
- **Auto-generation** — GitHub Action + Python script produces blog posts via OpenAI-compatible LLMs
- **Dark-first** — dark mode default with shadcn/ui, oklch color space, TailwindCSS v4

## Documentation

- **[ARCHITECTURE.md](ARCHITECTURE.md)** — Full system design, route map, component tree, data flow
- **[CONTENT-WORKFLOW.md](CONTENT-WORKFLOW.md)** — How to add/edit content through both pipelines

## Tech Stack

Next.js 16 · Prisma 7 · PostgreSQL · TailwindCSS v4 · shadcn/ui · Framer Motion · Resend · Zod · react-markdown
