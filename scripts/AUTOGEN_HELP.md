# Auto-generate Post — Help & Runbook

## Paths
- Script: `scripts/auto_generate_post.py`
- Help doc: `scripts/AUTOGEN_HELP.md`
- Deps: `scripts/requirements.txt` (stdlib-only; file kept for CI/extensibility)
- Drafts output: `content/drafts/`
- GH Actions workflow: `.github/workflows/auto_generate_post.yml`
- LaunchAgent plist: `~/Library/LaunchAgents/com.papajo.aishowcase.autogen.plist`
- Launchd logs: `~/Library/Logs/aishowcase_autogen.log`

## Purpose
Generates draft markdown posts via an LLM (OpenAI). Saves drafts to `content/drafts/<timestamp>-<slug>.md`
with YAML frontmatter. If `ADMIN_API_URL` + `ADMIN_API_TOKEN` are set, it also POSTs the draft to that
endpoint so it can be created in the app DB for admin review. Without an API key it runs in **stub mode**
(placeholder content) so the pipeline stays testable.

## Schedule (all aligned to Monday 12:00)
- **GH Action:** `cron: '0 12 * * 1'` → Monday 12:00 **UTC**
- **launchd plist:** Weekday 2 (Mon), 12:00 → Monday 12:00 **local time**
- Note: these align to the same wall-clock instant only when the machine runs on UTC. Adjust the plist
  hour by your UTC offset if you need exact-instant alignment.

## Quick test (local)
```bash
cd /Users/padoshi/Projects/ai-showcase
python3 -m pip install --upgrade pip
pip install -r scripts/requirements.txt        # optional; stdlib-only
export OPENAI_API_KEY="sk-..."                  # omit to test stub mode
python3 scripts/auto_generate_post.py --topic "a notable new AI tool" --publish false
ls -lt content/drafts/                          # newest draft appears here
```

## Env vars
- `OPENAI_API_KEY` (required for real content; stub mode if absent)
- `OPENAI_MODEL` (optional, default `gpt-4o-mini`)
- `ADMIN_API_URL` (optional) — POST endpoint to create drafts in the app
- `ADMIN_API_TOKEN` (optional) — bearer token for `ADMIN_API_URL`
- CLI flags: `--topic "..."` (required), `--publish true|false`, `--model <name>`

## GitHub Actions — setting up secrets
The workflow reads `OPENAI_API_KEY` (and optionally `ADMIN_API_URL` / `ADMIN_API_TOKEN`) from repo secrets.

UI steps (the GitHub UI is confusing here):
1. Repo → **Settings** → **Secrets and variables** → **Actions** (NOT Codespaces/Dependabot)
2. Stay on the **Secrets** tab → click **New repository secret** (not *Environment* secret)
3. **Name:** `OPENAI_API_KEY` (exact case, underscores, no quotes/spaces)
4. **Secret:** paste the raw `sk-...` value (no quotes, no trailing newline)
5. **Add secret**

Direct link: `https://github.com/papajo/aishowcase/settings/secrets/actions`

Verify from CLI: `gh secret list` (shows names only; values are write-only).

## Running / testing the GH Action
```bash
gh workflow run "Auto-Generate Posts" --ref main
RUN_ID=$(gh run list --workflow="Auto-Generate Posts" --limit 1 --json databaseId --jq '.[0].databaseId')
gh run watch "$RUN_ID" --exit-status
git pull           # bring down the draft the Action committed
```
Or in the browser: **Actions** tab → "Auto-Generate Posts" → **Run workflow**.

## Launchd (macOS)
- Check loaded: `launchctl list | grep com.papajo.aishowcase.autogen`
- Tail logs: `tail -f ~/Library/Logs/aishowcase_autogen.log`
- Manual run: `/usr/bin/env python3 scripts/auto_generate_post.py --topic "test" --publish false`
- Reload after editing the plist:
  ```bash
  launchctl unload ~/Library/LaunchAgents/com.papajo.aishowcase.autogen.plist
  launchctl load -w ~/Library/LaunchAgents/com.papajo.aishowcase.autogen.plist
  ```

## Common issues & fixes
- **GH Action says "No changes detected" even though a draft was generated.**
  Root cause: `git diff --quiet` ignores *untracked* files, and new drafts are untracked. **Fixed** by
  detecting changes with `git status --porcelain` instead (see the "Check for changes" step). If you copy
  this workflow elsewhere, keep that change.
- **Workflow runs the wrong script / `autogen.py not found`.** The workflow must call
  `python scripts/auto_generate_post.py ...` — the script lives in `scripts/`, not the repo root.
- **Stub/placeholder content.** `OPENAI_API_KEY` not set in the run environment. Locally: `export` it.
  In CI: add the repo secret (see above).
- **Literal/off-topic content.** The `--topic` value is passed verbatim to the LLM. Vague topics like
  `"weekly run"` produce literal results (e.g. about jogging). Use a descriptive topic.
- **Dependency errors (ModuleNotFoundError).** Run `pip install -r scripts/requirements.txt`.
- **launchd permission/ownership errors.** Ensure the plist is owned by you and `chmod 644`.
- **Admin POST fails (401/403).** Verify `ADMIN_API_TOKEN` / `ADMIN_API_URL` and token scope.
- **Git push in GH Action fails.** The workflow needs `permissions: contents: write` (already set).

## Migration notes — switching to a Next.js API route (Option 1) later
- Reuse the generation logic inside an API route (e.g. `app/api/autogen/route.ts`).
- Keep core generation in one place (a small service or ported TS) so cron + API share it.
- For DB writes, call Prisma from the API route, or have the script POST to that route instead of
  writing files directly. The script already supports `ADMIN_API_URL`/`ADMIN_API_TOKEN` for this.

## Verification checklist
- [x] Local run produces a draft in `content/drafts/`.
- [x] GH Action runs, generates, and commits a real draft (verified with live `OPENAI_API_KEY`).
- [x] Change detection catches untracked drafts (`git status --porcelain`).
- [x] Schedules aligned to Monday 12:00.
- [ ] Confirm launchd fires on schedule (check the log after the next Monday run).
