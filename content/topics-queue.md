# Topics queue for scheduled posting

How it works (since 2026-11-27): this is the to-write list for hand-written
posts. The scheduled generator is turned off. Take the first unchecked line,
write the post, drop it into `content/incoming/`, and mark the line `[x]`
once the draft is in. (The old `scheduled-post.yml` used this same list.) Add new topics at the
bottom. If the queue runs out, the scheduled run fails loudly instead of
inventing a topic — add more lines, don't let it guess.

Format: one topic per line, `- [ ] Topic title`. Keep topics specific —
a named tool, a comparison, or a concrete technique — not generic themes.

- [x] Pinecone vs Weaviate vs Qdrant: picking a vector database for a small RAG app
- [x] Claude Code vs Cursor: which AI coding assistant earns its $20 a month
- [x] How I built a private RAG assistant that answers only from my own documents
- [x] BM25 plus embeddings: why hybrid search beats pure vector search for technical docs
- [x] Chunking strategy for RAG: 500 tokens with 50 overlap, and when to break the rule
- [x] LangChain vs LlamaIndex: which framework to reach for first
- [ ] CrewAI multi-agent workflows: where role-based agents actually help
- [ ] Groq vs standard APIs: what sub-second LLM inference changes in practice
- [ ] Weights & Biases for solo builders: experiment tracking without the enterprise overhead
- [ ] Replicate: running open models in the cloud without managing GPUs
- [ ] Vercel AI SDK: one interface for streaming LLM apps across providers
- [ ] GPT-4o vs Claude Sonnet for code review: a practical comparison
- [ ] The AI agent stack: four layers every production agent needs
- [ ] Retrieval-augmented generation in 2026: what still breaks and how to fix it
- [ ] Small law firms and AI: the document chase is the first workflow worth automating
- [ ] Prompt engineering that survives contact with real users: five techniques
- [ ] LLM evaluation on a budget: how to know if your RAG answers are actually right
- [ ] Local-first AI: running qwen2.5 on Ollama for private drafts and research
- [ ] From prototype to pilot: shipping an AI workflow to a real client in a week
- [ ] Semantic search vs keyword search: when embeddings earn their keep
- [ ] AI coding agents: what a one-person team can ship in a weekend
- [ ] The hidden cost of LLM apps: tokens, latency, and where the bill actually goes
- [ ] Claude Artifacts vs ChatGPT Canvas: which canvas fits a builder's workflow
- [ ] Open-source models in production: what GPT-OSS and Gemma change for small teams
