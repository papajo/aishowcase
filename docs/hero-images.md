# Hero Image Pipeline

Every blog post gets a hero banner. Three tiers, in priority order:

```
Manual > Auto-Generated > SVG Illustration (fallback)
```

---

## Tier 1: Manual (Highest Priority)

Place a `{slug}.webp` file in `public/heroes/manual/`. It immediately overrides anything auto-generated.

**Example** — to use a custom image for a specific post:

```bash
# Copy or symlink into the manual folder
ln -s /path/to/your/image.webp public/heroes/manual/the-post-slug.webp

# Or symlink one image for multiple posts
ln -s cybersecurity_hud.webp public/heroes/manual/20260723-131213-openai-and-hugging-face-investigate-autonomous-ai-hack.webp
```

This is your safety valve — you can always hand-craft an image and override the automation.

---

## Tier 2: Auto-Generated (Default)

Run `scripts/generate_heroes.py`. It reads every post in `content/posts/`, detects the topic from title/tags/excerpt, generates a descriptive prompt, and sends it to an AI image API.

### Quick Start

```bash
# Generate for all posts that don't have a hero yet
python3 scripts/generate_heroes.py --missing

# Generate for all posts (even if they already have one)
python3 scripts/generate_heroes.py --force

# Generate for a single post
python3 scripts/generate_heroes.py --slug some-post-slug

# Preview prompts without generating
python3 scripts/generate_heroes.py --prompt some-post-slug
```

### Providers

| Provider       | Flag              | Cost       | API Key Needed        |
|----------------|-------------------|------------|-----------------------|
| Pollinations.ai | `--provider pollinations` | Free     | None                  |
| DALL·E 3        | `--provider dalle3`       | ~$0.04/img | `NVIDIA_API_KEY` (or `OPENAI_API_KEY`) |
| Stability AI   | `--provider stability`    | ~$0.04/img | `STABILITY_API_KEY`   |

**Default is Pollinations.ai** — free, no key needed, uses Flux model.

### Topic Detection

The script maps post content to visual styles. Each topic has a hand-written prompt for consistent aesthetics:

| Detected Keyword(s) | Topic Key        | Visual Style                                   |
|---------------------|------------------|------------------------------------------------|
| agent, autonomous   | ai-agent         | Cyberpunk command center, holographic UI       |
| hack, security      | ai-security      | Firewall barriers, digital locks, ops center   |
| multimodal, vision  | multimodal       | Media collage, floating text/image/sound       |
| llm, model, train   | llm-model        | Crystalline neural network, amber/indigo       |
| deepseek, reasoning | deepseek         | Mechanical brain, illuminated circuitry        |
| rag, retrieval      | rag-retrieval    | Digital library, glowing document nodes        |
| deploy, code, dev   | software-dev     | Holographic IDE, developer command center      |
| edge, iot, sensor   | edge-iot         | Industrial network, fog, pipelines             |
| time, latency       | time-latency     | Clock faces, speed lines, motion blur          |
| prompt, context     | prompt-engineering| Text-to-image particles, bioluminescent        |
| analytics, bi       | data-analytics   | Holographic dashboard, amber charts            |
| vector, embedding   | vector-db        | Abstract vector space, colored data points     |
| *(no match)*        | default          | Futuristic control room, cool blue/purple      |

### Env Vars

| Variable        | Default  | Description                    |
|-----------------|----------|--------------------------------|
| `HEROES_WIDTH`  | `1200`   | Image width in pixels          |
| `HEROES_HEIGHT` | `600`    | Image height in pixels         |
| `NVIDIA_API_KEY`| —        | Required for DALL·E 3 provider (or `OPENAI_API_KEY`) |
| `STABILITY_API_KEY`| —     | Required for Stability provider|

### Output

Auto-generated images are saved to `public/heroes/auto/{slug}.webp` and served via `/heroes/auto/{slug}.webp`.

---

## Tier 3: SVG Illustration (Fallback)

If neither a manual nor auto-generated image exists, the site falls back to a topic-matched SVG illustration component:

- Each of the 10 SVG components in `components/shared/TechnicalIllustrations.tsx` is mapped to keyword patterns (same as the topic detection above)
- The `ElectricGridIllustration` serves as the ultimate fallback

When you run `generate_heroes.py --missing`, it only generates for posts that have *neither* manual *nor* auto images — so posts still on SVG fallback will get upgraded to AI-generated images.

---

## Automation in the Pipeline

The hero generator is already wired into the post creation workflow:

- `scripts/auto_generate_post.py` automatically runs `generate_heroes.py` after saving a new post
- `scripts/research_and_post.py` has the same hook (if needed)
- Run `python3 scripts/generate_heroes.py --missing` periodically to catch any posts that slipped through

---

## Directory Structure

```
public/heroes/
├── auto/             ← AI-generated images (gitignored or committed — your call)
│   ├── post-slug-1.webp
│   └── post-slug-2.webp
└── manual/           ← User-created overrides (committed to repo)
    └── post-slug.webp
```

---

## Full Reference

```
usage: generate_heroes.py [-h] [--slug SLUG] [--provider {pollinations,dalle3,stability}]
                          [--force] [--missing] [--list] [--prompt PROMPT]

Auto-generate hero images for blog posts using AI image generation APIs.

options:
  -h, --help            show this help message and exit
  --slug SLUG           Generate for a specific post slug only
  --provider {pollinations,dalle3,stability}
                        Image generation provider (default: pollinations - free)
  --force               Regenerate existing images
  --missing             Only generate for posts without heroes
  --list                List all posts and their hero status
  --prompt PROMPT       Preview prompt for a slug (don't generate)
```
