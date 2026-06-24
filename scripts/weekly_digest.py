#!/usr/bin/env python3
"""
Send a weekly HTML email digest of recent posts via Resend.

Usage:
  python3 scripts/weekly_digest.py --to "user@example.com" --from "news@aishowcase.com"

Env vars:
  RESEND_API_KEY  Required to actually send (dry-run without it)
"""
import argparse, glob, os, re, sys

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
POSTS_DIR = os.path.join(PROJECT_ROOT, "content", "posts")

try:
    import resend
except ImportError:
    resend = None


def parse_post(filepath: str) -> dict | None:
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    title = re.search(r'^title:\s*"(.*?)"', content, re.M)
    date = re.search(r'^date:\s*"(.*?)"', content, re.M)
    published = re.search(r"^published:\s*(true|false)", content, re.M)
    if not title or not date or not published or published.group(1) != "true":
        return None
    body = re.sub(r"^---.*?---", "", content, flags=re.DOTALL).strip()
    return {
        "title": title.group(1),
        "date": date.group(1),
        "summary": body[:200].replace("\n", " ") + "...",
        "url": f"https://aishowcase.qzz.io/journal/{os.path.basename(filepath).replace('.md', '')}",
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--to", required=True)
    parser.add_argument("--from", dest="from_email", required=True)
    args = parser.parse_args()

    files = glob.glob(os.path.join(POSTS_DIR, "*.md"))
    posts = sorted([p for p in (parse_post(f) for f in files) if p], key=lambda x: x["date"], reverse=True)

    if not posts:
        print("No published posts found. Exiting.")
        return

    items = "".join(f"""
    <div style="margin-bottom:25px;border-bottom:1px solid #eee;padding-bottom:15px;">
      <h2><a href="{p['url']}" style="color:#007bff;text-decoration:none;">{p['title']}</a></h2>
      <p style="color:#666;font-size:0.9em;">{p['date']}</p>
      <p style="color:#333;line-height:1.5;">{p['summary']}</p>
    </div>""" for p in posts)

    html = f"""<!DOCTYPE html><html><body style="font-family:sans-serif;color:#333;max-width:600px;margin:0 auto;padding:20px;">
      <header style="border-bottom:2px solid #007bff;padding-bottom:10px;margin-bottom:30px;">
        <h1 style="margin:0;">🚀 AI Showcase Weekly</h1>
        <p style="color:#666;margin:5px 0 0 0;">Your weekly roundup of the latest in AI.</p>
      </header>
      <main>{items}</main>
      <footer style="margin-top:40px;font-size:0.8em;color:#999;text-align:center;">
        <p>© 2026 AI Showcase. <a href="https://aishowcase.qzz.io" style="color:#999;">Unsubscribe</a></p>
      </footer>
    </body></html>"""

    api_key = os.environ.get("RESEND_API_KEY")
    if not api_key:
        print("⚠️  RESEND_API_KEY not set — DRY RUN MODE")
        print(f"Would send to: {args.to}")
        print(html[:500] + "...")
        return

    if resend is None:
        print("❌ 'resend' not installed. Run: pip install resend"); sys.exit(1)

    resend.api_key = api_key
    print(f"Sending email to {args.to}...")
    resend.Emails.send({"from": args.from_email, "to": args.to, "subject": f"🚀 AI Showcase Weekly: {len(posts)} New Updates", "html": html})
    print("✅ Email sent!")


if __name__ == "__main__":
    main()
