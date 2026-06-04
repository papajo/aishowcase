# Architecture Design

## System Overview

```
┌─────────────────────────────────────────────────────┐
│                    Client (Browser)                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │
│  │ Next.js  │  │ shadcn/  │  │ Theme Provider   │   │
│  │ App      │  │ UI       │  │ (dark/light)     │   │
│  │ Router   │  │          │  │                  │   │
│  └──────────┘  └──────────┘  └──────────────────┘   │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP / RSC
┌──────────────────────▼──────────────────────────────┐
│                  Vercel Edge Network                  │
│  ┌──────────────────────────────────────────────┐    │
│  │              Next.js Server                   │    │
│  │  ┌────────────┐  ┌────────────────────────┐  │    │
│  │  │ Pages/     │  │ API Routes             │  │    │
│  │  │ Layouts    │  │ /api/newsletter        │  │    │
│  │  │            │  │ /api/reviews           │  │    │
│  │  │ Server     │  │ /api/contact           │  │    │
│  │  │ Components │  │ /api/arena (Phase 3)   │  │    │
│  │  └────────────┘  └────────────────────────┘  │    │
│  └──────────────────────────────────────────────┘    │
└──────────────────────┬──────────────────────────────┘
                       │
          ┌────────────┼────────────┐
          │            │            │
    ┌─────▼─────┐ ┌────▼────┐ ┌────▼─────┐
    │ Prisma    │ │ MDX     │ │ Vercel   │
    │ Client    │ │ Content │ │ KV/Redis │
    └─────┬─────┘ │ Files   │ │ (cache)  │
          │       └─────────┘ └──────────┘
    ┌─────▼─────┐
    │PostgreSQL │
    │ (Neon/    │
    │  Supabase)│
    └───────────┘
```

---

## Directory Structure

```
ai-showcase/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout (nav, theme, footer)
│   ├── page.tsx                 # Homepage
│   ├── globals.css              # Global styles
│   │
│   ├── tools/                   # AI Tools Directory
│   │   ├── page.tsx            # /tools — listing page
│   │   ├── [slug]/
│   │   │   └── page.tsx        # /tools/[slug] — tool detail
│   │   └── compare/
│   │       └── page.tsx        # /tools/compare (Phase 3)
│   │
│   ├── projects/                # Project Showcase
│   │   ├── page.tsx            # /projects — listing page
│   │   └── [slug]/
│   │       └── page.tsx        # /projects/[slug] — project detail
│   │
│   ├── journal/                 # Daily AI Log
│   │   ├── page.tsx            # /journal — timeline view
│   │   └── [slug]/
│   │       └── page.tsx        # /journal/[slug] — post detail
│   │
│   ├── about/
│   │   └── page.tsx            # /about
│   │
│   ├── contact/
│   │   └── page.tsx            # /contact
│   │
│   └── api/                     # API Routes
│       ├── newsletter/
│       │   └── route.ts        # Subscribe to newsletter
│       ├── reviews/
│       │   └── route.ts        # Submit tool review
│       └── contact/
│           └── route.ts        # Contact form submission
│
├── components/                   # Shared Components
│   ├── ui/                      # shadcn/ui primitives
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── badge.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   │
│   ├── layout/                  # Layout components
│   │   ├── Sidebar.tsx          # Desktop sidebar nav
│   │   ├── MobileNav.tsx        # Mobile bottom nav
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   │
│   ├── tools/                   # Tool-related components
│   │   ├── ToolCard.tsx
│   │   ├── ToolFilters.tsx
│   │   ├── ToolSearch.tsx
│   │   ├── RatingStars.tsx
│   │   └── ReviewCard.tsx
│   │
│   ├── projects/                # Project-related components
│   │   ├── ProjectCard.tsx
│   │   └── TechStack.tsx
│   │
│   ├── journal/                 # Journal components
│   │   ├── PostCard.tsx
│   │   └── Timeline.tsx
│   │
│   └── shared/                  # Shared components
│       ├── MDXContent.tsx       # MDX renderer
│       ├── NewsletterSignup.tsx
│       ├── ThemeToggle.tsx
│       ├── TagPill.tsx
│       └── ProseLayout.tsx      # Markdown typography
│
├── content/                      # MDX Content (source of truth)
│   ├── projects/
│   │   ├── rag-pipeline.mdx
│   │   ├── multi-agent-research.mdx
│   │   └── ai-code-review-bot.mdx
│   │
│   └── journal/
│       ├── 2026-06-01-crewai.mdx
│       ├── 2026-06-02-rag-pipeline.mdx
│       └── ...
│
├── lib/                          # Utility functions
│   ├── db.ts                    # Prisma client singleton
│   ├── mdx.ts                   # MDX parsing utilities
│   ├── tools.ts                 # Tool data helpers
│   ├── projects.ts              # Project data helpers
│   └── newsletter.ts            # Newsletter helpers
│
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── seed.ts                  # Seed data script
│
├── public/
│   ├── images/
│   ├── favicon.ico
│   └── og-image.png
│
├── styles/
│   └── globals.css              # Tailwind base + custom styles
│
├── tailwind.config.ts
├── next.config.mjs
├── tsconfig.json
├── package.json
└── .env.local
```

---

## Data Flow

### Tool Listing Page
```
1. User visits /tools
2. Server Component queries Prisma for all tools (ISR, revalidate: 3600)
3. Tools rendered as ToolCard grid
4. Client Component handles:
   - Search filtering (client-side with useMemo)
   - Category filtering (client-side state)
   - Sort selection (client-side state)
```

### Tool Detail Page
```
1. User visits /tools/openai
2. generateStaticParams() pre-builds top 20 tools
3. Server Component queries:
   - Tool by slug (including features, pricing)
   - Reviews for this tool
   - Related tools (same category, exclude current)
4. Renders: hero, features, pros/cons, reviews, related
```

### Project Detail Page
```
1. User visits /projects/rag-pipeline
2. Server Component reads MDX from /content/projects/rag-pipeline.mdx
3. MDX compiled with custom components (code blocks, callouts, images)
4. Combined with project metadata from Prisma
5. Full project page rendered
```

### Newsletter Signup
```
1. User enters email in NewsletterSignup component
2. Client-side POST to /api/newsletter
3. API route validates email, inserts into NewsletterSubscriber
4. Returns success/error response
5. Client shows toast notification
```

---

## Deployment Architecture

```
┌─────────────────────────────────────────┐
│               Vercel                      │
│  ┌─────────────────────────────────┐     │
│  │  Next.js App (Edge Functions)   │     │
│  └──────────┬──────────────────────┘     │
│             │                            │
│  ┌──────────▼──────────────────────┐     │
│  │  Vercel KV (Redis)              │     │
│  │  - Session cache                │     │
│  │  - ISR cache                    │     │
│  │  - Rate limiting                │     │
│  └─────────────────────────────────┘     │
└─────────────────────┬───────────────────┘
                      │
              ┌───────▼────────┐
              │  Neon Postgres  │
              │  (Serverless)   │
              └─────────────────┘
```

### Why This Stack?
- **Next.js + Vercel**: Zero-config deployment, edge functions, ISR
- **Neon Postgres**: Serverless, scales to zero, generous free tier
- **Prisma**: Type-safe DB queries, migration system
- **shadcn/ui**: Copy-paste components, full control, no runtime
- **MDX**: Markdown + JSX for rich content, version-controlled

---

## Performance Targets

| Metric | Target | Strategy |
|--------|--------|----------|
| LCP | < 2.5s | ISR, image optimization, font preloading |
| FID | < 100ms | Server Components, minimal client JS |
| CLS | < 0.1 | Fixed dimensions, font-display: swap |
| TTI | < 3s | Code splitting, lazy loading below fold |
| Bundle Size | < 200KB initial | Tree shaking, dynamic imports |

---

## Security Considerations

1. **Input Validation**: Zod schemas for all API inputs
2. **Rate Limiting**: Vercel KV-based rate limiting on API routes
3. **CSRF**: SameSite cookies, origin checking
4. **SQL Injection**: Prisma parameterized queries (built-in)
5. **XSS**: React auto-escaping + MDX sanitization
6. **Headers**: Security headers in next.config.mjs

---

## Future Considerations

- **Auth**: NextAuth.js when adding multi-user support
- **Search**: Algolia/Meilisearch when content grows
- **AI Features**: OpenAI API for Tools Arena (Phase 3)
- **Edge**: Vercel Edge Runtime for geo-distributed API
- **Caching**: ISR + stale-while-revalidate for content pages
