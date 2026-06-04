# Build Prompt — AI Showcase Platform

Use this prompt to scaffold and build the MVP of the AI Showcase platform.

---

## Primary Build Prompt

```
Build a full-stack AI developer showcase website using Next.js 14 (App Router), Tailwind CSS,
shadcn/ui components, PostgreSQL with Prisma ORM, and MDX for content. Deploy-ready for Vercel.

The site is a single-author portfolio + AI tools directory + daily journal. It should feel like
a polished developer blog meets product directory — think everydev.ai meets a personal portfolio.

### Design Requirements
- Dark mode by default, with light mode toggle
- Clean, minimal layout with excellent typography (Inter for body, JetBrains Mono for code)
- Sidebar navigation on desktop, bottom nav on mobile
- Responsive grid layouts for cards and project listings
- Smooth page transitions

### Pages to Build

1. **Homepage (/)**
   - Hero section: name, tagline, 2-3 sentence bio
   - Featured projects carousel/grid (3 latest)
   - Featured tools grid (6 latest reviewed)
   - Recent daily posts (5 latest)
   - Newsletter signup CTA

2. **AI Tools Directory (/tools)**
   - Grid of tool cards with: logo, name, category, rating stars, short description
   - Filter sidebar: by category (LLMs, Vector DBs, Frameworks, Agents, IDE, etc.)
   - Search bar with debounced search
   - Sort: newest, highest rated, most reviewed
   - Individual tool pages (/tools/[slug]):
     - Hero: logo, name, description, rating, visit site button
     - Features list, pricing info
     - Pros/cons from reviews
     - User reviews section
     - Related tools

3. **Projects Showcase (/projects)**
   - Grid of project cards: thumbnail, title, description, tech stack pills, tags
   - Individual project pages (/projects/[slug]):
     - Hero: title, description, tech stack, GitHub + live demo links
     - Full MDX content with code blocks, images, architecture diagrams
     - Related projects sidebar

4. **Daily AI Log (/journal)**
   - Timeline view of daily posts (date, title, tags, excerpt)
   - Individual post pages (/journal/[slug]):
     - Published date, reading time estimate
     - MDX content with markdown rendering
     - Tags shown as colored pills

5. **About / Skills (/about)**
   - Profile photo + bio
   - Skills matrix (visual bars or tags)
   - Experience timeline
   - Social links (GitHub, LinkedIn, Twitter/X)
   - Contact form or email link

6. **Contact (/contact)**
   - Simple form: name, email, message
   - Social links section

### Data Layer (Prisma Schema)

Create these models:

- Tool: id, name, slug, description, longDescription, category, logoUrl, websiteUrl, rating (Float), reviewCount (Int), features (JSON), pricing (JSON), featured (Boolean), createdAt, updatedAt
- Review: id, toolId, rating (Int), content, pros (String[]), cons (String[]), authorName, createdAt
- Project: id, title, slug, description, thumbnailUrl, techStack (String[]), tags (String[]), githubUrl, liveUrl, content (MDX string), featured (Boolean), order (Int), createdAt, updatedAt
- DailyPost: id, title, slug, excerpt, content (MDX string), tags (String[]), publishedAt, createdAt, updatedAt
- NewsletterSubscriber: id, email, subscribedAt, active (Boolean)

### Seed Data
- 12 AI tools across categories (OpenAI, Anthropic, Pinecone, LangChain, CrewAI, Cursor, etc.)
- 3 sample projects
- 5 sample daily posts
- Sample reviews for each tool

### Components to Build
- Navigation (sidebar + mobile bottom nav)
- ToolCard, ProjectCard, PostCard
- RatingStars (interactive display)
- SearchInput (debounced)
- FilterSidebar
- MDXRenderer (with custom components for code blocks, callouts, images)
- NewsletterSignup
- ThemeToggle
- Footer
- TagPill, TechStackBadge

### Tech Requirements
- Use MDX files in /content directory for projects and journal posts
- Client-side filtering and search for tools
- ISR (Incremental Static Regeneration) for tool and project pages
- Sitemap generation
- Open Graph meta tags for social sharing
- Favicon and app icons

### Code Style
- TypeScript strict mode
- Server Components by default, Client Components only when needed (interactivity)
- Proper error boundaries and loading states
- Accessible markup (semantic HTML, ARIA labels)
```

---

## Seed Content Prompt

```
Generate realistic seed content for an AI developer portfolio:

1. **12 AI Tools** with:
   - Real tool names and descriptions
   - Categories: LLMs, Vector DBs, Agent Frameworks, IDEs, Deployment, Evaluation
   - Pricing tiers
   - Feature lists
   - 2-3 reviews each with ratings, pros/cons

2. **3 Projects** with:
   - Realistic project names (e.g., "RAG Pipeline for Documentation", "Multi-Agent Research Assistant", "AI Code Review Bot")
   - Tech stacks using real tools
   - MDX content with architecture descriptions, code snippets, lessons learned

3. **5 Daily Posts** with:
   - Titles like "Trying out CrewAI for multi-agent workflows", "Building a RAG pipeline with Pinecone"
   - Short-form content (200-400 words)
   - Tags

Format everything as ready-to-insert Prisma seed data.
```

---

## Design System Prompt

```
Create a design system for a dark-themed developer portfolio site:

Colors:
- Background: near-black (#0a0a0a)
- Surface: dark gray (#1a1a1a)  
- Border: subtle gray (#2a2a2a)
- Primary: electric blue (#3b82f6)
- Secondary: violet (#8b5cf6)
- Accent: emerald (#10b981)
- Text: white (#fafafa)
- Muted: gray (#888888)

Typography:
- Headings: Inter, bold, tracking-tight
- Body: Inter, normal
- Code: JetBrains Mono
- Base size: 16px, scale 1.25

Spacing: 4px base unit
Border radius: 8px for cards, 6px for buttons, 4px for inputs
Shadows: subtle, layered (sm, md, lg)

Generate Tailwind CSS config and base component styles.
```
