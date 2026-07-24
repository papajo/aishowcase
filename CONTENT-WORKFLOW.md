# Content Workflow

This project has **two content pipelines** that feed the same pages. Understanding both is essential for adding or updating content.

---

## Pipeline 1: Markdown Files (git-tracked)

**Best for**: Drafting, editing offline, version-controlled content, development without a database.

### Writing a Blog Post

1. Create a file in `content/drafts/` with the naming convention:
   ```
   YYYYMMDD-HHMMSS-a-descriptive-slug.md
   ```
2. Add frontmatter:
   ```yaml
   ---
   title: "Your Post Title"
   date: "2026-07-23T10:00:00+00:00"
   published: false
   tags: "Tag1, Tag2, Tag3"
   ---
   ```
3. Write the body in Markdown below the frontmatter block.
4. When ready, set `published: true` in the frontmatter.
5. Run `python3 scripts/publish_drafts.py` to move the file to `content/posts/`.

Alternatively, write directly to `content/posts/` with `published: true`.

### Writing a Tool Entry

1. Create `content/tools/your-tool-slug.md`
2. Frontmatter fields:
   ```yaml
   ---
   name: "Tool Name"
   description: "One-line description"
   category: "LLMs"  # One of: LLMs, Vector DBs, Frameworks, Agents, IDEs, Deployment, Evaluation
   logoUrl: "https://..."
   websiteUrl: "https://..."
   rating: "4.5"
   reviewCount: "42"
   features: "Feature 1, Feature 2, Feature 3"
   tags: "LLM, Anthropic, Claude"
   featured: "true"
   ---
   ```
3. Body is the long-form review content.

### Writing a Project

1. Create `content/projects/your-project-slug.md`
2. Frontmatter fields:
   ```yaml
   ---
   title: "Project Title"
   description: "One-line description"
   techStack: "TypeScript, CrewAI, OpenAI, Next.js"
   tags: "Agents, Automation, CrewAI"
   githubUrl: "https://github.com/..."
   featured: "true"
   order: "1"
   ---
   ```
3. Body is the project detail content.

### Updating About Page

Edit `content/about.md` — the frontmatter populates the bio, skills, experience, and tech stack sections.

---

## Pipeline 2: Database (Prisma + PostgreSQL)

**Best for**: Admin panel CRUD, dynamic content, production editing via UI.

All management happens via `/admin` pages:
- `/admin/tools` — Add/edit/delete tools
- `/admin/projects` — Add/edit/delete projects
- `/admin/journal` — Add/edit/delete posts

These require Basic auth (configured via `ADMIN_USERNAME` / `ADMIN_PASSWORD` env vars).

---

## How They Merge

Every page that lists or displays content follows this pattern:

```typescript
// 1. Fetch from DB
let items = await prisma.model.findMany({ ... })

// 2. Fetch from markdown
const mdItems = getMarkdownItems()

// 3. Merge, deduping by slug
const seen = new Set(items.map(i => i.slug))
for (const md of mdItems) {
  if (!seen.has(md.slug)) {
    seen.add(md.slug)
    items.push({ id: `md-${md.slug}`, ...md })
  }
}

// 4. Sort and slice
items = items.sort(...).slice(0, N)
```

The `id` prefix `md-` distinguishes markdown-origin content from DB records. This means:
- A slug can only appear once via either source
- Markdown entries fill in when DB is unavailable or empty
- Admin panel only manages DB records (markdown files are edited directly)

---

## Auto-Generation Pipeline

The GitHub Action `.github/workflows/auto_generate_post.yml`:
1. Takes a topic via `workflow_dispatch` input
2. Calls `scripts/auto_generate_post.py`
3. The script calls an NVIDIA API Catalog (OpenAI-compatible) endpoint to generate content
4. Saves the result as a draft in `content/drafts/`
5. If `--publish true`, sets `published: true` in frontmatter
6. Commits and pushes the new file

**Trigger manually** via GitHub Actions → "Auto-Generate Posts" → provide topic.

### Local Usage

```bash
# Generate a draft
python3 scripts/auto_generate_post.py --topic "Deep Research tools comparison"

# Generate and publish immediately
python3 scripts/auto_generate_post.py --topic "Claude Code review" --publish true

# List existing titles (to check for duplicates)
python3 scripts/auto_generate_post.py --list
```

**Prerequisites**: The script requires `NVIDIA_API_KEY` to generate real content. Without it, it falls back to stub mode. The key is stored in `.env.local` — load it before running:

```bash
set -a && source .env.local && set +a
python3 scripts/auto_generate_post.py --topic "Your Topic" --publish true --force true
```

Or export directly:
```bash
export NVIDIA_API_KEY="nvapi-..."
python3 scripts/auto_generate_post.py --topic "Your Topic" --publish true --force true
```

---

## Pipeline 3: Drop Folder (Manual Posts)

**Best for**: Writing posts manually (or with external tools), then auto-publishing.

### How It Works

1. Drop `.md` files into `content/incoming/`
2. Optionally drop a hero image (`.webp`, `.png`, `.jpg`) with the same base name
3. Run the publish script or push to `main` — GitHub Action handles the rest

### Local Usage

```bash
# See what's waiting
python3 scripts/publish_incoming.py --list

# Validate without moving (dry run)
python3 scripts/publish_incoming.py --dry-run

# Publish all incoming posts
python3 scripts/publish_incoming.py
```

### GitHub Action

The `.github/workflows/publish-incoming.yml` workflow triggers on any push to `content/incoming/**` on `main`. It runs `publish_incoming.py` which:
- Validates frontmatter (title, date, tags required)
- Checks for duplicate titles
- Moves posts to `content/posts/`
- Moves hero images to `public/heroes/manual/`
- Commits and pushes → Vercel auto-deploys

### Required Frontmatter

```yaml
---
title: "Your Post Title"
date: "2026-07-24T10:00:00+00:00"
published: true
tags: "Tag1, Tag2, Tag3"
hero: optional-hero-filename.webp   # optional
---
```

### Hero Image Matching

The script looks for hero images in this order:
1. Explicit `hero:` field in frontmatter
2. Image with same base name as the `.md` file (e.g., `my-post.webp` for `my-post.md`)
3. Any image whose name partially matches the post slug

---

## Content Types Summary

| Type | DB Model | Markdown Dir | Frontmatter Required Fields |
|------|----------|-------------|-----------------------------|
| Post | `DailyPost` | `content/posts/` | title, date, published, tags |
| Tool | `Tool` | `content/tools/` | name, description, category, rating, reviewCount |
| Project | `Project` | `content/projects/` | title, description, techStack, tags |
| About | — | `content/about.md` | name, tagline, bio, skills, experience, techStack |

---

## Quick Reference: Adding Content

**New blog post (markdown):**
```bash
echo '---
title: "My New Post"
date: "2026-07-23T10:00:00+00:00"
published: true
tags: "AI, Tools"
---
Content here...' > "content/posts/$(date +%Y%m%d-%H%M%S)-my-new-post.md"
```

**New blog post (admin panel):**
Navigate to `/admin/journal/new` and fill the form.

**New tool (admin panel):**
Navigate to `/admin/tools/new`.
