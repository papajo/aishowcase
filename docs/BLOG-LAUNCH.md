# Blog Post + Hero Image Launch

How to publish a blog post with a hero image to `aishowcase.qzz.io`.

## Quick Reference

| Method | Command | Hero Image |
|--------|---------|------------|
| **Drop folder** (manual post) | Push `.md` + image to `content/incoming/` on `main` | Place alongside or reference in frontmatter |
| **Research pipeline** | `python3 scripts/research_and_post.py --topic "X" --publish` | Auto-generated |
| **Auto-generate** | `python3 scripts/auto_generate_post.py --topic "X" --publish true` | Auto-generated |
| **Admin panel** | Navigate to `/admin/journal/new` | Upload via UI |

All methods end the same way: **Vercel auto-deploys from `main` push**. No manual deploy needed.

---

## Method 1: Drop Folder (Recommended for Manual Posts)

The most common path. One command creates the file with correct frontmatter, opens your editor, and optionally pushes when done.

### Quick start

```bash
python3 scripts/new_post.py --title "Why AI Agents Fail" --tags "AI, Agents, Production"
```

This creates the file in `content/incoming/`, opens it in `$EDITOR`, and you just write the body. No frontmatter to type — date, slug, and required fields are all computed.

### With auto-push (fully automated)

```bash
python3 scripts/new_post.py -t "Why AI Agents Fail" -g "AI, Agents" --push
```

After you save and close the editor, it commits and pushes → Vercel auto-deploys.

### Flags

| Flag | Description |
|------|-------------|
| `-t`, `--title` | Post title (required) |
| `-g`, `--tags` | Comma-separated tags (required) |
| `--push` | Auto git add + commit + push after editing |
| `--draft` | Set `published: false` (default: true) |

### Step 2: Add a hero image (optional)

Three options, in order of preference:

**Option A — Custom image alongside the post:**
```bash
# Place in content/incoming/ with same base name
cp my-hero.webp content/incoming/my-post.webp    # matches my-post.md
```

**Option B — Reference in frontmatter:**
```yaml
---
hero: custom-image-name.webp
---
```
Then place `custom-image-name.webp` in `content/incoming/`.

**Option C — Skip (auto-generated fallback):**
If no hero image is provided, the site uses a topic-matched SVG illustration. You can generate an AI hero later with `python3 scripts/generate_heroes.py --slug my-post-slug`.

### Step 3: Publish

If you used `--push`, you're done — it already published.

Otherwise:
```bash
git add content/incoming/
git commit -m "New post: Your Post Title"
git push
```

The `publish-incoming.yml` GitHub Action runs `publish_incoming.py` which:
1. Validates frontmatter (title, date, tags required)
2. Moves the `.md` file to `content/posts/`
3. Moves the hero image to `public/heroes/manual/`
4. Commits and pushes → Vercel auto-deploys

**Option B — Run locally first (dry run):**
```bash
python3 scripts/publish_incoming.py --list       # see what's waiting
python3 scripts/publish_incoming.py --dry-run    # validate without moving
python3 scripts/publish_incoming.py              # process all incoming
```

### Frontmatter Reference

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | Post title |
| `date` | Yes | ISO 8601 datetime |
| `tags` | Yes | Comma-separated tags |
| `published` | No | `true` to publish immediately (default: false) |
| `hero` | No | Explicit hero image filename |
| `excerpt` | No | Short description for card previews |

---

## Method 2: Research Pipeline (Odysseus)

One command: researches a topic via Odysseus, writes the post, publishes it.

### Prerequisites
- Odysseus Docker running (`docker compose up` in the Odysseus repo)
- `NVIDIA_API_KEY` set

### Run it
```bash
ODYSSEUS_INTERNAL_TOKEN=dev-blog-integration-token \
python3 scripts/research_and_post.py \
  --topic "Your topic here" \
  --publish \
  --timeout 900
```

Then push:
```bash
git add -A && git commit -m "New post: Your topic" && git push
```

### Pull an existing Odysseus report
```bash
python3 scripts/pull_from_odysseus.py rp-<report-id> --publish
```

---

## Method 3: Auto-Generate

Uses NVIDIA API to generate content + hero image.

```bash
set -a && source .env.local && set +a
python3 scripts/auto_generate_post.py --topic "Your topic" --publish true
```

Then push to deploy.

---

## Hero Image System

Three tiers, highest priority first:

```
Manual > Auto-Generated > SVG Fallback
```

| Tier | Location | How to create |
|------|----------|---------------|
| Manual | `public/heroes/manual/{slug}.webp` | Place file directly |
| Auto-generated | `public/heroes/auto/{slug}.webp` | `python3 scripts/generate_heroes.py --slug <slug>` |
| SVG fallback | Rendered by `components/shared/TechnicalIllustrations.tsx` | Automatic (topic-matched) |

### Generate missing hero images
```bash
python3 scripts/generate_heroes.py --missing    # all posts without heroes
python3 scripts/generate_heroes.py --slug X     # specific post
python3 scripts/generate_heroes.py --list       # check status of all posts
```

Default provider is Pollinations.ai (free, no key needed).

---

## Deployment

- **Vercel auto-deploys from `main` push** — no manual `npx vercel --prod` needed
- `.vercel/project.json` links the repo
- Every push to `main` triggers a deploy at `aishowcase.qzz.io`

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Post not appearing | Check `published: true` in frontmatter. Check `python3 scripts/publish_incoming.py --list` |
| Hero image not showing | Verify file is in `public/heroes/manual/` or `public/heroes/auto/` with matching slug |
| GitHub Action didn't trigger | Must push to `main` branch, file must be in `content/incoming/` |
| Duplicate post error | Check existing titles: `python3 scripts/publish_incoming.py --list` |
| Hero mismatch (image exists but not used) | The script normalizes underscores/hyphens and uses word-overlap matching. Check slug similarity. |

---

**Evidence**: `CONTENT-WORKFLOW.md`, `docs/hero-images.md`, `scripts/WORKFLOW.md`, `scripts/publish_incoming.py`, `.github/workflows/publish-incoming.yml`, `scripts/generate_heroes.py`
