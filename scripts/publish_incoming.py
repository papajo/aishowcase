#!/usr/bin/env python3
"""
Watch content/incoming/ for new posts and hero images, validate, and publish.

Drop files into content/incoming/:
  - .md files with frontmatter (title, date, published, tags required)
  - .webp/.png/.jpg hero images (named same as the .md file or referenced in frontmatter)

Usage:
  python3 scripts/publish_incoming.py              # Process all incoming files
  python3 scripts/publish_incoming.py --dry-run    # Validate without moving
  python3 scripts/publish_incoming.py --list       # Show what's waiting

Frontmatter example:
  ---
  title: "My Post Title"
  date: "2026-07-24T10:00:00+00:00"
  published: true
  tags: "AI, LLM, Tools"
  hero: my-hero-image.webp   # optional: explicit hero filename
  ---
"""
from __future__ import annotations
import argparse, datetime as _dt, os, re, shutil, subprocess, sys

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INCOMING_DIR = os.path.join(PROJECT_ROOT, "content", "incoming")
POSTS_DIR = os.path.join(PROJECT_ROOT, "content", "posts")
HEROES_AUTO_DIR = os.path.join(PROJECT_ROOT, "public", "heroes", "auto")
HEROES_MANUAL_DIR = os.path.join(PROJECT_ROOT, "public", "heroes", "manual")

REQUIRED_FRONTMATTER = {"title", "date", "tags"}
IMAGE_EXTS = {".webp", ".png", ".jpg", ".jpeg"}


def parse_frontmatter(content: str) -> tuple[dict[str, str], str]:
    """Parse YAML frontmatter from markdown content."""
    match = re.match(r"^---\n(.*?)\n---\n(.*)", content, re.DOTALL)
    if not match:
        return {}, content

    meta: dict[str, str] = {}
    for line in match.group(1).split("\n"):
        if ":" in line and not line.strip().startswith("-"):
            key, _, val = line.partition(":")
            meta[key.strip()] = val.strip().strip('"').strip("'")

    return meta, match.group(2)


def validate_post(filepath: str) -> list[str]:
    """Validate a post file. Returns list of errors (empty = valid)."""
    errors = []
    filename = os.path.basename(filepath)

    if not filename.endswith(".md"):
        errors.append(f"Not a markdown file: {filename}")
        return errors

    try:
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
    except Exception as e:
        errors.append(f"Cannot read file: {e}")
        return errors

    meta, body = parse_frontmatter(content)

    if not meta:
        errors.append("Missing frontmatter (file must start with --- delimited YAML)")
        return errors

    for field in REQUIRED_FRONTMATTER:
        if field not in meta:
            errors.append(f"Missing required frontmatter field: {field}")

    if meta.get("title", "").strip() == "":
        errors.append("Title is empty")

    if not body.strip():
        errors.append("Post body is empty")

    return errors


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^a-z0-9\s-]", "", text)
    text = re.sub(r"[\s_-]+", "-", text)
    return text.strip("-")[:60] or "post"


def find_hero_for_post(post_filename: str, meta: dict[str, str]) -> str | None:
    """Find a matching hero image for a post."""
    post_slug = post_filename.replace(".md", "")

    # Check explicit hero field in frontmatter
    hero_ref = meta.get("hero", "")
    if hero_ref:
        hero_path = os.path.join(INCOMING_DIR, hero_ref)
        if os.path.exists(hero_path):
            return hero_path

    # Look for image with same base name
    for ext in IMAGE_EXTS:
        candidate = os.path.join(INCOMING_DIR, post_slug + ext)
        if os.path.exists(candidate):
            return candidate

    # Look for any image that partially matches the slug
    for fn in os.listdir(INCOMING_DIR):
        if os.path.splitext(fn)[1].lower() in IMAGE_EXTS:
            if post_slug[:20] in fn.replace(" ", "-").lower():
                return os.path.join(INCOMING_DIR, fn)

    return None


def process_post(filepath: str, dry_run: bool = False) -> bool:
    """Process a single incoming post. Returns True if successful."""
    filename = os.path.basename(filepath)
    slug = filename.replace(".md", "")

    # Validate
    errors = validate_post(filepath)
    if errors:
        print(f"  ❌ {filename}:")
        for e in errors:
            print(f"     - {e}")
        return False

    # Read content
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    meta, _ = parse_frontmatter(content)

    # Ensure published: true
    if "published" not in content.split("---")[1]:
        # Add published field if missing
        content = content.replace(
            "---\n",
            "---\npublished: true\n",
            1
        )

    # Check for duplicate title
    title = meta.get("title", "")
    if os.path.isdir(POSTS_DIR):
        for fn in os.listdir(POSTS_DIR):
            if not fn.endswith(".md"):
                continue
            with open(os.path.join(POSTS_DIR, fn), "r", encoding="utf-8") as f:
                for line in f:
                    if line.startswith("title:"):
                        existing = line.split(":", 1)[1].strip().strip('"').strip("'")
                        if existing.lower() == title.lower():
                            print(f"  ⚠️  Skipping {filename}: duplicate title '{title}'")
                            return False
                        break

    # Find hero image
    hero_path = find_hero_for_post(filename, meta)

    if dry_run:
        print(f"  ✅ {filename} → content/posts/{filename}")
        print(f"     Title: {title}")
        print(f"     Tags: {meta.get('tags', '(none)')}")
        if hero_path:
            print(f"     Hero: {os.path.basename(hero_path)} → public/heroes/manual/{slug}{os.path.splitext(hero_path)[1]}")
        else:
            print(f"     Hero: (none found — will use auto-generated)")
        return True

    # Move post
    os.makedirs(POSTS_DIR, exist_ok=True)
    dest = os.path.join(POSTS_DIR, filename)
    shutil.move(filepath, dest)
    print(f"  📝 Published: {filename}")

    # Move hero image
    if hero_path:
        os.makedirs(HEROES_MANUAL_DIR, exist_ok=True)
        hero_ext = os.path.splitext(hero_path)[1]
        hero_dest = os.path.join(HEROES_MANUAL_DIR, f"{slug}{hero_ext}")
        shutil.move(hero_path, hero_dest)
        print(f"  🖼️  Hero: {os.path.basename(hero_path)} → public/heroes/manual/{slug}{hero_ext}")

    return True


def list_incoming():
    """List files waiting in incoming/."""
    if not os.path.isdir(INCOMING_DIR):
        print("content/incoming/ does not exist yet.")
        return

    files = [f for f in os.listdir(INCOMING_DIR) if not f.startswith(".")]
    if not files:
        print("content/incoming/ is empty — nothing to publish.")
        return

    print(f"\nFiles in content/incoming/ ({len(files)}):\n")
    for fn in sorted(files):
        filepath = os.path.join(INCOMING_DIR, fn)
        if fn.endswith(".md"):
            errors = validate_post(filepath)
            status = "✅" if not errors else "❌"
            print(f"  {status} {fn}")
            if errors:
                for e in errors:
                    print(f"     - {e}")
        elif os.path.splitext(fn)[1].lower() in IMAGE_EXTS:
            print(f"  🖼️  {fn}")
        else:
            print(f"  ⚠️  {fn} (unknown type)")
    print()


def main():
    parser = argparse.ArgumentParser(description="Publish incoming posts from content/incoming/")
    parser.add_argument("--dry-run", action="store_true", help="Validate without moving files")
    parser.add_argument("--list", action="store_true", help="List files waiting in incoming/")
    args = parser.parse_args()

    if args.list:
        list_incoming()
        return 0

    if not os.path.isdir(INCOMING_DIR):
        os.makedirs(INCOMING_DIR, exist_ok=True)
        print(f"Created {INCOMING_DIR} — drop .md files and hero images here.")
        return 0

    # Find .md files
    md_files = sorted([
        os.path.join(INCOMING_DIR, f)
        for f in os.listdir(INCOMING_DIR)
        if f.endswith(".md") and not f.startswith(".")
    ])

    if not md_files:
        print("No .md files in content/incoming/ — nothing to publish.")
        return 0

    print(f"\n{'='*50}")
    print(f"  Publishing {len(md_files)} post(s) from content/incoming/")
    print(f"  Dry run: {args.dry_run}")
    print(f"{'='*50}\n")

    success = 0
    failed = 0

    for filepath in md_files:
        if process_post(filepath, dry_run=args.dry_run):
            success += 1
        else:
            failed += 1

    print(f"\n{'='*50}")
    print(f"  Done: {success} published, {failed} failed")
    print(f"{'='*50}\n")

    if not args.dry_run and success > 0:
        # Auto-commit and push
        try:
            subprocess.run(["git", "add", "content/posts/", "public/heroes/manual/"],
                         cwd=PROJECT_ROOT, check=True, capture_output=True)
            subprocess.run(["git", "commit", "-m", f"chore: publish {success} post(s) from incoming/"],
                         cwd=PROJECT_ROOT, check=True, capture_output=True)
            subprocess.run(["git", "push", "origin", "main"],
                         cwd=PROJECT_ROOT, check=True, capture_output=True)
            print("  🚀 Committed and pushed to main — Vercel will auto-deploy.")
        except subprocess.CalledProcessError as e:
            print(f"  ⚠️  Git error: {e}")

    return 0 if failed == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())
