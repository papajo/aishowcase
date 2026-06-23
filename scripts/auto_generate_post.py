#!/usr/bin/env python3
"""
auto_generate_post.py

Generate a draft journal post for the ai-showcase site using an LLM.

Behavior:
  - Generates markdown content for a given --topic via the OpenAI API.
  - Saves the draft to content/drafts/<timestamp>-<slug>.md (with YAML frontmatter).
  - If ADMIN_API_URL and ADMIN_API_TOKEN are set, POSTs the draft to that endpoint
    so it can be created in the app DB for admin review.
  - --publish controls a frontmatter "published" flag and the POST payload; default false.

Designed so logic can later be reused/ported to a Next.js API route (Option 1).

Env vars:
  OPENAI_API_KEY   (required to call the LLM; if missing, runs in --dry-run-style stub mode)
  OPENAI_MODEL     (optional, default: gpt-4o-mini)
  ADMIN_API_URL    (optional) POST endpoint for creating drafts in the app
  ADMIN_API_TOKEN  (optional) bearer token for ADMIN_API_URL

Usage:
  python3 scripts/auto_generate_post.py --topic "Some AI tool" --publish false
"""

from __future__ import annotations

import argparse
import datetime as _dt
import json
import os
import re
import sys
import urllib.request
import urllib.error

DEFAULT_MODEL = os.environ.get("OPENAI_MODEL", "gpt-4o-mini")
CONTENT_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "content"
)
DRAFTS_DIR = os.path.join(CONTENT_DIR, "drafts")
POSTS_DIR = os.path.join(CONTENT_DIR, "posts")


def get_existing_topics() -> set[str]:
    """Extract titles from existing published posts to detect duplicates."""
    topics = set()
    for d in [POSTS_DIR, DRAFTS_DIR]:
        if not os.path.isdir(d):
            continue
        for fn in os.listdir(d):
            if not fn.endswith(".md"):
                continue
            path = os.path.join(d, fn)
            try:
                with open(path, "r", encoding="utf-8") as f:
                    for line in f:
                        if line.startswith("title:"):
                            title = line.split(":", 1)[1].strip().strip('"').strip("'")
                            topics.add(title.lower())
                            break
            except Exception:
                pass
    return topics


def is_duplicate(topic: str, existing: set[str]) -> bool:
    """Check if a topic is too similar to an existing post title."""
    t = topic.lower().strip()
    if t in existing:
        return True
    # Check for substring overlap (handles "X vs Y" vs "X" scenarios)
    for ex in existing:
        if len(t) > 5 and len(ex) > 5:
            # If 70%+ of words overlap, consider it a duplicate
            t_words = set(t.split())
            e_words = set(ex.split())
            if t_words and e_words:
                overlap = len(t_words & e_words) / max(len(t_words), len(e_words))
                if overlap >= 0.7:
                    return True
    return False


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^a-z0-9\s-]", "", text)
    text = re.sub(r"[\s_-]+", "-", text)
    return text.strip("-")[:60] or "post"


BASE_URL = os.environ.get("OPENAI_BASE_URL", "https://api.openai.com/v1")


def generate_with_openai(topic: str, model: str) -> str:
    """Call the LLM API (OpenAI or compatible). Returns markdown body. Raises on hard failure."""
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        # If running in an interactive terminal, provide a helpful guide.
        if sys.stdout.isatty():
            print("\n" + "=" * 60)
            print("⚠️  WARNING: OPENAI_API_KEY NOT FOUND")
            print("The script is running in STUB MODE (using placeholder content).")
            print("\nTo use real AI content locally, choose one:")
            print("  1. Temporary (current session only):")
            print('     export OPENAI_API_KEY="your_actual_key_here"')
            print("  2. Permanent (all future sessions):")
            print(
                "     Add 'export OPENAI_API_KEY=\"your_actual_key_here\"' to your ~/.zshrc"
            )
            print("=" * 60 + "\n")

        return (
            f"## {topic}\n\n"
            "_(Stub content: OPENAI_API_KEY not set, generated placeholder.)_\n\n"
            f"This is a draft post about **{topic}**. Replace with real generated content.\n"
        )

    prompt = (
        "Write a concise, engaging journal/blog post (250-400 words) in Markdown "
        f"about the following AI tool or topic: {topic}. "
        "Include a short intro, 2-3 key points, and a closing takeaway. "
        "Do not include a top-level H1 title (that is handled by frontmatter)."
    )

    payload = {
        "model": model,
        "messages": [
            {
                "role": "system",
                "content": "You are a helpful technical writer for an AI tools showcase site.",
            },
            {"role": "user", "content": prompt},
        ],
        "temperature": 0.7,
    }

    req = urllib.request.Request(
        f"{BASE_URL.rstrip('/')}/chat/completions",
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        return data["choices"][0]["message"]["content"].strip()
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", "replace")
        raise RuntimeError(f"LLM API HTTP {e.code} at {BASE_URL}: {body}") from e
    except Exception as e:  # noqa: BLE001
        raise RuntimeError(f"LLM API call failed at {BASE_URL}: {e}") from e


def build_markdown(topic: str, body: str, published: bool) -> str:
    now = _dt.datetime.now(_dt.timezone.utc)
    frontmatter = (
        "---\n"
        f'title: "{topic}"\n'
        f'date: "{now.isoformat()}"\n'
        f"published: {str(published).lower()}\n"
        "source: auto_generate_post.py\n"
        "---\n\n"
    )
    return frontmatter + body + "\n"


def save_post(topic: str, markdown: str, published: bool) -> str:
    dest = POSTS_DIR if published else DRAFTS_DIR
    os.makedirs(dest, exist_ok=True)
    ts = _dt.datetime.now(_dt.timezone.utc).strftime("%Y%m%d-%H%M%S")
    filename = f"{ts}-{slugify(topic)}.md"
    path = os.path.join(dest, filename)
    with open(path, "w", encoding="utf-8") as f:
        f.write(markdown)
    return path


def post_to_admin(topic: str, markdown: str, published: bool) -> None:
    url = os.environ.get("ADMIN_API_URL")
    token = os.environ.get("ADMIN_API_TOKEN")
    if not url or not token:
        return
    payload = {"title": topic, "content": markdown, "published": published}
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            print(f"Admin API responded: HTTP {resp.status}")
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", "replace")
        print(f"WARNING: Admin API POST failed HTTP {e.code}: {body}", file=sys.stderr)
    except Exception as e:  # noqa: BLE001
        print(f"WARNING: Admin API POST failed: {e}", file=sys.stderr)


def _str2bool(v: str) -> bool:
    return str(v).strip().lower() in {"1", "true", "yes", "y", "on"}


def find_post_by_topic(topic: str) -> str | None:
    """Find a post file path by matching its title."""
    t = topic.lower().strip()
    for d in [POSTS_DIR, DRAFTS_DIR]:
        if not os.path.isdir(d):
            continue
        for fn in os.listdir(d):
            if not fn.endswith(".md"):
                continue
            path = os.path.join(d, fn)
            try:
                with open(path, "r", encoding="utf-8") as f:
                    for line in f:
                        if line.startswith("title:"):
                            title = line.split(":", 1)[1].strip().strip('"').strip("'")
                            if title.lower() == t:
                                return path
                            break
            except Exception:
                pass
    return None


def rename_post(old_topic: str, new_topic: str) -> bool:
    """Rename a post's title in its frontmatter."""
    path = find_post_by_topic(old_topic)
    if not path:
        print(f"ERROR: No post found with title: {old_topic!r}")
        return False

    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Replace the title line
    old_line = f'title: "{old_topic}"'
    new_line = f'title: "{new_topic}"'
    if old_line not in content:
        # Try without quotes
        old_line = f"title: '{old_topic}'"
        new_line = f"title: '{new_topic}'"
    if old_line not in content:
        # Try bare
        old_line = f"title: {old_topic}"
        new_line = f"title: {new_topic}"

    if old_line in content:
        content = content.replace(old_line, new_line, 1)
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Renamed: {old_topic!r} → {new_topic!r}")
        print(f"File: {path}")
        return True

    print(f"ERROR: Could not find title line in {path}")
    return False


def list_posts() -> None:
    """List all existing posts with their titles."""
    print("Existing posts:\n")
    for d in [POSTS_DIR, DRAFTS_DIR]:
        if not os.path.isdir(d):
            continue
        label = "PUBLISHED" if d == POSTS_DIR else "DRAFTS"
        found = False
        for fn in sorted(os.listdir(d)):
            if not fn.endswith(".md"):
                continue
            found = True
            path = os.path.join(d, fn)
            with open(path, "r", encoding="utf-8") as f:
                for line in f:
                    if line.startswith("title:"):
                        title = line.split(":", 1)[1].strip().strip('"').strip("'")
                        print(f"  [{label}] {title}")
                        print(f"         {fn}")
                        break
        if not found:
            print(f"  [{label}] (none)")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Auto-generate a draft journal post.")
    parser.add_argument(
        "--topic", required=False, help="Topic or AI tool name for the post."
    )
    parser.add_argument(
        "--publish", default="false", help="true/false: mark the draft published."
    )
    parser.add_argument("--model", default=DEFAULT_MODEL, help="LLM model name.")
    parser.add_argument(
        "--force", default="false", help="true/false: skip duplicate check."
    )
    parser.add_argument(
        "--list", action="store_true", help="List all existing posts and exit."
    )
    parser.add_argument(
        "--rename",
        nargs=2,
        metavar=("OLD_TITLE", "NEW_TITLE"),
        help='Rename a post: --rename "Old Title" "New Title"',
    )
    args = parser.parse_args(argv)

    # List mode
    if args.list:
        list_posts()
        return 0

    # Rename mode
    if args.rename:
        old, new = args.rename
        return 0 if rename_post(old, new) else 1

    # Generate mode requires --topic
    if not args.topic:
        parser.error("--topic is required (or use --list / --rename)")

    published = _str2bool(args.publish)
    force = _str2bool(args.force)

    # Check for duplicates unless --force is set
    if not force:
        existing = get_existing_topics()
        if is_duplicate(args.topic, existing):
            print(f"ERROR: A post with a similar title already exists: {args.topic!r}")
            print("Existing posts:")
            for t in sorted(existing):
                print(f"  - {t}")
            print("\nUse --force true to override, or choose a different topic.")
            return 1

    print(
        f"Generating post for topic: {args.topic!r} (model={args.model}, publish={published})"
    )
    body = generate_with_openai(args.topic, args.model)
    markdown = build_markdown(args.topic, body, published)
    path = save_post(args.topic, markdown, published)
    label = "Published" if published else "Draft"
    print(f"{label} saved: {path}")

    post_to_admin(args.topic, markdown, published)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
