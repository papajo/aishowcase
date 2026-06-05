# Auto-generate Post — Help & Runbook

Path:
- Script: /Users/padoshi/Projects/ai-showcase/scripts/auto_generate_post.py
- Help doc: scripts/AUTOGEN_HELP.md
- LaunchAgent plist: ~/Library/LaunchAgents/com.papajo.aishowcase.autogen.plist
- Launchd logs: ~/Library/Logs/aishowcase_autogen.log
- GH Actions workflow: .github/workflows/auto_generate_post.yml

Purpose:
Generates draft markdown posts via an LLM. Saves drafts to content/drafts/ and can POST to an admin API when ADMIN_API_URL and ADMIN_API_TOKEN are provided.

Quick test (local):
1. Ensure deps: `python3 -m pip install --upgrade pip` then `pip install -r scripts/requirements.txt` (or `pip install openai`).
2. Export key: `export OPENAI_API_KEY="sk-..."`
3. Run: `python3 scripts/auto_generate_post.py --topic "test post" --publish false`

If the script prints a generated draft path (content/drafts/*.md), open that file to review.

Env vars:
- OPENAI_API_KEY (required) — LLM provider key.
- ADMIN_API_URL (optional) — POST endpoint to create drafts in the app.
- ADMIN_API_TOKEN (optional) — bearer token for ADMIN_API_URL.
- Additional flags: --publish true/false (script supports publish toggle).

Launchd (macOS) — what was created:
- Plist: ~/Library/LaunchAgents/com.papajo.aishowcase.autogen.plist
- To check loaded agents: `launchctl list | grep com.papajo.aishowcase.autogen`
- Tail logs: `tail -f ~/Library/Logs/aishowcase_autogen.log`
- Test run now (manual): `/usr/bin/env python3 /Users/padoshi/Projects/ai-showcase/scripts/auto_generate_post.py --topic "test" --publish false`
- Unload: `launchctl unload ~/Library/LaunchAgents/com.papajo.aishowcase.autogen.plist`
- Load: `launchctl load ~/Library/LaunchAgents/com.papajo.aishowcase.autogen.plist`

Common issues & fixes:
- Missing OPENAI_API_KEY → script errors/401: set OPENAI_API_KEY in env or in CI/Secrets.
- Dependency errors (ModuleNotFoundError): run `pip install -r scripts/requirements.txt` or `pip install openai`.
- launchd permission/ownership errors: ensure plist is owned by your user and has 0644 permissions. Use `chown $(whoami) ~/Library/LaunchAgents/com.papajo.aishowcase.autogen.plist` and `chmod 644`.
- Script fails to write drafts: check filesystem permissions and free space; run manually to see trace.
- Admin POST fails (401/403): verify ADMIN_API_TOKEN & ADMIN_API_URL and that token has correct scope.
- Git push in GH Action fails: ensure repo remote & secrets (GITHUB_TOKEN or deploy key) are configured.

Migration notes — switching to Next.js API route later:
- Reuse script logic inside an API route (e.g., pages/api/autogen.ts or app/api/autogen/route.ts).
- Keep core generation logic in a Python microservice or port to TS/Node so both cron and API routes can call the same code.
- For DB writes, prefer calling Prisma from the API route (TypeScript), or have the script POST to the API instead of writing directly to DB.

GH Actions:
- Workflow file added: .github/workflows/auto_generate_post.yml — runs weekly and on-demand. Ensure OPENAI_API_KEY and optional ADMIN_API_TOKEN/ADMIN_API_URL are configured as repository secrets.

Next steps & verification checklist:
- [ ] Run local test command and open generated draft file.
- [ ] Tail launchd log to confirm scheduled runs.
- [ ] Verify GH Actions run manually via Actions > Workflow_dispatch.
- [ ] If desired, I can run the test now and capture output into the log and show the generated draft.

If you want, I can: run the test now and show the draft, or only run and tail the log. Which do you prefer?
