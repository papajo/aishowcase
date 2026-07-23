#!/usr/bin/env python3
"""
Auto-generate a draft journal post using an OpenAI-compatible LLM API.

Usage:
  python3 scripts/auto_generate_post.py --topic "Some AI tool" [--publish true] [--model gpt-4o-mini] [--force]
  python3 scripts/auto_generate_post.py --list
  python3 scripts/auto_generate_post.py --rename "Old Title" "New Title"

Env vars:
  OPENAI_API_KEY    Required for LLM calls (falls back to stub mode if missing)
  OPENAI_BASE_URL   Optional, defaults to https://api.openai.com/v1
  OPENAI_MODEL      Optional, defaults to gpt-4o-mini
  ADMIN_API_URL     Optional, POST endpoint for creating drafts in-app
  ADMIN_API_TOKEN   Optional, bearer token for ADMIN_API_URL
"""
from __future__ import annotations
import argparse, datetime as _dt, json, os, re, sys, urllib.request, urllib.error

DEFAULT_MODEL = os.environ.get("OPENAI_MODEL", "gpt-4o-mini")
BASE_URL = os.environ.get("OPENAI_BASE_URL", "https://api.openai.com/v1")
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT_DIR = os.path.join(PROJECT_ROOT, "content")
DRAFTS_DIR = os.path.join(CONTENT_DIR, "drafts")
POSTS_DIR = os.path.join(CONTENT_DIR, "posts")


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^a-z0-9\s-]", "", text)
    text = re.sub(r"[\s_-]+", "-", text)
    return text.strip("-")[:60] or "post"


def get_existing_titles() -> set[str]:
    titles = set()
    for d in [POSTS_DIR, DRAFTS_DIR]:
        if not os.path.isdir(d): continue
        for fn in os.listdir(d):
            if not fn.endswith(".md"): continue
            with open(os.path.join(d, fn), "r", encoding="utf-8") as f:
                for line in f:
                    if line.startswith("title:"):
                        titles.add(line.split(":", 1)[1].strip().strip('"').strip("'").lower())
                        break
    return titles


def is_duplicate(topic: str, existing: set[str]) -> bool:
    t = topic.lower().strip()
    if t in existing: return True
    t_words = set(t.split())
    for ex in existing:
        e_words = set(ex.split())
        if t_words and e_words and len(t_words & e_words) / max(len(t_words), len(e_words)) >= 0.7:
            return True
    return False


def generate_with_llm(topic: str, model: str) -> str:
    api_key = os.environ.get("OPENAI_API_KEY")
    is_local = "localhost" in BASE_URL or "127.0.0.1" in BASE_URL

    if not api_key and not is_local:
        print("⚠️  OPENAI_API_KEY not set — using stub mode")
        return f"## {topic}\n\n_(Stub content: replace with real generated content.)_\n\nThis is a draft about **{topic}**.\n"

    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": "You are a helpful technical writer for an AI tools showcase site."},
            {"role": "user", "content": f"Write a concise, engaging journal/blog post (250-400 words) in Markdown about: {topic}. Include a short intro, 2-3 key points, and a closing takeaway. Do not include a top-level H1 title or frontmatter."},
        ],
        "temperature": 0.7,
    }
    headers = {"Content-Type": "application/json", "User-Agent": "auto-generate-post/1.0"}
    if api_key: headers["Authorization"] = f"Bearer {api_key}"

    req = urllib.request.Request(f"{BASE_URL.rstrip('/')}/chat/completions", data=json.dumps(payload).encode(), headers=headers, method="POST")

    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=60) as resp:
                return json.loads(resp.read().decode())["choices"][0]["message"]["content"].strip()
        except urllib.error.HTTPError as e:
            body = e.read().decode("replace", errors="replace")
            if e.code == 429 and attempt < 3:
                delay = 2 ** (attempt + 1) + __import__("random").uniform(0, 1)
                print(f"429 hit, retrying in {delay:.1f}s... (attempt {attempt + 1}/3)")
                __import__("time").sleep(delay)
                continue
            raise RuntimeError(f"LLM API HTTP {e.code}: {body[:200]}")
    raise RuntimeError("Max retries exceeded")


def generate_tags_with_llm(topic: str, model: str) -> list[str]:
    """Use LLM to generate relevant tags for a topic."""
    api_key = os.environ.get("OPENAI_API_KEY")
    is_local = "localhost" in BASE_URL or "127.0.0.1" in BASE_URL

    if not api_key and not is_local:
        # Fallback: extract significant words from topic
        words = re.sub(r"[^a-zA-Z0-9\s]", "", topic).split()
        stopwords = {"the", "a", "an", "of", "for", "and", "or", "in", "on", "to", "is", "how", "why", "with", "from"}
        return [w.title() for w in words if w.lower() not in stopwords and len(w) > 2][:4]

    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": "You generate short relevant tags for blog posts. Return ONLY a comma-separated list of 3-5 tags, nothing else. Example: AI, LLM, RAG, Productivity"},
            {"role": "user", "content": f"Generate 3-5 short tags for a blog post about: {topic}"},
        ],
        "temperature": 0.5,
    }
    headers = {"Content-Type": "application/json", "User-Agent": "auto-generate-post/1.0"}
    if api_key: headers["Authorization"] = f"Bearer {api_key}"

    req = urllib.request.Request(f"{BASE_URL.rstrip('/')}/chat/completions", data=json.dumps(payload).encode(), headers=headers, method="POST")

    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                raw = json.loads(resp.read().decode())["choices"][0]["message"]["content"].strip()
                return [t.strip() for t in raw.split(",") if t.strip()]
        except urllib.error.HTTPError as e:
            body = e.read().decode("replace", errors="replace")
            if e.code == 429 and attempt < 3:
                delay = 2 ** (attempt + 1) + __import__("random").uniform(0, 1)
                print(f"Tag generation 429 hit, retrying in {delay:.1f}s... (attempt {attempt + 1}/3)")
                __import__("time").sleep(delay)
                continue
            print(f"WARNING: Tag generation HTTP {e.code}: {body[:200]}", file=sys.stderr)
            break
        except Exception as e:
            print(f"WARNING: Tag generation failed: {e}", file=sys.stderr)
            break

    # Fallback: extract significant words from topic
    words = re.sub(r"[^a-zA-Z0-9\s]", "", topic).split()
    return [w.title() for w in words if len(w) > 2][:4]


def save_post(topic: str, markdown: str, published: bool) -> str:
    dest = POSTS_DIR if published else DRAFTS_DIR
    os.makedirs(dest, exist_ok=True)
    ts = _dt.datetime.now(_dt.timezone.utc).strftime("%Y%m%d-%H%M%S")
    path = os.path.join(dest, f"{ts}-{slugify(topic)}.md")
    with open(path, "w", encoding="utf-8") as f:
        f.write(markdown)
    return path


def post_to_admin(topic: str, markdown: str, published: bool) -> None:
    url, token = os.environ.get("ADMIN_API_URL"), os.environ.get("ADMIN_API_TOKEN")
    if not url or not token: return
    req = urllib.request.Request(url, data=json.dumps({"title": topic, "content": markdown, "published": published}).encode(),
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"}, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=60) as resp: print(f"Admin API: HTTP {resp.status}")
    except Exception as e: print(f"WARNING: Admin API POST failed: {e}", file=sys.stderr)


def list_posts() -> None:
    print("Existing posts:\n")
    for d, label in [(POSTS_DIR, "PUBLISHED"), (DRAFTS_DIR, "DRAFTS")]:
        if not os.path.isdir(d): continue
        found = False
        for fn in sorted(os.listdir(d)):
            if not fn.endswith(".md"): continue
            found = True
            with open(os.path.join(d, fn), "r", encoding="utf-8") as f:
                for line in f:
                    if line.startswith("title:"):
                        t = line.split(":", 1)[1].strip().strip("'").strip('"')
                        print(f"  [{label}] {t}")
                        break
        if not found: print(f"  [{label}] (none)")


def rename_post(old: str, new: str) -> bool:
    for d in [POSTS_DIR, DRAFTS_DIR]:
        if not os.path.isdir(d): continue
        for fn in os.listdir(d):
            if not fn.endswith(".md"): continue
            path = os.path.join(d, fn)
            with open(path, "r", encoding="utf-8") as f: content = f.read()
            for q in ['"', "'"]:
                old_line, new_line = f"title: {q}{old}{q}", f"title: {q}{new}{q}"
                if old_line in content:
                    with open(path, "w", encoding="utf-8") as f: f.write(content.replace(old_line, new_line, 1))
                    print(f"Renamed: {old!r} → {new!r}")
                    return True
    print(f"ERROR: No post found with title: {old!r}")
    return False


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(description="Auto-generate a draft journal post.")
    p.add_argument("--topic", help="Topic or AI tool name")
    p.add_argument("--publish", default="false", help="true/false: mark published")
    p.add_argument("--model", default=DEFAULT_MODEL)
    p.add_argument("--force", default="false", help="Skip duplicate check")
    p.add_argument("--list", action="store_true", help="List all posts")
    p.add_argument("--tags", default=None, help="Comma-separated tags (auto-generated if omitted)")
    p.add_argument("--rename", nargs=2, metavar=("OLD", "NEW"), help="Rename a post")
    args = p.parse_args(argv)

    if args.list: list_posts(); return 0
    if args.rename: return 0 if rename_post(*args.rename) else 1
    if not args.topic: p.error("--topic is required (or use --list / --rename)")

    published = args.publish.lower() in ("1", "true", "yes")
    if not args.force.lower() in ("1", "true", "yes") and is_duplicate(args.topic, get_existing_titles()):
        print(f"ERROR: Similar post already exists: {args.topic!r}. Use --force true to override.")
        return 1

    body = generate_with_llm(args.topic, args.model)

    # Determine tags: CLI arg > LLM-generated
    if args.tags:
        tags = [t.strip() for t in args.tags.split(",") if t.strip()]
    else:
        tags = generate_tags_with_llm(args.topic, args.model)
        print(f"Generated tags: {', '.join(tags)}")

    now = _dt.datetime.now(_dt.timezone.utc)
    tags_str = ", ".join(tags)
    markdown = f'---\ntitle: "{args.topic}"\ndate: "{now.isoformat()}"\npublished: {str(published).lower()}\nsource: auto_generate_post.py\ntags: "{tags_str}"\n---\n\n{body}\n'
    path = save_post(args.topic, markdown, published)
    print(f"{'Published' if published else 'Draft'} saved: {path}")
    post_to_admin(args.topic, markdown, published)

    # Auto-generate hero image for the new post
    try:
        slug = os.path.basename(path).replace(".md", "")
        auto_dir = os.path.join(PROJECT_ROOT, "public", "heroes", "auto")
        os.makedirs(auto_dir, exist_ok=True)
        auto_path = os.path.join(auto_dir, f"{slug}.webp")
        if not os.path.exists(auto_path):
            print(f"\n🎨 Generating hero image via scripts/generate_heroes.py --slug {slug} ...")
            import subprocess
            subprocess.run(
                [sys.executable, os.path.join(PROJECT_ROOT, "scripts", "generate_heroes.py"),
                 "--slug", slug, "--provider", "pollinations"],
                timeout=120, check=False,
            )
    except Exception as e:
        print(f"⚠️  Hero image generation skipped: {e}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
