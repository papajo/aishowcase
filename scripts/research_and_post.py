#!/usr/bin/env python3
"""
Research + Blog Post Generator

Wires Odysseus Deep Research into AI Showcase's blog post pipeline:
  Topic → Deep Research (real web data) → LLM writes fact-grounded post → draft saved

Usage:
  python3 scripts/research_and_post.py --topic "Your Topic Here" [--publish] [--model ...]

Env vars (see auto_generate_post.py for LLM settings):
  OPENAI_API_KEY, OPENAI_BASE_URL, OPENAI_MODEL  — same as auto_generate_post.py
  ODYSSEUS_DATA_DIR   — Odysseus data dir (default: ../odysseus/data)
  ODYSSEUS_INTERNAL_TOKEN  — for triggering research via internal API
"""

from __future__ import annotations
import argparse, datetime as _dt, json, os, re, sys, time, urllib.request, urllib.error

# ── Paths ──────────────────────────────────────────────────────────────────
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
CONTENT_DIR = os.path.join(PROJECT_ROOT, "content")
DRAFTS_DIR = os.path.join(CONTENT_DIR, "drafts")
POSTS_DIR = os.path.join(CONTENT_DIR, "posts")

ODYSSEUS_DATA_DIR = os.environ.get(
    "ODYSSEUS_DATA_DIR",
    os.path.join(os.path.dirname(PROJECT_ROOT), "odysseus", "data"),
)
DEEP_RESEARCH_DIR = os.path.join(ODYSSEUS_DATA_DIR, "deep_research")

# ── LLM config (mirrors auto_generate_post.py) ────────────────────────────
DEFAULT_MODEL = os.environ.get("OPENAI_MODEL", "gpt-4o-mini")
BASE_URL = os.environ.get("OPENAI_BASE_URL", "https://api.openai.com/v1")
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

# ── Odysseus API config ───────────────────────────────────────────────────
ODYSSEUS_INTERNAL_TOKEN = os.environ.get("ODYSSEUS_INTERNAL_TOKEN", "")
ODYSSEUS_CONTAINER = os.environ.get("ODYSSEUS_CONTAINER", "odysseus-odysseus-1")

# ═══════════════════════════════════════════════════════════════════════════
#  Helpers
# ═══════════════════════════════════════════════════════════════════════════

def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^a-z0-9\s-]", "", text)
    text = re.sub(r"[\s_-]+", "-", text)
    return text.strip("-")[:60] or "post"


def get_existing_titles() -> set[str]:
    """Reuse duplicate check from auto_generate_post.py."""
    titles = set()
    for d in [POSTS_DIR, DRAFTS_DIR]:
        if not os.path.isdir(d):
            continue
        for fn in os.listdir(d):
            if not fn.endswith(".md"):
                continue
            with open(os.path.join(d, fn), "r", encoding="utf-8") as f:
                for line in f:
                    if line.startswith("title:"):
                        titles.add(line.split(":", 1)[1].strip().strip('"').strip("'").lower())
                        break
    return titles


def is_duplicate(topic: str, existing: set[str]) -> bool:
    t = topic.lower().strip()
    if t in existing:
        return True
    t_words = set(t.split())
    for ex in existing:
        e_words = set(ex.split())
        if t_words and e_words and len(t_words & e_words) / max(len(t_words), len(e_words)) >= 0.7:
            return True
    return False


def trigger_research(topic: str) -> str:
    """Trigger Odysseus Deep Research via docker exec. Returns session_id."""
    import subprocess
    payload = json.dumps({"query": topic})
    headers = f"Content-Type: application/json"
    if ODYSSEUS_INTERNAL_TOKEN:
        headers += f"\nX-Odysseus-Internal-Token: {ODYSSEUS_INTERNAL_TOKEN}"

    cmd = [
        "docker", "exec", ODYSSEUS_CONTAINER,
        "curl", "-s", "-X", "POST",
        "http://localhost:7000/api/research/start",
        "-H", "Content-Type: application/json",
        "-H", f"X-Odysseus-Internal-Token: {ODYSSEUS_INTERNAL_TOKEN}",
        "-d", payload,
    ]

    result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
    if result.returncode != 0:
        raise RuntimeError(f"docker exec failed: {result.stderr.strip() or result.stdout.strip()}")

    data = json.loads(result.stdout)
    if "error" in data:
        raise RuntimeError(f"Research API error: {data['error']}")

    session_id = data.get("session_id", "")
    if not session_id:
        raise RuntimeError(f"No session_id in response: {data}")
    print(f"  ▶ Research started: {session_id}")
    return session_id


def poll_research(session_id: str, timeout: int = 600, poll_interval: int = 5) -> dict:
    """Poll the research JSON file until it's complete. Returns the full result dict."""
    result_path = os.path.join(DEEP_RESEARCH_DIR, f"{session_id}.json")
    print(f"  ⏳ Waiting for research to complete...", end="", flush=True)

    start = time.time()
    while time.time() - start < timeout:
        if os.path.exists(result_path):
            try:
                with open(result_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                status = data.get("status", "")
                if status == "done":
                    print(f" done ({time.time() - start:.0f}s)")
                    return data
                elif status == "error":
                    err = data.get("result", "Unknown error")
                    print(f" error: {err[:200]}")
                    raise RuntimeError(f"Research failed: {err[:500]}")
                elif status == "cancelled":
                    print(f" cancelled")
                    raise RuntimeError("Research was cancelled")
            except json.JSONDecodeError:
                pass  # file might be mid-write
        time.sleep(poll_interval)
        print(".", end="", flush=True)

    print(f"\n  ⚠ Timed out after {timeout}s")
    if os.path.exists(result_path):
        with open(result_path, "r", encoding="utf-8") as f:
            return json.load(f)  # return partial results
    raise TimeoutError(f"Research did not complete within {timeout}s")


def generate_post(research_data: dict, topic: str, model: str, temperature: float = 0.7) -> tuple[str, list[str]]:
    """Use the LLM to write a blog post grounded in the research report.

    Returns (markdown_body, tags).
    """
    report = research_data.get("result") or research_data.get("raw_report") or ""
    sources = research_data.get("sources", [])
    stats = research_data.get("stats", {})

    # Build a concise research summary for the LLM prompt
    research_context = f"## Research Report\n\n{report}\n\n"

    if sources:
        research_context += "## Sources\n\n"
        for i, src in enumerate(sources[:20], 1):
            title = src.get("title", "Untitled")
            url = src.get("url", "")
            research_context += f"{i}. [{title}]({url})\n"

    research_context += f"\n## Stats\n- Duration: {stats.get('Duration', '?')}\n"
    research_context += f"- Queries executed: {stats.get('Queries', '?')}\n"
    research_context += f"- URLs analyzed: {stats.get('URLs', '?')}\n"

    api_key = os.environ.get("OPENAI_API_KEY")
    is_local = "localhost" in BASE_URL or "127.0.0.1" in BASE_URL

    # ── Generate the blog post body ──
    body_prompt = (
        "You are a technical writer for an AI tools showcase blog. "
        "Write a concise, engaging journal/blog post (400-700 words) in Markdown "
        "based on the research report below. Include:\n"
        "- A short intro hook\n"
        "- 2-4 key takeaways grounded in the research\n"
        "- Specific facts, data points, or quotes from sources\n"
        "- A closing takeaway\n\n"
        "Do NOT include a top-level H1 title or frontmatter. "
        "Cite sources inline where relevant using [Source N] markers.\n\n"
        f"{research_context}"
    )

    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": "You are a helpful technical writer for an AI tools showcase site."},
            {"role": "user", "content": body_prompt},
        ],
        "temperature": temperature,
    }

    headers = {"Content-Type": "application/json", "User-Agent": "research-and-post/1.0"}
    if api_key:
        headers["Authorization"] = f"Bearer {api_key}"

    req = urllib.request.Request(
        f"{BASE_URL.rstrip('/')}/chat/completions",
        data=json.dumps(payload).encode(),
        headers=headers,
        method="POST",
    )

    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=120) as resp:
                body = json.loads(resp.read().decode())["choices"][0]["message"]["content"].strip()
                break
        except urllib.error.HTTPError as e:
            body_text = e.read().decode("replace", errors="replace")
            if e.code == 429 and attempt < 3:
                delay = 2 ** (attempt + 1)
                print(f"  ⚠ 429 hit, retrying in {delay}s... (attempt {attempt + 1}/3)")
                time.sleep(delay)
                continue
            raise RuntimeError(f"LLM API HTTP {e.code}: {body_text[:200]}")
    else:
        raise RuntimeError("Max retries exceeded")

    # ── Generate tags ──
    tag_prompt = (
        "Generate 3-5 short relevant tags for a blog post about this topic. "
        "Return ONLY a comma-separated list, nothing else.\n\n"
        f"Topic: {topic}\n\nResearch context:\n{report[:1000]}"
    )

    tag_payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": "You generate short relevant tags for blog posts. Return ONLY a comma-separated list of 3-5 tags."},
            {"role": "user", "content": tag_prompt},
        ],
        "temperature": 0.5,
    }

    tag_req = urllib.request.Request(
        f"{BASE_URL.rstrip('/')}/chat/completions",
        data=json.dumps(tag_payload).encode(),
        headers=headers,
        method="POST",
    )

    tags: list[str] = []
    try:
        with urllib.request.urlopen(tag_req, timeout=30) as resp:
            raw = json.loads(resp.read().decode())["choices"][0]["message"]["content"].strip()
            tags = [t.strip() for t in raw.split(",") if t.strip()]
    except Exception as e:
        print(f"  ⚠ Tag generation failed: {e}")

    if not tags:
        # Fallback: extract significant words
        words = re.sub(r"[^a-zA-Z0-9\s]", "", topic).split()
        stopwords = {"the", "a", "an", "of", "for", "and", "or", "in", "on", "to", "is", "how", "why", "with", "from"}
        tags = [w.title() for w in words if w.lower() not in stopwords and len(w) > 2][:4]

    return body, tags


def save_post(topic: str, body: str, tags: list[str], published: bool) -> str:
    """Save the post as a markdown file matching AI Showcase's format."""
    dest = POSTS_DIR if published else DRAFTS_DIR
    os.makedirs(dest, exist_ok=True)
    ts = _dt.datetime.now(_dt.timezone.utc).strftime("%Y%m%d-%H%M%S")
    tags_str = ", ".join(tags)
    markdown = (
        f'---\n'
        f'title: "{topic}"\n'
        f'date: "{_dt.datetime.now(_dt.timezone.utc).isoformat()}"\n'
        f'published: {str(published).lower()}\n'
        f'source: research_and_post.py\n'
        f'tags: "{tags_str}"\n'
        f'---\n\n'
        f'{body}\n'
    )
    path = os.path.join(dest, f"{ts}-{slugify(topic)}.md")
    with open(path, "w", encoding="utf-8") as f:
        f.write(markdown)
    return path


# ═══════════════════════════════════════════════════════════════════════════
#  Main
# ═══════════════════════════════════════════════════════════════════════════

def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(description="Deep Research → Blog Post Generator")
    p.add_argument("--topic", required=True, help="Topic to research and write about")
    p.add_argument("--publish", action="store_true", help="Mark as published (default: draft)")
    p.add_argument("--model", default=DEFAULT_MODEL, help="LLM model (default: gpt-4o-mini)")
    p.add_argument("--force", action="store_true", help="Skip duplicate check")
    p.add_argument("--no-research", action="store_true", help="Skip research, write post from existing research")
    p.add_argument("--research-id", help="Use an existing research session ID instead of starting new research")
    p.add_argument("--temperature", type=float, default=0.7, help="LLM temperature")
    p.add_argument("--timeout", type=int, default=600, help="Max wait time for research in seconds")
    args = p.parse_args(argv)

    # ── Duplicate check ──
    if not args.force and is_duplicate(args.topic, get_existing_titles()):
        print(f"ERROR: Similar post already exists: {args.topic!r}. Use --force to override.")
        return 1

    # ── Phase 1: Deep Research ──
    if args.no_research:
        if args.research_id:
            result_path = os.path.join(DEEP_RESEARCH_DIR, f"{args.research_id}.json")
            if not os.path.exists(result_path):
                print(f"ERROR: Research file not found: {result_path}")
                return 1
            with open(result_path, "r", encoding="utf-8") as f:
                research_data = json.load(f)
            print(f"  ✓ Loaded existing research: {args.research_id}")
        else:
            print("ERROR: --no-research requires --research-id or an existing research to reference")
            return 1
    else:
        print(f"  🔍 Starting deep research on: {args.topic}")
        print(f"  ├ Odysseus data dir: {ODYSSEUS_DATA_DIR}")
        print(f"  └ Container: {ODYSSEUS_CONTAINER}")

        session_id = trigger_research(args.topic)
        research_data = poll_research(session_id, timeout=args.timeout)
        print(f"  ✓ Research complete: {len(research_data.get('sources', []))} sources")

    # ── Phase 2: Generate Post ──
    print(f"  ✍ Generating blog post with model: {args.model}")
    body, tags = generate_post(research_data, args.topic, args.model, args.temperature)
    print(f"  ✓ Post generated ({len(body)} chars)")
    print(f"  ✓ Tags: {', '.join(tags)}")

    # ── Phase 3: Save ──
    status = "published" if args.publish else "draft"
    path = save_post(args.topic, body, tags, published=args.publish)
    print(f"  ✓ {status.capitalize()} saved: {path}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
