#!/usr/bin/env python3
"""
Pull a research report from Odysseus and drop it into content/incoming/.

Usage:
  python3 scripts/pull_from_odysseus.py <report_id>
  python3 scripts/pull_from_odysseus.py rp-a6252bffa18d --publish

  # List recent reports
  python3 scripts/pull_from_odysseus.py --list

Env vars:
  ODYSSEUS_URL        Odysseus base URL (default: http://127.0.0.1:7001)
  ODYSSEUS_USER       Admin username (default: admin)
  ODYSSEUS_PASS       Admin password (reads from Odysseus/.env if not set)
"""
from __future__ import annotations
import argparse, http.cookiejar, json, os, re, sys, urllib.request, urllib.error, datetime as _dt

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INCOMING_DIR = os.path.join(PROJECT_ROOT, "content", "incoming")

ODYSSEUS_URL = os.environ.get("ODYSSEUS_URL", "http://127.0.0.1:7001")
ODYSSEUS_USER = os.environ.get("ODYSSEUS_USER", "admin")
ODYSSEUS_PASS = os.environ.get("ODYSSEUS_PASS", "")


def load_password() -> str:
    if ODYSSEUS_PASS:
        return ODYSSEUS_PASS
    env_path = os.path.expanduser("~/Projects/Odysseus/.env")
    if os.path.exists(env_path):
        with open(env_path) as f:
            for line in f:
                if line.strip().startswith("ODYSSEUS_ADMIN_PASSWORD="):
                    return line.split("=", 1)[1].strip().strip('"').strip("'")
    return ""


class OdysseusClient:
    def __init__(self, base_url: str):
        self.base_url = base_url
        self.session_token = None

    def login(self, username: str, password: str) -> bool:
        data = json.dumps({"username": username, "password": password}).encode()
        req = urllib.request.Request(
            f"{self.base_url}/api/auth/login",
            data=data,
            headers={"Content-Type": "application/json"},
            method="POST"
        )
        try:
            resp = urllib.request.urlopen(req, timeout=10)
            # Extract session cookie from Set-Cookie header
            cookie_header = resp.headers.get("Set-Cookie", "")
            if "odysseus_session=" in cookie_header:
                self.session_token = cookie_header.split("odysseus_session=")[1].split(";")[0]
            result = json.loads(resp.read().decode())
            return result.get("ok", False)
        except Exception as e:
            print(f"❌ Login failed: {e}")
            return False

    def get(self, path: str) -> dict | str | None:
        req = urllib.request.Request(f"{self.base_url}{path}")
        if self.session_token:
            req.add_header("Cookie", f"odysseus_session={self.session_token}")
        try:
            resp = urllib.request.urlopen(req, timeout=30)
            content = resp.read().decode("utf-8")
            try:
                return json.loads(content)
            except json.JSONDecodeError:
                return content
        except urllib.error.HTTPError as e:
            if e.code == 401:
                print("⚠️  Not authenticated")
            else:
                print(f"❌ API error {e.code}")
            return None


def extract_sources_from_html(html: str) -> list[tuple[str, str]]:
    sources = []
    for m in re.finditer(r'<a href="([^"]+)"[^>]*>.*?<span>([^<]+)</span>', html):
        url, title = m.group(1), m.group(2).strip()
        if title and "snum" not in title:
            sources.append((title, url))
    return sources


def html_to_markdown(html: str) -> str:
    try:
        import markdownify
    except ImportError:
        print("❌ markdownify not installed — run: pip install markdownify")
        sys.exit(1)

    main_match = re.search(r'<main[^>]*>(.*?)</main>', html, re.DOTALL)
    content_html = main_match.group(1) if main_match else html

    md = markdownify.markdownify(
        content_html,
        strip=["script", "style", "nav", "footer", "header", "button", "figure", "svg", "details", "summary"]
    )
    md = re.sub(r"\n{3,}", "\n\n", md).strip()
    md = re.sub(r"!\[.*?\]\(.*?\)", "", md)
    md = re.sub(r"\n{3,}", "\n\n", md)

    title_match = re.search(r"<title[^>]*>(.*?)</title>", html, re.DOTALL | re.IGNORECASE)
    title = title_match.group(1).strip() if title_match else ""
    if not title:
        h1_match = re.search(r"<h1[^>]*>(.*?)</h1>", content_html, re.DOTALL | re.IGNORECASE)
        title = re.sub(r"<[^>]+>", "", h1_match.group(1)).strip() if h1_match else "Untitled"

    sources = extract_sources_from_html(html)
    sources_md = "\n".join(f"{i+1}. [{s[0]}]({s[1]})" for i, s in enumerate(sources))

    now = _dt.datetime.now(_dt.timezone.utc).isoformat()
    return (
        f'---\ntitle: "{title}"\ndate: "{now}"\npublished: true\n'
        f'source: Odysseus Deep Research\ntags: ""\n---\n\n{md}\n\n'
        f'---\n\n**References:**\n\n{sources_md}\n'
    )


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^a-z0-9\s-]", "", text)
    text = re.sub(r"[\s_-]+", "-", text)
    return text.strip("-")[:60] or "post"


def list_reports(client: OdysseusClient):
    # Odysseus doesn't have a list endpoint — show instructions instead
    print("\n📋 To find report IDs:")
    print(f"   1. Open Odysseus at {ODYSSEUS_URL}")
    print("   2. Run a Deep Research query")
    print("   3. Open the report — the URL shows the ID (e.g. rp-a6252bffa18d)")
    print("   4. Run: python3 scripts/pull_from_odysseus.py <report_id>")
    print()


def pull_report(client: OdysseusClient, report_id: str, publish: bool = False) -> bool:
    print(f"📡 Fetching report {report_id}...")

    html = client.get(f"/api/research/report/{report_id}")
    if not html:
        return False

    if isinstance(html, dict):
        html = html.get("content", html.get("html", html.get("report", "")))
        if not html:
            print(f"❌ No HTML content in response")
            return False

    print(f"📝 Converting HTML → markdown...")
    markdown = html_to_markdown(html)

    title_match = re.search(r'^title:\s*"(.+)"', markdown, re.MULTILINE)
    title = title_match.group(1) if title_match else report_id
    slug = slugify(title)
    filename = f"{slug}.md"

    os.makedirs(INCOMING_DIR, exist_ok=True)
    filepath = os.path.join(INCOMING_DIR, filename)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(markdown)

    print(f"✅ Saved: content/incoming/{filename}")
    print(f"   Title: {title}")
    print(f"   Size: {len(markdown)} bytes")

    if publish:
        print("\n🚀 Publishing...")
        import subprocess
        result = subprocess.run(
            [sys.executable, os.path.join(PROJECT_ROOT, "scripts", "publish_incoming.py")],
            cwd=PROJECT_ROOT
        )
        return result.returncode == 0

    return True


def main():
    parser = argparse.ArgumentParser(description="Pull research reports from Odysseus")
    parser.add_argument("report_id", nargs="?", help="Report ID (e.g. rp-a6252bffa18d)")
    parser.add_argument("--list", action="store_true", help="List recent reports")
    parser.add_argument("--publish", action="store_true", help="Auto-publish after pulling")
    args = parser.parse_args()

    password = load_password()
    if not password:
        print("❌ No password found. Set ODYSSEUS_PASS or check ~/Projects/Odysseus/.env")
        sys.exit(1)

    client = OdysseusClient(ODYSSEUS_URL)

    print(f"🔐 Logging in to Odysseus ({ODYSSEUS_URL})...")
    if not client.login(ODYSSEUS_USER, password):
        sys.exit(1)
    print("✅ Logged in")

    if args.list:
        list_reports(client)
        return 0

    if not args.report_id:
        parser.error("report_id is required (or use --list)")

    success = pull_report(client, args.report_id, publish=args.publish)
    return 0 if success else 1


if __name__ == "__main__":
    raise SystemExit(main())
