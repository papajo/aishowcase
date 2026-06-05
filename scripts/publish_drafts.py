#!/usr/bin/env python3
"""
publish_drafts.py

Scans content/drafts/ for Markdown files marked with 'published: true' 
in their frontmatter and moves them to content/posts/.
"""
import os
import re
import shutil
import datetime as _dt

# Paths relative to project root
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DRAFTS_DIR = os.path.join(PROJECT_ROOT, "content", "drafts")
POSTS_DIR = os.path.join(PROJECT_ROOT, "content", "posts")

def is_published(filepath: str) -> bool:
    """Checks if the markdown file has 'published: true' in its frontmatter."""
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            # We only need the first few lines for frontmatter
            content = "".join([f.readline() for _ in range(20)])
        
        # Matches 'published: true' or 'published: True'
        return bool(re.search(r'^published:\s*true', content, re.M | re.I))
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
        return False

def publish():
    if not os.path.exists(DRAFTS_DIR):
        print(f"Error: Drafts directory not found at {DRAFTS_DIR}")
        return

    os.makedirs(POSTS_DIR, exist_ok=True)

    print(f"[{_dt.datetime.now().isoformat()}] Scanning {DRAFTS_DIR} for published drafts...")
    
    moved_count = 0
    for filename in os.listdir(DRAFTS_DIR):
        if not filename.endswith(".md"):
            continue
            
        src_path = os.path.join(DRAFTS_DIR, filename)
        dest_path = os.path.join(POSTS_DIR, filename)

        if is_published(src_path):
            print(f"✅ Publishing: {filename}")
            try:
                shutil.move(src_path, dest_path)
                moved_count += 1
            except Exception as e:
                print(f"❌ Failed to move {filename}: {e}")
        else:
            # Just skip unreviewed/unpublished files
            pass

    if moved_count > 0:
        print(f"Successfully published {moved_count} new posts to {POSTS_DIR}")
    else:
        print("No new published drafts found.")

if __name__ == "__main__":
    publish()
