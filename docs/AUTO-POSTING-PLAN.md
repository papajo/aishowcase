# Auto-Posting Plan — fresh articles on a schedule, minimal human input

> **Update 2026-11-27 — schedule turned OFF.** The LLM API path failed twice in
> one week (HTTP 410 when the configured model hit end of life on Nov 25; read
> timeouts on Nov 27). Posts are now written by hand (Muse drafts, joshi
> reviews) and fed in through `content/incoming/` → `content/drafts/`. See
> "Pipeline 3: Drop Folder" in CONTENT-WORKFLOW.md. `content/topics-queue.md`
> stays the to-write list. The plan below is kept for history.

Status (historical): built on branch `auto-posting-schedule`, **not enabled yet**.
It needs two picks from joshi before the schedule goes live (see Decisions).

## Goal

Keep aishowcase.qzz.io publishing fresh journal articles on a regular
schedule without joshi having to write, research, or babysit each one —
while never letting a placeholder, a duplicate, or a fake reference reach
the live blog.

## Where things stand today (checked 2026-11-15)

- 15 published posts, 5 drafts, 0 incoming. The newest posts are dated
  July 2026 — nothing has published in ~4 months. The manual
  `workflow_dispatch` generator exists but nobody runs it.
- The generator (`scripts/auto_generate_post.py`) already works in GitHub
  Actions: NVIDIA API Catalog, model `meta/llama-3.1-8b-instruct`, saves a
  draft or a published post, commits and pushes, Vercel auto-deploys.
- The research pipeline (`scripts/research_and_post.py`) is **not** used
  here: it needs Odysseus in Docker plus Ollama on joshi's Mac. That is
  the wrong shape for an unattended schedule (local machine, disk floor,
  5 GB per model).
- A scheduled run already failed once in a way this plan fixes: the June
  2026 "cron run" drafts are stubs — "Stub content: NVIDIA_API_KEY not
  set, generated placeholder." They stayed drafts, but only by luck.

## How one scheduled run works

```
cron (Mon/Wed/Fri 09:00 EST)
  → pick next topic from content/topics-queue.md
  → generate with auto_generate_post.py (NVIDIA API)
  → check: no stub markers, ≥150 words, every reference link resolves
  → only then mark the topic used, commit, push
  → Vercel auto-deploys
```

1. **Topic queue** — `content/topics-queue.md`, 24 topics seeded
   (tool comparisons, RAG technique, small-firm AI workflows). The picker
   (`scripts/pick_next_topic.py`) takes the first unchecked line. If the
   queue is empty the run fails loudly instead of inventing a topic.
   At 3×/week the seed queue lasts ~8 weeks; add topics at the bottom
   whenever, no code change needed.
2. **Generation** — the existing script, unchanged in behaviour except
   one guard (below). No `--force`: the built-in duplicate-title check
   stays on, so a reworded repeat of an existing post is refused.
3. **Checks** — `scripts/check_post_links.py` runs on the generated file
   before anything is committed. It fails the run on stub/placeholder
   text, on a body under 150 words, and on any dead reference link.
   A failed run publishes nothing and the topic stays in the queue.
4. **Publish** — see Decisions. Draft mode is the default: the post
   lands in `content/drafts/` and publishing is one command
   (`python3 scripts/publish_drafts.py`) or one click in `/admin/journal`.

## Guardrails added by this plan (all on the branch)

- **Stub guard** in `auto_generate_post.py`: new `--allow-stub` flag,
  default false. Without an API key the run now exits with an error
  instead of writing a stub post. Local test drafts can still pass
  `--allow-stub true`.
- **Reference check** (`scripts/check_post_links.py`): the generator's
  prompt asks for "real-looking" reference URLs, which is exactly how
  fake citations happen. Every link must now resolve (2xx/3xx; 429 and
  bot-blocks count as alive, with a warning).
- **Queue exhaustion = loud failure**, not a guessed topic.
- **No overlapping runs** (`concurrency` group in the workflow).
- **Topic marked used only after the checks pass**, so a failed
  generation does not burn a topic.

## Decisions needed before enabling

### 1. Cadence — pick one

| | Pros | Cons |
|---|---|---|
| **A. Mon / Wed / Fri, 09:00 EST (recommended)** | 3 posts/week keeps the journal visibly alive; review load stays small | Not literally "daily" |
| B. Daily, 09:00 EST | Matches the DailyPost/journal concept | 7 posts/week of unreviewed LLM output is a lot to stand behind; queue burns in ~3 weeks |
| C. Weekly (e.g. Monday) | Lightest touch, easiest to review | Blog looks quiet between posts |

The workflow file currently has A. Changing it is one cron line.

### 2. Publish mode — pick one

| | What happens | Human input |
|---|---|---|
| **A. Draft + one-tap publish (recommended)** | Each run lands a draft; joshi publishes when he glances at it (or I check it in the morning roundup and flag it) | ~2 minutes, a few times a week; nothing ever goes live unread |
| B. Full auto-publish | Draft step skipped; a checked post goes live on push | Zero — but the only eyes on it are the automated checks |

Start with A. Flip to B later only after a few weeks of drafts read
clean — the flip is one word (`PUBLISH` default in the workflow, or the
dispatch input).

## Secrets checklist (do this before the first run)

Repo → Settings → Secrets and variables → Actions. All three are
already read by the workflows; nothing new is stored in code.

- [ ] `NVIDIA_API_KEY` — `nvapi-` key from build.nvidia.com. **Verify it
      exists and is not expired.** If it is missing, the run now fails
      loudly instead of writing stubs — that is the guard working.
- [ ] `NVIDIA_MODEL` — the script default, `meta/llama-3.1-8b-instruct`,
      was listed by two sources as retired on NVIDIA in Aug 2026, so it
      may already answer HTTP 410. Set this to a model that answers
      today (e.g. a current free endpoint model) and confirm it on the
      first smoke-test run. If the first run fails on the model, this is
      the first thing to change — not the code.
- [ ] `NVIDIA_BASE_URL` — optional; leave unset to use the default
      `https://integrate.api.nvidia.com/v1`.

## Cost

- **NVIDIA hosted API: $0.** Free tier, ~40 requests per minute, no
  card. One post costs 2 requests (article + tags). Two honest caveats:
  the trial terms say the free endpoints are for testing/evaluation,
  not production, and models can be retired without notice (see the
  `llama-3.1-8b` note above) — so treat the free tier as the starting
  point, not a guarantee.
- **Fallback if NVIDIA stops suiting it:** the same script already
  accepts any OpenAI-compatible endpoint. OpenAI `gpt-4o-mini` via
  `NVIDIA_BASE_URL=https://api.openai.com/v1` would cost a few cents
  per post — the cheapest honest paid route.
- **Hero images:** generated by `scripts/generate_heroes.py` via
  Pollinations (free tier) inside the generator; a failure there only
  skips the image, it does not fail the post.

## Failure modes (what happens, what to do)

| Failure | What you see | Fix |
|---|---|---|
| `NVIDIA_API_KEY` missing/expired | Run fails at generation, nothing committed | Add/rotate the secret, re-run from Actions |
| Model retired (HTTP 410) | Run fails at generation | Set `NVIDIA_MODEL` to a live model |
| Dead reference link / stub / short post | Run fails at the check step, draft stays uncommitted | Re-run (new generation) or edit the draft by hand |
| Queue empty | Run fails at the pick step | Add topics to `content/topics-queue.md` |
| GitHub Actions outage / Vercel deploy fails | No post that day | Nothing lost; next scheduled run picks up |

GitHub emails the repo owner when a scheduled workflow fails, so a
silent stall is unlikely. I can also check for new drafts/posts in the
morning roundup if you want that.

## Enabling it (after the two picks)

1. Confirm the three secrets above.
2. Smoke test: Actions → "Scheduled Post" → Run workflow → publish
   `false`. Check the draft in `content/drafts/` and the run log.
   If the model is dead, fix `NVIDIA_MODEL` and re-run.
3. Merge branch `auto-posting-schedule` to `main`. The cron starts on
   its own schedule after merge — no Mac, no local process, nothing to
   keep running.
4. (Only if mode B was picked) set the workflow's `PUBLISH` default
   to `true`.

## What this plan deliberately does not do

- No Odysseus / Ollama / local-Mac step in the loop. Nothing here
  depends on joshi's laptop being on, or on his disk.
- No auto-posting to LinkedIn/X/social — the blog only. Social can be
  a separate decision later.
- No change to the manual `workflow_dispatch` generator or to
  `publish-incoming.yml` — both keep working as before.
- No new paid subscriptions. The only money that could ever appear is
  the optional OpenAI fallback above.
