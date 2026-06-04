# Implementation Plan

## Overview

This plan breaks the AI Showcase project into concrete, executable tasks organized by phase. Each task has a clear deliverable and can be completed in 1-4 hours.

---

## Phase 1: Foundation (Days 1-3)

### 1.1 Project Setup
- [ ] Initialize Next.js 14 project with TypeScript, Tailwind, App Router
- [ ] Install and configure shadcn/ui
- [ ] Set up Prisma with PostgreSQL (use Neon for dev)
- [ ] Configure ESLint, Prettier, TypeScript strict mode
- [ ] Set up `.env.local` with database URL
- [ ] Create `prisma/schema.prisma` with all models
- [ ] Run initial migration: `npx prisma migrate dev`
- [ ] Create seed script with sample data

### 1.2 Design System
- [ ] Configure Tailwind with custom dark theme colors
- [ ] Set up fonts: Inter (body), JetBrains Mono (code)
- [ ] Create base CSS with design tokens
- [ ] Build or import shadcn/ui components: Button, Card, Input, Badge, Dialog

### 1.3 Layout & Navigation
- [ ] Build root layout (`app/layout.tsx`) — sidebar, header, footer
- [ ] Create Sidebar component with nav links
- [ ] Create MobileNav component (bottom tabs)
- [ ] Build ThemeToggle component (dark/light)
- [ ] Build Footer component

---

## Phase 2: Content Pages (Days 4-7)

### 2.1 Homepage
- [ ] Build Hero section (name, tagline, bio)
- [ ] Build Featured Projects section (latest 3 project cards)
- [ ] Build Featured Tools section (latest 6 tool cards)
- [ ] Build Recent Posts section (latest 5 journal entries)
- [ ] Build Newsletter CTA section

### 2.2 AI Tools Directory
- [ ] Build `/tools` page with grid layout
- [ ] Create ToolCard component (logo, name, rating, category, description)
- [ ] Implement ToolSearch component (debounced search input)
- [ ] Implement ToolFilters component (category filter sidebar)
- [ ] Add sort functionality (newest, rating, most reviewed)
- [ ] Build `/tools/[slug]` detail page
  - [ ] Tool hero (logo, name, rating, visit button)
  - [ ] Features & pricing display
  - [ ] Pros/cons from reviews
  - [ ] Reviews section with ReviewCard
  - [ ] Related tools grid

### 2.3 Projects Showcase
- [ ] Build `/projects` page with card grid
- [ ] Create ProjectCard component (thumbnail, title, tech stack, tags)
- [ ] Build `/projects/[slug]` detail page
  - [ ] Project hero (title, tech stack, GitHub/demo links)
  - [ ] MDX content rendering with custom components
  - [ ] Related projects sidebar
- [ ] Set up MDX compilation with custom components (code blocks, callouts, images)

### 2.4 Daily Journal
- [ ] Build `/journal` page with timeline layout
- [ ] Create PostCard component (date, title, tags, excerpt)
- [ ] Build `/journal/[slug]` detail page
  - [ ] Post header (date, reading time)
  - [ ] MDX content rendering
  - [ ] Tags display

### 2.5 About Page
- [ ] Build `/about` page
- [ ] Profile photo + bio section
- [ ] Skills matrix display
- [ ] Experience timeline
- [ ] Social links (GitHub, LinkedIn, Twitter)

### 2.6 Contact Page
- [ ] Build `/contact` page
- [ ] Contact form (name, email, message)
- [ ] Form validation with Zod
- [ ] API route for form submission (`/api/contact`)

---

## Phase 3: Database & API (Days 8-9)

### 3.1 Database Operations
- [ ] Create Prisma client singleton (`lib/db.ts`)
- [ ] Build data fetching functions:
  - [ ] `getTools()` — all tools with filtering
  - [ ] `getToolBySlug()` — single tool with reviews
  - [ ] `getProjects()` — all projects
  - [ ] `getProjectBySlug()` — single project with MDX
  - [ ] `getPosts()` — all journal posts
  - [ ] `getPostBySlug()` — single post with MDX
- [ ] Implement ISR (revalidate: 3600) for content pages

### 3.2 API Routes
- [ ] `POST /api/newsletter` — subscribe email
- [ ] `POST /api/reviews` — submit tool review
- [ ] `POST /api/contact` — send contact message
- [ ] Input validation with Zod on all routes
- [ ] Rate limiting middleware

### 3.3 Content Management
- [ ] Set up MDX processing pipeline (`lib/mdx.ts`)
- [ ] Create custom MDX components:
  - [ ] Code blocks with syntax highlighting
  - [ ] Callout/admonition blocks
  - [ ] Image with caption
  - [ ] Custom heading anchors
- [ ] Create seed data with 12 tools, 3 projects, 5 posts

---

## Phase 4: Polish & SEO (Days 10-11)

### 4.1 SEO
- [ ] Add metadata to all pages (title, description, OG tags)
- [ ] Generate `sitemap.xml` with `next-sitemap`
- [ ] Create `robots.txt`
- [ ] Add structured data (JSON-LD) for articles and tools
- [ ] Add canonical URLs

### 4.2 Performance
- [ ] Optimize images with `next/image`
- [ ] Add loading states and skeletons
- [ ] Implement error boundaries
- [ ] Code-split heavy components
- [ ] Run Lighthouse audit and fix issues

### 4.3 Accessibility
- [ ] Add ARIA labels to interactive elements
- [ ] Ensure keyboard navigation works
- [ ] Test with screen reader (VoiceOver/NVDA)
- [ ] Fix color contrast issues
- [ ] Add skip-to-content link

### 4.4 Animations
- [ ] Page transition animations (Framer Motion or CSS)
- [ ] Card hover effects
- [ ] Stagger animations for grid items
- [ ] Smooth scroll for anchor links

---

## Phase 5: Deploy & Launch (Day 12)

### 5.1 Deployment
- [ ] Push to GitHub repository
- [ ] Connect to Vercel
- [ ] Set up Vercel Postgres or Neon database
- [ ] Configure environment variables in Vercel
- [ ] Run production build and verify
- [ ] Set up custom domain

### 5.2 Analytics & Monitoring
- [ ] Add Vercel Analytics
- [ ] Add Plausible Analytics (privacy-friendly)
- [ ] Set up error tracking (Sentry or Vercel's built-in)
- [ ] Monitor Core Web Vitals

### 5.3 Content
- [ ] Write first 5 real blog posts / journal entries
- [ ] Add 10 real AI tools with reviews
- [ ] Create 3 real project showcases
- [ ] Set up newsletter (Resend / Mailchimp)

---

## Dependency Graph

```
Phase 1.1 (Setup) ─────────────────┐
Phase 1.2 (Design System) ─────────┤
                                    ▼
Phase 1.3 (Layout) ────────────────┤
                                    ▼
Phase 2.1 (Homepage) ◄─────────────┤
Phase 2.2 (Tools) ◄────────────────┤
Phase 2.3 (Projects) ◄─────────────┤
Phase 2.4 (Journal) ◄──────────────┤
Phase 2.5 (About) ◄────────────────┤
Phase 2.6 (Contact) ◄──────────────┤
                                    ▼
Phase 3.1 (Database) ◄─────────────┤
Phase 3.2 (API Routes) ◄───────────┤
Phase 3.3 (Content Pipeline) ◄─────┤
                                    ▼
Phase 4.1 (SEO) ◄──────────────────┤
Phase 4.2 (Performance) ◄──────────┤
Phase 4.3 (Accessibility) ◄────────┤
Phase 4.4 (Animations) ◄───────────┤
                                    ▼
Phase 5.1 (Deploy) ◄───────────────┘
Phase 5.2 (Analytics)
Phase 5.3 (Content)
```

---

## Estimated Timeline

| Phase | Duration | Cumulative |
|-------|----------|-----------|
| Phase 1: Foundation | 3 days | Day 3 |
| Phase 2: Content Pages | 4 days | Day 7 |
| Phase 3: Database & API | 2 days | Day 9 |
| Phase 4: Polish & SEO | 2 days | Day 11 |
| Phase 5: Deploy & Launch | 1 day | Day 12 |

**Total: ~12 working days (2-3 weeks with breaks)**

---

## Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Scope creep | High | Stick to Phase 1 MVP, iterate later |
| Performance issues | Medium | ISR from day one, optimize early |
| Content quality | Medium | Seed with realistic data, refine later |
| Deployment issues | Low | Vercel is reliable, test locally first |
| Design iteration | Medium | Use shadcn/ui defaults, customize later |
