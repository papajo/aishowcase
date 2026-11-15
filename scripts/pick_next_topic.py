#!/usr/bin/env python3
"""Pick the next topic from content/topics-queue.md.

The scheduled workflow takes the first unchecked line, generates a post
about it, and only marks it used after the post passes its checks and is
committed. Marking is a separate step on purpose: a failed generation must
not burn a topic.

Usage:
  python3 scripts/pick_next_topic.py              # print next topic
  python3 scripts/pick_next_topic.py --mark-used  # print + mark it [x]
  python3 scripts/pick_next_topic.py --list       # print remaining topics
  python3 scripts/pick_next_topic.py --count      # print remaining count

Exit codes: 0 ok, 1 queue empty, 2 queue file missing.
"""
from __future__ import annotations

import argparse
import os
import re
import sys

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEFAULT_QUEUE = os.path.join(PROJECT_ROOT, "content", "topics-queue.md")

LINE_RE = re.compile(r"^(\s*)- \[ \] (.+?)\s*$")


def read_lines(path: str) -> list[str]:
    with open(path, encoding="utf-8") as f:
        return f.readlines()


def remaining(lines: list[str]) -> list[tuple[int, str]]:
    out = []
    for i, line in enumerate(lines):
        m = LINE_RE.match(line)
        if m:
            out.append((i, m.group(2)))
    return out


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(description="Pick the next topic from the queue.")
    p.add_argument("--queue", default=DEFAULT_QUEUE)
    p.add_argument("--mark-used", action="store_true",
                   help="Mark the picked topic [x] in the queue file")
    p.add_argument("--list", action="store_true", help="List remaining topics")
    p.add_argument("--count", action="store_true", help="Print remaining count")
    args = p.parse_args(argv)

    if not os.path.isfile(args.queue):
        print(f"ERROR: queue file not found: {args.queue}", file=sys.stderr)
        return 2

    lines = read_lines(args.queue)
    todo = remaining(lines)

    if args.list:
        for _, topic in todo:
            print(f"- {topic}")
        return 0
    if args.count:
        print(len(todo))
        return 0

    if not todo:
        print("ERROR: topics queue is empty — add topics to "
              "content/topics-queue.md", file=sys.stderr)
        return 1

    idx, topic = todo[0]
    if args.mark_used:
        lines[idx] = lines[idx].replace("- [ ]", "- [x]", 1)
        with open(args.queue, "w", encoding="utf-8") as f:
            f.writelines(lines)
    print(topic)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
