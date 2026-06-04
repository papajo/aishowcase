# Product Requirements Document (PRD)
## AI Showcase — Developer Portfolio & Community Platform

**Version:** 1.0
**Date:** June 2026
**Author:** AI Assistant
**Status:** Draft

---

## 1. Executive Summary

Build a personal AI showcase platform inspired by [everydev.ai](https://www.everydev.ai/) that enables an AI developer to document, showcase, and share their AI projects, skills, and daily insights. The platform serves as both a portfolio and a lightweight community hub for AI builders.

---

## 2. Problem Statement

As an AI developer, there is no single place to:
- Showcase AI projects with context (tools used, architecture, results)
- Track daily AI experiments, learnings, and skill progression
- Share tools, techniques, and workflows with the community
- Demonstrate expertise to employers or collaborators

Existing solutions (GitHub, personal blogs, LinkedIn) are fragmented and don't combine portfolio + community + daily writing in one cohesive experience.

---

## 3. Goals & Success Metrics

| Goal | Metric | Target |
|------|--------|--------|
| Showcase AI projects | Projects published | 10+ in first month |
| Build community | Monthly active visitors | 500+ by month 3 |
| Establish authority | Newsletter subscribers | 200+ by month 3 |
| Track daily learning | Posts per week | 3-5 per week |
| Attract collaborators | Contact form submissions | 5+ per month |

---

## 4. User Personas

### Persona 1: The AI Builder (Primary)
- **Who:** Individual AI developer showcasing work
- **Needs:** Portfolio, daily writing, project documentation
- **Pain:** No unified platform for AI portfolio + content

### Persona 2: The AI Enthusiast (Visitor)
- **Who:** Developer exploring AI tools and techniques
- **Needs:** Discover tools, read guides, learn from real projects
- **Pain:** Marketing-heavy AI content lacks authenticity

### Persona 3: The Recruiter/Collaborator
- **Who:** Hiring manager or potential collaborator
- **Needs:** Evaluate skills, see real projects, assess depth
- **Pain:** Resume doesn't show actual AI competency

---

## 5. Features

### 5.1 Core Features (Phase 1 — MVP)

#### 5.1.1 AI Tools Directory
- Curated list of AI tools the user has tested
- Each tool: name, description, category, rating, pros/cons, use cases
- Filter by category (LLMs, vector DBs, frameworks, agents, etc.)
- Search functionality

#### 5.1.2 Project Showcase ("Builds")
- Project cards with title, description, tech stack, screenshots
- Full project pages with architecture diagrams, code snippets, lessons learned
- Link to GitHub repo / live demo
- Tags: LLM, RAG, Agents, Fine-tuning, etc.

#### 5.1.3 Daily AI Log / Journal
- Short-form daily posts about AI experiments, learnings, tools tried
- Markdown support
- Taggable by topic
- Timeline view

#### 5.1.4 About / Skills Page
- Developer profile with bio, photo, links
- Skill matrix (LLMs, Python, ML, RAG, Agents, etc.)
- Experience timeline
- Links to socials (GitHub, LinkedIn, Twitter)

### 5.2 Community Features (Phase 2)

#### 5.2.1 Discussions
- Threaded discussions on AI topics
- Markdown support
- Upvoting system

#### 5.2.2 Tool Reviews
- Users can review tools in the directory
- Star ratings + written reviews
- Review aggregation per tool

#### 5.2.3 Newsletter
- Email capture form
- Weekly digest of posts
- Integration with email service (Resend, Mailchimp, etc.)

### 5.3 Advanced Features (Phase 3)

#### 5.3.1 Tools Arena (AI-vs-AI)
- Two AI models answer a tool question side-by-side
- Community voting on best answer
- Fun, interactive engagement driver

#### 5.3.2 Tool Comparison
- Side-by-side comparison of any two tools
- Pricing, features, community ratings
- Pre-made comparison pages for popular pairings

#### 5.3.3 Learning Paths
- Curated educational content grouped by topic
- "Start here" guides for AI beginners

---

## 6. Technical Requirements

### 6.1 Stack Decision

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Frontend | Next.js 14+ (App Router) | SSR/SSG, fast, SEO-friendly |
| Styling | Tailwind CSS + shadcn/ui | Rapid UI, consistent design |
| Database | PostgreSQL + Prisma | Relational data, type-safe ORM |
| Auth | NextAuth.js | Simple, extensible |
| Hosting | Vercel | Zero-config for Next.js |
| CMS (optional) | Sanity or MDX files | For structured content |
| AI Integration | OpenAI API / Anthropic | For Tools Arena feature |
| Email | Resend / React Email | Newsletter delivery |

### 6.2 Non-Functional Requirements
- **Performance:** Lighthouse score > 90
- **SEO:** Full SSR, structured data, sitemap, robots.txt
- **Mobile:** Fully responsive design
- **Accessibility:** WCAG 2.1 AA
- **Security:** CSRF protection, input sanitization, rate limiting
- **Analytics:** Vercel Analytics + Plausible (privacy-friendly)

### 6.3 Data Model (Simplified)

```
Tool
  - id, name, slug, description, category, logo, url
  - rating (avg), reviewCount
  - features: JSON
  - pricing: JSON
  - createdAt, updatedAt

Review
  - id, toolId, userId, rating, content, pros, cons
  - createdAt

Project
  - id, title, slug, description, techStack[]
  - screenshots[], githubUrl, liveUrl
  - tags[], content (MDX)
  - featured, createdAt

DailyPost
  - id, slug, title, content (MDX)
  - tags[]
  - publishedAt

NewsletterSubscriber
  - id, email, subscribedAt

Discussion
  - id, title, content, authorId
  - replies[], upvotes
  - createdAt
```

---

## 7. Content Strategy

### 7.1 Content Types
1. **Build Showcases** — "Here's what I built this week with [tool]"
2. **Tool Reviews** — "I tried [tool] for 2 weeks, here's what happened"
3. **Daily Logs** — "Today I learned..."
4. **Deep Dives** — "How I built X: architecture, decisions, and code"
5. **Comparisons** — "Tool A vs Tool B for [use case]"

### 7.2 SEO Strategy
- Target: "AI tools for [use case]", "best [category] tools 2026"
- Each tool page = long-form SEO content
- Programmatic pages for tool comparisons
- Blog posts targeting long-tail keywords

---

## 8. Design Principles

1. **Clean & Fast** — No bloat, instant page loads
2. **Developer-first** — Dark mode, monospace accents, code-friendly
3. **Content-driven** — Typography and readability over flashy animations
4. **Mobile-native** — Works beautifully on phones
5. **Progressive disclosure** — Simple entry, deep content on demand

---

## 9. Competitive Differentiation

| Feature | EveryDev | GitHub | Personal Blog | **This Project** |
|---------|----------|--------|---------------|------------------|
| Tool directory | Yes | No | No | Yes |
| Project showcase | Partial | Yes (repos) | No | Yes (richer) |
| Daily journal | No | No | Yes | Yes |
| Community | Yes | No | No | Yes (Phase 2) |
| AI-powered features | Yes | No | No | Yes (Phase 3) |
| Personal branding | Weak | Weak | Strong | **Strong** |

---

## 10. Timeline

| Phase | Duration | Deliverables |
|-------|----------|-------------|
| Phase 1: MVP | 2-3 weeks | Core site, tools, projects, about |
| Phase 2: Community | 2 weeks | Discussions, reviews, newsletter |
| Phase 3: AI Features | 2-3 weeks | Arena, comparisons, learning |
| Phase 4: Polish & Launch | 1 week | SEO, analytics, performance |

---

## 11. Out of Scope (v1)

- User registration (single-author initially)
- E-commerce / paid tools
- Mobile app
- Real-time notifications
- Multi-language support

---

## 12. Open Questions

1. Will this be single-author or multi-user? (Recommend single-author for v1)
2. Domain name preference?
3. Existing content to migrate?
4. Preferred color scheme / branding?
5. Do we need a CMS or are MDX files sufficient?
