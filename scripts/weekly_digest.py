#!/usr/bin/env python3
"""
weekly_digest.py

Generates an HTML email digest of recent published posts and sends it via Resend.

Usage:
  python3 scripts/weekly_digest.py --to "user@example.com" --from "news@aishowcase.com"
"""
import argparse
import datetime as _dt
import os
import glob
import re
import sys
import urllib.parse

try:
    import resend
except ImportError:
    resend = None

POSTS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "content", "posts")

def parse_post(filepath: str) -> dict | None:
    """Extracts title, date, and first 200 chars of content from a markdown file."""
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Very basic frontmatter parser
    title_match = re.search(r'^title:\s*"(.*?)"', content, re.M)
    date_match = re.search(r'^date:\s*"(.*?)"', content, re.M)
    published_match = re.search(r'^published:\s*(true|false)', content, re.M)

    if not title_match or not date_match or not published_match:
        return None

    if published_match.group(1) != "true":
        return None

    # Get body (strip frontmatter)
    body = re.sub(r'^---.*?---', '', content, flags=re.DOTALL).strip()
    summary = body[:200].replace("\n", " ") + "..."

    return {
        "title": title_match.group(1),
        "date": date_match.group(1),
        "summary": summary,
        "url": f"https://aishowcase.com/posts/{os.path.basename(filepath).replace('.md', '')}" # Mock URL
    }

def generate_html(posts: list[dict]) -> str:
    """Generates a simple, clean HTML email template."""
    items_html = ""
    for p in posts:
        items_html += f"""
        <div style="margin-bottom: 25px; border-bottom: 1px solid #eee; padding-bottom: 15px;">
            <h2 style="margin: 0 0 10px 0;"><a href="{p['url']}" style="color: #007bff; text-decoration: none;">{p['title']}</a></h2>
            <p style="color: #666; font-size: 0.9em;">{p['date']}</p>
            <p style="color: #333; line-height: 1.5;">{p['summary']}</p>
        </div>
        """

    return f"""
    <!DOCTYPE html>
    <html>
    <body style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <header style="border-bottom: 2px solid #007bff; padding-bottom: 10px; margin-bottom: 30px;">
            <h1 style="margin: 0;">🚀 AI Showcase Weekly</h1>
            <p style="color: #666; margin: 5px 0 0 0;">Your weekly roundup of the latest in AI.</p>
        </header>
        <main>
            {items_html if items_html else "<p>No new posts this week. Stay tuned!</p>"}
        </main>
        <footer style="margin-top: 40px; font-size: 0.8em; color: #999; text-align: center;">
            <p>&copy; 2026 AI Showcase. <a href="https://aishowcase.com" style="color: #999;">Unsubscribe</a></p>
        </footer>
    </body>
    </html>
    """

def main():
    parser = argparse.ArgumentParser(description="Send weekly digest via Resend.")
    parser.add_argument("--to", required=True, help="Recipient email address.")
    parser.add_argument("--from", dest="from_email", required=True, help="Sender email address.")
    args = parser.parse_args()

    print(f"Scanning {POSTS_DIR} for posts...")
    files = glob.glob(os.path.join(POSTS_DIR, "*.md"))
    posts = []
    for f in files:
        parsed = parse_post(f)
        if parsed:
            posts.append(parsed)

    # Sort by date descending
    posts.sort(key=lambda x: x['date'], reverse=True)

    if not posts:
        print("No published posts found. Exiting.")
        return

    print(f"Found {len(posts)} posts. Generating HTML...")
    html_content = generate_html(posts)

    api_key = os.environ.get("RESEND_API_KEY")
    if not api_key:
        print("⚠️  RESEND_API_KEY not set. --- DRY RUN MODE ---")
        print("Next email would be sent to:", args.to)
        print("HTML preview snippet:")
        print(html_content[:500] + "...")
        return

    if resend is None:
        print("❌ Error: 'resend' library not installed. Run 'pip install resend'.")
        sys.exit(1)

    try:
        resend.api_key = api_key
        print(f"Sending email to {args.to} via Resend...")
        params = {
            "from": args.from_email,
            "to": args.to,
            "subject": f"🚀 AI Showcase Weekly: {len(posts)} New Updates",
            "html": html_content,
        }
        resend.Emails.send(params)
        print("✅ Email sent successfully!")
    except Exception as e:
        print(f"❌ Failed to send email: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
