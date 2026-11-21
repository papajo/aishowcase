---
title: "How I built a private RAG assistant that answers only from my own documents"
date: "2026-11-18T21:41:09.974270+00:00"
published: true
source: auto_generate_post.py
tags: "Retrieval-Augmented Generation, Private LLM, Document Indexing, Hybrid Retrieval, Local AI"
---

### Eliminating Hallucinations with Strict Grounding and a Refusal Gate

I upgraded my local-rag repo into a RAG demo that answers only from the documents you give it — and refuses to answer when they don't contain the answer. No LlamaIndex, no Qdrant, no vector database at all in the demo: retrieval is BM25 plus TF-IDF, fused with reciprocal rank fusion, and the answers are verbatim passages copied from the retrieved chunks, cited by source file and chunk. On a 10-question eval set the demo answered 7 correctly and declined the other 3 correctly — 0 false answers, 0 false declines.

#### Key Takeaways

1. **Make the answer extractive, not generative**
   - The demo has no LLM generation step: the answer is a verbatim passage from a retrieved chunk, with its source and chunk number attached, so any answer can be checked by string match.
   - There is nothing to hallucinate, because nothing is being written — the system is a parser of provided text, not a knowledge base. The trade-off is real too: it can only say what the documents already say, in their words.

2. **Add keyword retrieval to vector search — or in this case, instead of it**
   - The base local-rag is vector-only (LanceDB plus a local SIE server running bge-m3 embeddings), and exact terms like "affidavit" or "flat fee" got no boost. The P1 upgrade adds BM25 keyword retrieval alongside TF-IDF cosine similarity, fused with reciprocal rank fusion and an explainable rerank.
   - TF-IDF is a stand-in for the SIE bge-m3 embeddings so the demo runs anywhere with $0 spend and no server. On a real firm's documents, the TF-IDF scorer swaps for the existing store.search call, and BM25, the gate, and the eval harness stay unchanged.

3. **Refuse, and show your work when you do**
   - The relevance gate and refusal check decline with evidence instead of guessing. The demo's best moment is the third question type: asked for a deadline for a specific case, it declines and shows the policy sentence that says why.
   - Honest detail: the gate's 0.35 relevance threshold never fires on the top chunk — the three declines scored 0.70–0.80 and were caught by the shared-terms refusal check instead. The threshold needs rework before I'd trust it as the main guard.

4. **Keep the whole thing stdlib-only and $0**
   - The demo pack runs on plain Python 3.10+ with no dependencies, no API key, no server, no new install. The documents never leave the machine — that is the whole point for a law firm, where the files are the client's.
   - The corpus is 6 fictional firm documents, 16 chunks total. Small on purpose: the eval harness measures precision@1 (1.00 — the top chunk is right every time), precision@3 (0.57 — the 2nd and 3rd chunks are often neighbours from another file), and recall (0.93).

### What's still broken

This is a demo, not a production system, and the post should say so. The `ask` command builds a fresh Markdown-only index instead of reading local-rag's existing LanceDB index, so documents already ingested into local-rag can't be answered yet. An installed copy run with no --corpus flag loads zero chunks and silently declines everything. And 10 questions on fictional documents is a smoke test, not a benchmark — the numbers prove the harness works, not that the system is ready for a real firm.

### Conclusion

Moving RAG from a generic demo to a strict private assistant means shifting focus from "generative capability" to "retrieval precision" — and then to honest measurement. The next steps are concrete: wire `ask` to the existing LanceDB index, fix the packaging so the sample data ships with the install, and re-run the eval. The version a firm would buy is the $750 pilot: same retrieval, same gate, same eval — with a human in the loop and their own documents, not mine.

---

**References:**

1. [local-rag — papajo/local-rag](https://github.com/papajo/local-rag)
2. [P1 upgrade PR #1](https://github.com/papajo/local-rag/pull/1)
