# Research → Blog Post Pipeline

Wires Odysseus Deep Research into the AI Showcase blog. One command researches, writes, publishes, and deploys.

## Prerequisites

- **Odysseus** running (`docker compose up` in the odysseus repo)
- **Ollama** running with `qwen2.5:7b` (or set `OPENAI_BASE_URL` to another provider)
- **Project on Vercel** auto-deploying from the `main` branch

## Quick Start

```bash
# One-shot: research → write → publish → deploy
ODYSSEUS_INTERNAL_TOKEN=dev-blog-integration-token \
OPENAI_API_KEY="ollama" \
OPENAI_BASE_URL="http://localhost:11434/v1" \
python3 scripts/research_and_post.py \
  --topic "Your topic here" \
  --publish \
  --timeout 900

git add -A && git commit -m "New post: Your topic here"
git push
# Vercel auto-deploys
```

## Two-Phase Workflow (if research takes long)

### Phase 1: Start Research

```bash
ODYSSEUS_INTERNAL_TOKEN=dev-blog-integration-token \
python3 scripts/research_and_post.py \
  --topic "Your topic here" \
  --timeout 900
```

Research runs in Odysseus — might take 5–15 min depending on topic complexity.

### Phase 2: Check & Generate Post

When it finishes, the script auto-generates a draft post using qwen2.5:7b locally.

If the script timed out but research completed in the background:

```bash
# 1. List research files in the container
docker exec odysseus-odysseus-1 ls /app/data/deep_research/

# 2. Check status of a session
docker exec odysseus-odysseus-1 cat /app/data/deep_research/rp-<session-id>.json \
  | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('status'), len(d.get('sources',[])))"

# 3. Generate post from completed research
cd /Users/padoshi/Projects/ai-showcase
docker cp odysseus-odysseus-1:/app/data/deep_research/rp-<session-id>.json .

OPENAI_API_KEY="ollama" \
OPENAI_BASE_URL="http://localhost:11434/v1" \
python3 scripts/research_and_post.py \
  --topic "Your topic here" \
  --no-research \
  --research-id rp-<session-id> \
  --publish
```

### Phase 3: Deploy

```bash
git add -A && git commit -m "New post: Your topic here"
git push
# Vercel auto-deploys the site
```

## Using Other LLM Providers

### OpenRouter (if key is valid)

```bash
OPENAI_API_KEY="$OPENROUTER_API_KEY" \
OPENAI_BASE_URL="https://openrouter.ai/api/v1" \
OPENAI_MODEL="openrouter/free" \
# ... rest of command
```

### OpenAI (requires active billing)

```bash
OPENAI_API_KEY="sk-..." \
OPENAI_BASE_URL="https://api.openai.com/v1" \
OPENAI_MODEL="gpt-4o-mini" \
# ... rest of command
```

## Options

| Flag | Default | Description |
|---|---|---|
| `--topic` | (required) | Topic to research and write about |
| `--publish` | false | Save to `content/posts/` (published) vs `content/drafts/` |
| `--model` | gpt-4o-mini | LLM model for writing |
| `--no-research` | false | Skip research, use existing research data |
| `--research-id` | — | Session ID of existing research to use with `--no-research` |
| `--force` | false | Skip duplicate title check |
| `--timeout` | 600 | Max seconds to wait for research to finish |

## Tips

- Research JSON files (`rp-*.json`) are gitignored — no clutter
- Always check the draft before pushing — qwen2.5:7b can be terse
- Add `excerpt:` to frontmatter for better card previews on the site
- Check research progress: `docker logs odysseus-odysseus-1 --tail 20`
