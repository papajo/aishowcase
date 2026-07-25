#!/usr/bin/env python3
"""
Create a new blog post draft in content/incoming/ with correct frontmatter.

Usage:
  python3 scripts/new_post.py --title "My Post Title" --tags "AI, Agents"
  python3 scripts/new_post.py -t "My Post Title" -g "AI, Agents" --push

The script:
  1. Generates ISO 8601 date + kebab-case slug from the title
  2. Creates the .md file in content/incoming/
  3. Opens it in $EDITOR (or $VISUAL, or vi)
  4. After you save and close, optionally git adds + commits + pushes
"""
from __future__ import annotations

import argparse
import os
import re
import subprocess
import sys
from datetime import datetime, timezone

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INCOMING_DIR = os.path.join(PROJECT_ROOT, "content", "incoming")


def slugify(title: str) -> str:
    """Convert title to a kebab-case slug."""
    slug = title.lower().strip()
    slug = re.sub(r"[^a-z0-9\s-]", "", slug)
    slug = re.sub(r"[\s_]+", "-", slug)
    slug = re.sub(r"-+", "-", slug)
    slug = slug.strip("-")
    return slug


def get_editor() -> str:
    """Return the user's preferred editor."""
    return os.environ.get("VISUAL") or os.environ.get("EDITOR") or "vi"


def open_in_editor(filepath: str) -> None:
    """Open file in the user's default editor."""
    editor = get_editor()
    subprocess.run([editor, filepath], check=True)


def git_publish(filepath: str, title: str) -> None:
    """Stage, commit, and push the new post."""
    rel = os.path.relpath(filepath, PROJECT_ROOT)
    subprocess.run(["git", "add", rel], cwd=PROJECT_ROOT, check=True)
    subprocess.run(
        ["git", "commit", "-m", f"New post: {title}"],
        cwd=PROJECT_ROOT,
        check=True,
    )
    subprocess.run(["git", "push"], cwd=PROJECT_ROOT, check=True)
    print(f"  Pushed to main — Vercel will auto-deploy.")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Create a new blog post with correct frontmatter."
    )
    parser.add_argument(
        "-t", "--title", required=True, help="Post title"
    )
    parser.add_argument(
        "-g", "--tags", required=True, help="Comma-separated tags"
    )
    parser.add_argument(
        "--push",
        action="store_true",
        help="After editing, git add + commit + push to main",
    )
    parser.add_argument(
        "--draft",
        action="store_true",
        help="Set published: false (default: true)",
    )
    args = parser.parse_args()

    slug = slugify(args.title)
    now = datetime.now(timezone.utc)
    date_str = now.strftime("%Y-%m-%dT%H:%M:%S+00:00")
    prefix = now.strftime("%Y%m%d-%H%M%S")
    filename = f"{prefix}-{slug}.md"
    filepath = os.path.join(INCOMING_DIR, filename)

    published = "false" if args.draft else "true"

    content = f"""---
title: "{args.title}"
date: "{date_str}"
published: {published}
tags: "{args.tags}"
---

Write your post content here.
"""

    os.makedirs(INCOMING_DIR, exist_ok=True)
    with open(filepath, "w") as f:
        f.write(content)

    print(f"  Created: {filepath}")
    print(f"  Opening in {get_editor()}...")
    open_in_editor(filepath)

    if args.push:
        print("  Publishing...")
        git_publish(filepath, args.title)
    else:
        print("  Done. When ready to publish:")
        print(f"    git add content/incoming/{filename}")
        print(f'    git commit -m "New post: {args.title}"')
        print("    git push")


if __name__ == "__main__":
    main()
