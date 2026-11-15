#!/usr/bin/env python3
"""Check a generated post before it is allowed to publish.

The generator's prompt asks the LLM for "real-looking" reference URLs, so a
generated post can cite pages that do not exist. This script is the guardrail
the scheduled workflow runs after generation and before committing:

  1. Fails on stub / placeholder markers (a run without an API key must
     never reach the blog — this already happened once, June 2026, when a
     cron run wrote "Stub content" drafts).
  2. Fails if the body is too short to be a real article (< 150 words).
  3. Checks every http(s) link in the file and fails on any dead one
     (anything that is not 2xx/3xx after redirects; 429 counts as a pass
     with a warning, since rate-limiting is not a dead link).

Usage:
  python3 scripts/check_post_links.py content/posts/20261115-090000-topic.md

Exit code 0 means the post passed; 1 means it must not be published.
"""
from __future__ import annotations

import argparse
import re
import sys
import urllib.request
import urllib.error

STUB_MARKERS = (
    "stub content",
    "replace with real",
    "real-looking",
    "lorem ipsum",
    "TODO",
    "placeholder",
)
LINK_RE = re.compile(r"https?://[^\s)\"'<>]+")
MIN_WORDS = 150
TIMEOUT = 15


def check_url(url: str) -> tuple[str, str]:
    """Return (status, detail). status is 'ok', 'warn' or 'dead'."""
    url = url.rstrip(".,;")
    for method in ("HEAD", "GET"):
        req = urllib.request.Request(url, method=method,
                                     headers={"User-Agent": "aishowcase-link-check/1.0"})
        try:
            with urllib.request.urlopen(req, timeout=TIMEOUT) as resp:
                return "ok", f"HTTP {resp.status}"
        except urllib.error.HTTPError as e:
            if e.code == 429:
                return "warn", "HTTP 429 (rate-limited, treated as alive)"
            if e.code in (401, 403):
                return "warn", f"HTTP {e.code} (blocked to bots, treated as alive)"
            return "dead", f"HTTP {e.code}"
        except urllib.error.URLError as e:
            if method == "HEAD":
                continue  # some servers reject HEAD; retry with GET
            return "dead", f"URLError: {e.reason}"
        except Exception as e:  # timeout, SSL, etc.
            if method == "HEAD":
                continue
            return "dead", f"{type(e).__name__}: {e}"
    return "dead", "unreachable"


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(description="Check a generated post before publishing.")
    p.add_argument("path", help="Markdown file to check")
    args = p.parse_args(argv)

    with open(args.path, encoding="utf-8") as f:
        content = f.read()

    problems: list[str] = []
    lowered = content.lower()
    for marker in STUB_MARKERS:
        if marker.lower() in lowered:
            problems.append(f"stub/placeholder marker found: {marker!r}")

    body = re.sub(r"^---.*?---", "", content, flags=re.DOTALL).strip()
    words = len(body.split())
    if words < MIN_WORDS:
        problems.append(f"body too short: {words} words (minimum {MIN_WORDS})")

    urls = sorted(set(LINK_RE.findall(content)))
    if not urls:
        problems.append("no http(s) links found (references section missing?)")
    for url in urls:
        status, detail = check_url(url)
        mark = {"ok": "✓", "warn": "~", "dead": "✗"}[status]
        print(f"  {mark} {url} — {detail}")
        if status == "dead":
            problems.append(f"dead link: {url} ({detail})")

    if problems:
        print(f"\nFAILED {args.path}:", file=sys.stderr)
        for prob in problems:
            print(f"  - {prob}", file=sys.stderr)
        return 1

    print(f"\nPASSED {args.path}: {words} words, {len(urls)} links alive")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
