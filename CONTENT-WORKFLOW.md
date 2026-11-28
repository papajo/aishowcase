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

**Prerequisites**: The script requires `NVIDIA_API_KEY` to generate real content. Without it, it now refuses to run (unless `--allow-stub true` is passed for a local test draft) — a scheduled run without a key used to write "Stub content" drafts (June 2026).

### Scheduled Posting

See `docs/AUTO-POSTING-PLAN.md` for the full plan. The short version:
`.github/workflows/scheduled-post.yml` runs Mon/Wed/Fri 09:00 EST, picks
the next topic from `content/topics-queue.md`, generates with
`auto_generate_post.py`, checks the post (no stubs, ≥150 words, every
reference link resolves), and only then marks the topic used and
commits. Draft mode is the default — a generated post lands in
`content/drafts/` for a one-tap publish; full auto-publish is a
one-word flip once it is explicitly approved.

### Local Usage

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

## Pipeline 3: Drop Folder (Manual Posts) — the default since 2026-11-27

**Best for**: Posts written by hand (Muse drafts, joshi reviews, or written in
Claude/ChatGPT). The Mon/Wed/Fri LLM generator is turned off.

### How It Works

1. Pick the next unchecked topic in `content/topics-queue.md` and write the post.
2. Drop the `.md` file into `content/incoming/` (name it
   `YYYYMMDD-HHMMSS-short-slug.md`). Optionally add a hero image with the same
   base name (warm theme only — see docs/hero-images.md).
3. Push to `main`. The `publish-incoming.yml` workflow:
   - validates frontmatter (title, date, tags required) and rejects duplicate titles
     (checks both posts and drafts)
   - runs `scripts/check_post_links.py` (no stub markers, ≥150 words, every link alive)
   - moves the post to **`content/drafts/`** with `published: false` — **not live**
   - moves any hero image to `public/heroes/manual/`
   - commits the move (including removing the file from `content/incoming/`) and pushes
   - leaves any rejected post in `content/incoming/` and marks the run failed
4. Review the draft. To publish it, set `published: true` and run
   `python3 scripts/publish_drafts.py` (moves it to `content/posts/`), commit, push.
   Vercel deploys on push.

To skip review on purpose, use "Run workflow" on Publish Incoming Posts with
`publish = true`, or run the script locally with `--publish`.

### Local Usage

```bash
python3 scripts/publish_incoming.py --list                  # what's waiting
python3 scripts/publish_incoming.py --dry-run               # validate only
python3 scripts/publish_incoming.py --check-links           # incoming -> drafts
python3 scripts/publish_incoming.py --check-links --publish # incoming -> posts (live)
python3 scripts/publish_incoming.py --git                   # also commit + push (old behaviour)
```

### Required Frontmatter

```yaml
---
title: "Your Post Title"
date: "2026-07-24T10:00:00+00:00"
published: false   # forced to false on the way to drafts
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
