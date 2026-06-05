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
DRAFTS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "content", "drafts")


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^a-z0-9\s-]", "", text)
    text = re.sub(r"[\s_-]+", "-", text)
    return text.strip("-")[:60] or "post"


def generate_with_openai(topic: str, model: str) -> str:
    """Call the OpenAI API. Returns markdown body. Raises on hard failure."""
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        # Stub mode so the pipeline is testable without a key.
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
            {"role": "system", "content": "You are a helpful technical writer for an AI tools showcase site."},
            {"role": "user", "content": prompt},
        ],
        "temperature": 0.7,
    }

    req = urllib.request.Request(
        "https://api.openai.com/v1/chat/completions",
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
        raise RuntimeError(f"OpenAI API HTTP {e.code}: {body}") from e
    except Exception as e:  # noqa: BLE001
        raise RuntimeError(f"OpenAI API call failed: {e}") from e


def build_markdown(topic: str, body: str, published: bool) -> str:
    now = _dt.datetime.now(_dt.timezone.utc)
    frontmatter = (
        "---\n"
        f"title: \"{topic}\"\n"
        f"date: \"{now.isoformat()}\"\n"
        f"published: {str(published).lower()}\n"
        "source: auto_generate_post.py\n"
        "---\n\n"
    )
    return frontmatter + body + "\n"


def save_draft(topic: str, markdown: str) -> str:
    os.makedirs(DRAFTS_DIR, exist_ok=True)
    ts = _dt.datetime.now(_dt.timezone.utc).strftime("%Y%m%d-%H%M%S")
    filename = f"{ts}-{slugify(topic)}.md"
    path = os.path.join(DRAFTS_DIR, filename)
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


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Auto-generate a draft journal post.")
    parser.add_argument("--topic", required=True, help="Topic or AI tool name for the post.")
    parser.add_argument("--publish", default="false", help="true/false: mark the draft published.")
    parser.add_argument("--model", default=DEFAULT_MODEL, help="LLM model name.")
    args = parser.parse_args(argv)

    published = _str2bool(args.publish)

    print(f"Generating post for topic: {args.topic!r} (model={args.model}, publish={published})")
    body = generate_with_openai(args.topic, args.model)
    markdown = build_markdown(args.topic, body, published)
    path = save_draft(args.topic, markdown)
    print(f"Draft saved: {path}")

    post_to_admin(args.topic, markdown, published)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
