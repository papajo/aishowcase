#!/usr/bin/env python3
"""
Auto-generate hero images for blog posts using AI image generation APIs.
Fully automated — no manual image creation needed.

Usage:
  python3 scripts/generate_heroes.py                          # Generate for all posts
  python3 scripts/generate_heroes.py --slug some-post-slug    # Generate for one post
  python3 scripts/generate_heroes.py --provider pollinations  # Use Pollinations.ai (free, default)
  python3 scripts/generate_heroes.py --provider dalle3        # Use DALL·E 3 (requires NVIDIA_API_KEY or OPENAI_API_KEY)
  python3 scripts/generate_heroes.py --provider stability     # Use Stability AI (requires STABILITY_API_KEY)
  python3 scripts/generate_heroes.py --list                   # List all posts and their hero status
  python3 scripts/generate_heroes.py --missing                # Only generate for posts without heroes

Env vars:
  NVIDIA_API_KEY      Required for Dall·E 3 provider (or OPENAI_API_KEY as fallback)
  STABILITY_API_KEY   Required for Stability AI provider
  HEROES_WIDTH         Image width (default: 1200)
  HEROES_HEIGHT        Image height (default: 600)

Output:
  public/heroes/auto/{slug}.webp   — Auto-generated images
  public/heroes/manual/{slug}.webp — Manual overrides (user-created, takes priority)
"""

from __future__ import annotations
import argparse, base64, json, os, re, sys, time, urllib.request, urllib.error, hashlib, io, ssl

# macOS Python often has SSL cert issues — handle gracefully
try:
    _create_unverified_https_context = ssl._create_unverified_context
except AttributeError:
    pass
else:
    ssl._create_default_https_context = _create_unverified_https_context

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT_DIR = os.path.join(PROJECT_ROOT, "content")
POSTS_DIR = os.path.join(CONTENT_DIR, "posts")
AUTO_DIR = os.path.join(PROJECT_ROOT, "public", "heroes", "auto")
MANUAL_DIR = os.path.join(PROJECT_ROOT, "public", "heroes", "manual")
WIDTH = int(os.environ.get("HEROES_WIDTH", 1200))
HEIGHT = int(os.environ.get("HEROES_HEIGHT", 600))

# ── Image style prompts per topic ────────────────────────────────────────────

TOPIC_STYLES: dict[str, str] = {
    "ai-agent": (
        "A cybersecurity command center from a first-person perspective, "
        "holographic AI agent interfaces floating in mid-air, neon blue and red data streams, "
        "dark background with glowing tech grids, cinematic cyberpunk aesthetic"
    ),
    "ai-autonomous": (
        "An abstract digital network of autonomous AI nodes connecting across a dark cyberspace, "
        "glowing neural pathways with red and blue energy pulses, futuristic HUD overlays, "
        "misty atmospheric depth, cinematic cyber-thriller lighting"
    ),
    "ai-security": (
        "A high-tech cybersecurity operations center, glowing firewall barriers, "
        "digital lock symbols made of binary code, blue and orange neon accents, "
        "dark atmospheric room with holographic threat maps, cinematic lighting"
    ),
    "multimodal": (
        "A surreal digital collage merging text, images, and sound waves into a unified stream, "
        "translucent floating elements in purple and teal gradients, "
        "futuristic holographic display showing interconnected media types, ethereal glow"
    ),
    "llm-model": (
        "A towering neural network architecture visualized as a crystalline structure, "
        "layers of glowing neurons in amber and indigo, light rays passing through transparent "
        "computational layers, sci-fi data center aesthetic, volumetric lighting"
    ),
    "deepseek": (
        "A deep reasoning engine visualized as a mechanical brain with illuminated circuitry, "
        "golden and deep blue light trails forming logical pathways, "
        "industrial sci-fi aesthetic with glowing computational nodes, dramatic rim lighting"
    ),
    "rag-retrieval": (
        "A dynamic visualization of data being retrieved from a vast digital library, "
        "glowing document chunks flying through neon-lit cyberspace towards a central node, "
        "green and cyan data streams, futuristic database architecture"
    ),
    "vector-db": (
        "Abstract vector space visualization with glowing high-dimensional data points, "
        "clusters of colored vectors floating in dark space, connected by thin luminous threads, "
        "data science minimalist aesthetic, purple and teal color scheme"
    ),
    "software-dev": (
        "A developer's workspace transformed into a holographic command center, "
        "floating code panels and IDE windows in translucent blue glass, "
        "keyboard with neon backlight, dark ambient lighting, cyberpunk tech aesthetic"
    ),
    "time-latency": (
        "A temporal distortion visualization with glowing clock faces and speed lines, "
        "digital timecode overlays fading into motion blur, orange and electric blue neon, "
        "cinematic time-lapse photography aesthetic"
    ),
    "edge-iot": (
        "An industrial edge computing network with connected IoT sensor nodes "
        "glowing through atmospheric haze, digital overlays on infrastructure, "
        "neon blue and amber accents against dark industrial backdrop, cyberpunk aesthetic"
    ),
    "data-analytics": (
        "A futuristic data analytics dashboard rendered as a holographic display, "
        "glowing bar charts and line graphs floating in dark space, "
        "golden amber data points with dark navy background, clean minimalist sci-fi"
    ),
    "prompt-engineering": (
        "Abstract visualization of text prompts transforming into visual outputs, "
        "flowing language particles morphing into images, bioluminescent gradient, "
        "dreamy deep learning aesthetic, magenta to cyan color transition"
    ),
    "default": (
        "A sleek futuristic control room with holographic displays showing abstract AI data, "
        "minimalist sci-fi aesthetic, cool blue and purple lighting, "
        "clean geometric shapes with subtle glow effects, atmospheric depth"
    ),
}

# ── Topic detection ──────────────────────────────────────────────────────────

TOPIC_PATTERNS: list[tuple[re.Pattern, str]] = [
    (re.compile(r"\b(agent[sd]?|autonomous|automation|orchestrat)"), "ai-agent"),
    (re.compile(r"\b(autonomous|self.?driving|unattended)\b"), "ai-autonomous"),
    (re.compile(r"\b(secur|safety|hack|breach|incident|rogue|vulnerab)"), "ai-security"),
    (re.compile(r"\b(multimodal|vision|image[s]?|video|audio|speech|sound)\b"), "multimodal"),
    (re.compile(r"\b(llm[s]?|model[s]?|training|fine.?tune|quantization|distill|compress|transformer)"), "llm-model"),
    (re.compile(r"\b(deep.?seek|r1|reasoning|think|logic|chain.?of.?thought)\b"), "deepseek"),
    (re.compile(r"\b(rag|retrieval|search|index|semantic|embedding|chunk)"), "rag-retrieval"),
    (re.compile(r"\b(vector[s]?|pinecone|embedding|nearest.?neighbor)\b"), "vector-db"),
    (re.compile(r"\b(deploy|forward|engineer[sd]?|dev[s]?|cod(e|ing)|software|programming|developer)"), "software-dev"),
    (re.compile(r"\b(time|delay|latency|schedule|duration|response.?time)\b"), "time-latency"),
    (re.compile(r"\b(edge|iot|industrial|sensor|stream|manufacturing)\b"), "edge-iot"),
    (re.compile(r"\b(analytics|dashboard|bi|report[s]?|metric[s]?|kpi|insight)\b"), "data-analytics"),
    (re.compile(r"\b(prompt[s]?|instruction[s]?|context|attention|self.?attent|token[s]?)\b"), "prompt-engineering"),
]

def detect_topic(title: str, tags: list[str], excerpt: str) -> str:
    """Detect the most relevant topic for a post based on its content."""
    haystack = f"{title} {' '.join(tags)} {excerpt}".lower()
    for pattern, topic in TOPIC_PATTERNS:
        if pattern.search(haystack):
            return topic
    return "default"


def build_prompt(title: str, tags: list[str], excerpt: str) -> str:
    """Build a descriptive image generation prompt from post content."""
    topic = detect_topic(title, tags, excerpt)
    base_style = TOPIC_STYLES.get(topic, TOPIC_STYLES["default"])

    # Enforce consistent visual identity across all topics
    VISUAL_IDENTITY = (
        "Consistent dark cyberpunk aesthetic: deep black/charcoal background with "
        "electric blue, neon purple, and warm amber accent glows. "
        "Atmospheric haze, volumetric light rays, subtle grid/tech patterns. "
        "Cinematic depth of field, moody and premium feel."
    )

    return (
        f"Hero banner for an AI/tech blog post titled '{title}'. {base_style} "
        f"{VISUAL_IDENTITY} "
        f"Clean composition, wide aspect ratio ({WIDTH}x{HEIGHT}), "
        f"no text, no watermark, no logos, no UI elements, photorealistic digital art."
    )


# ── Post file parsing ────────────────────────────────────────────────────────

def parse_post_file(filepath: str) -> dict | None:
    """Parse frontmatter from a markdown post file."""
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
        match = re.match(r"^---\n(.*?)\n---\n(.*)", content, re.DOTALL)
        if not match:
            return None

        frontmatter = match.group(1)
        body = match.group(2)

        meta: dict[str, str] = {}
        for line in frontmatter.split("\n"):
            if ":" in line and not line.strip().startswith("-"):
                key, _, val = line.partition(":")
                meta[key.strip()] = val.strip().strip('"').strip("'")

        slug = os.path.basename(filepath).replace(".md", "")
        title = meta.get("title", "Untitled")
        tags_raw = meta.get("tags", "")
        tags = [t.strip() for t in tags_raw.split(",") if t.strip()]
        excerpt = body.strip()[:200].replace("\n", " ")

        return {"slug": slug, "title": title, "tags": tags, "excerpt": excerpt}
    except Exception as e:
        print(f"  ⚠️  Error parsing {filepath}: {e}")
        return None


def get_all_posts() -> list[dict]:
    """Get all posts from the content directory."""
    if not os.path.isdir(POSTS_DIR):
        print(f"❌ Posts directory not found: {POSTS_DIR}")
        return []
    posts = []
    for fn in sorted(os.listdir(POSTS_DIR)):
        if fn.endswith(".md"):
            post = parse_post_file(os.path.join(POSTS_DIR, fn))
            if post:
                posts.append(post)
    return posts


# ── Image generation providers ───────────────────────────────────────────────

def _generate_pollinations(prompt: str, slug: str) -> bytes | None:
    """Generate image using Pollinations.ai (free, no API key)."""
    url = f"https://image.pollinations.ai/prompt/{urllib.parse.quote(prompt)}?width={WIDTH}&height={HEIGHT}&nologo=true&model=flux"
    print(f"  📡 Pollinations.ai: generating...", end="", flush=True)
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "generate-heroes/1.0"})
        with urllib.request.urlopen(req, timeout=120) as resp:
            data = resp.read()
        print(f" ✅ ({len(data)} bytes)")
        return data
    except Exception as e:
        print(f" ❌ {e}")
        return None


def _generate_dalle3(prompt: str, slug: str) -> bytes | None:
    """Generate image using OpenAI DALL·E 3."""
    api_key = os.environ.get("NVIDIA_API_KEY") or os.environ.get("OPENAI_API_KEY")
    if not api_key:
        print("  ⚠️  NVIDIA_API_KEY not set, skipping DALL·E 3")
        return None

    print(f"  🎨 DALL·E 3: generating...", end="", flush=True)
    payload = json.dumps({
        "model": "dall-e-3",
        "prompt": prompt,
        "n": 1,
        "size": f"{WIDTH}x{HEIGHT}" if WIDTH <= 1792 else "1792x1024",
        "response_format": "b64_json",
    }).encode()
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}",
    }
    try:
        req = urllib.request.Request(
            "https://api.openai.com/v1/images/generations",
            data=payload, headers=headers, method="POST"
        )
        with urllib.request.urlopen(req, timeout=120) as resp:
            result = json.loads(resp.read().decode())
        b64 = result["data"][0]["b64_json"]
        print(f" ✅")
        return base64.b64decode(b64)
    except Exception as e:
        print(f" ❌ {e}")
        return None


def _generate_stability(prompt: str, slug: str) -> bytes | None:
    """Generate image using Stability AI."""
    api_key = os.environ.get("STABILITY_API_KEY")
    if not api_key:
        print("  ⚠️  STABILITY_API_KEY not set, skipping Stability AI")
        return None

    print(f"  🖼️  Stability AI: generating...", end="", flush=True)
    import uuid
    boundary = uuid.uuid4().hex
    body = (
        f"--{boundary}\r\n"
        f'Content-Disposition: form-data; name="text_prompts[0][text]"\r\n\r\n'
        f"{prompt}\r\n"
        f"--{boundary}\r\n"
        f'Content-Disposition: form-data; name="cfg_scale"\r\n\r\n'
        f"7\r\n"
        f"--{boundary}\r\n"
        f'Content-Disposition: form-data; name="aspect_ratio"\r\n\r\n'
        f"{WIDTH}:{HEIGHT}\r\n"
        f"--{boundary}\r\n"
        f'Content-Disposition: form-data; name="output_format"\r\n\r\n'
        f"webp\r\n"
        f"--{boundary}--\r\n"
    ).encode()
    headers = {
        "Content-Type": f"multipart/form-data; boundary={boundary}",
        "Authorization": f"Bearer {api_key}",
        "Accept": "application/json",
    }
    try:
        req = urllib.request.Request(
            "https://api.stability.ai/v2beta/stable-image/generate/sd3",
            data=body, headers=headers, method="POST"
        )
        with urllib.request.urlopen(req, timeout=120) as resp:
            result = json.loads(resp.read().decode())
        b64 = result["image"]
        print(f" ✅")
        return base64.b64decode(b64)
    except Exception as e:
        print(f" ❌ {e}")
        return None


PROVIDERS = {
    "pollinations": _generate_pollinations,
    "dalle3": _generate_dalle3,
    "stability": _generate_stability,
}


def generate_hero(post: dict, provider: str, force: bool = False) -> bool:
    """Generate a hero image for a single post. Returns True if successful."""
    slug = post["slug"]
    auto_path = os.path.join(AUTO_DIR, f"{slug}.webp")
    manual_path = os.path.join(MANUAL_DIR, f"{slug}.webp")

    # Skip if manual override exists (manual > auto)
    if os.path.exists(manual_path):
        print(f"  ⏭️  Manual override exists: {manual_path}")
        return True

    # Skip if already generated and not forced
    if os.path.exists(auto_path) and not force:
        print(f"  ⏭️  Already exists: {auto_path}")
        return True

    # Build prompt
    prompt = build_prompt(post["title"], post["tags"], post["excerpt"])

    # Generate
    generator = PROVIDERS.get(provider)
    if not generator:
        print(f"  ❌ Unknown provider: {provider} (options: {', '.join(PROVIDERS.keys())})")
        return False

    image_data = generator(prompt, slug)
    if not image_data:
        return False

    # Save as WebP
    os.makedirs(AUTO_DIR, exist_ok=True)
    with open(auto_path, "wb") as f:
        f.write(image_data)
    print(f"  💾 Saved: {auto_path}")
    return True


# ── CLI ──────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="Auto-generate hero images for blog posts using AI image generation APIs.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python3 scripts/generate_heroes.py                           # Generate all, free provider
  python3 scripts/generate_heroes.py --provider dalle3         # Use DALL·E 3
  python3 scripts/generate_heroes.py --slug some-post          # Single post
  python3 scripts/generate_heroes.py --missing               # Only posts without heroes
  python3 scripts/generate_heroes.py --list                    # Show status of all posts
  python3 scripts/generate_heroes.py --force                   # Regenerate all (overwrite)
        """
    )
    parser.add_argument("--slug", help="Generate for a specific post slug only")
    parser.add_argument("--provider", choices=list(PROVIDERS.keys()), default="pollinations",
                        help="Image generation provider (default: pollinations - free)")
    parser.add_argument("--force", action="store_true", help="Regenerate existing images")
    parser.add_argument("--missing", action="store_true", help="Only generate for posts without heroes")
    parser.add_argument("--list", action="store_true", help="List all posts and their hero status")
    parser.add_argument("--prompt", help="Preview prompt for a slug (don't generate)")

    args = parser.parse_args()

    # Ensure directories exist
    os.makedirs(AUTO_DIR, exist_ok=True)
    os.makedirs(MANUAL_DIR, exist_ok=True)

    # Get posts
    if args.slug:
        filepath = os.path.join(POSTS_DIR, f"{args.slug}.md")
        if not os.path.exists(filepath):
            print(f"❌ Post not found: {filepath}")
            print(f"   Available: {', '.join(f.removesuffix('.md') for f in os.listdir(POSTS_DIR) if f.endswith('.md'))}")
            sys.exit(1)
        posts = [parse_post_file(filepath)]
    else:
        posts = get_all_posts()

    if not posts:
        print("❌ No posts found.")
        sys.exit(1)

    # ── List mode ──
    if args.list:
        print(f"\n{'Slug':<45} {'Topic':<18} {'Auto':<8} {'Manual':<8} {'Title'}")
        print("-" * 120)
        for p in posts:
            auto_exists = "✅" if os.path.exists(os.path.join(AUTO_DIR, f"{p['slug']}.webp")) else "❌"
            manual_exists = "✅" if os.path.exists(os.path.join(MANUAL_DIR, f"{p['slug']}.webp")) else "❌"
            topic = detect_topic(p["title"], p["tags"], p["excerpt"])
            print(f"{p['slug']:<45} {topic:<18} {auto_exists:<8} {manual_exists:<8} {p['title'][:50]}")
        print()
        return

    # ── Prompt preview mode ──
    if args.prompt:
        for p in posts:
            topic = detect_topic(p["title"], p["tags"], p["excerpt"])
            prompt = build_prompt(p["title"], p["tags"], p["excerpt"])
            print(f"\n{'='*80}")
            print(f"Slug:  {p['slug']}")
            print(f"Title: {p['title']}")
            print(f"Topic: {topic}")
            print(f"Tags:  {', '.join(p['tags'])}")
            print(f"Prompt:\n  {prompt}")
        return

    print(f"\n{'='*60}")
    print(f"  Hero Image Generator")
    print(f"  Provider: {args.provider}")
    print(f"  Posts:    {len(posts)}")
    print(f"  Force:    {args.force}")
    print(f"  Missing:  {args.missing}")
    print(f"{'='*60}\n")

    # ── Generate ──
    success = 0
    skipped = 0
    failed = 0

    for i, post in enumerate(posts, 1):
        slug = post["slug"]
        auto_path = os.path.join(AUTO_DIR, f"{slug}.webp")
        manual_path = os.path.join(MANUAL_DIR, f"{slug}.webp")

        # Skip if manual override
        if os.path.exists(manual_path):
            print(f"  [{i}/{len(posts)}] {slug}")
            print(f"  ⏭️  Manual override exists")
            skipped += 1
            continue

        # Skip if not missing
        if args.missing and os.path.exists(auto_path):
            print(f"  [{i}/{len(posts)}] {slug}")
            print(f"  ⏭️  Already has auto-generated hero")
            skipped += 1
            continue

        print(f"  [{i}/{len(posts)}] {slug}")
        print(f"  📝 {post['title']}")
        print(f"  🏷️  {', '.join(post['tags'])}")

        if generate_hero(post, args.provider, args.force):
            success += 1
        else:
            failed += 1
        print()

    # Summary
    print(f"{'='*60}")
    print(f"  Done: {success} generated, {skipped} skipped, {failed} failed")
    print(f"{'='*60}")

    if failed > 0:
        sys.exit(1)


if __name__ == "__main__":
    main()
