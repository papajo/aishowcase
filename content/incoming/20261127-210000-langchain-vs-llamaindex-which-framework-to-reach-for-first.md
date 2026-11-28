---
title: "LangChain vs LlamaIndex: which framework to reach for first"
date: "2026-11-27T21:00:00+00:00"
published: false
source: hand-written (Muse draft, reviewed by joshi)
tags: "LangChain, LlamaIndex, LangGraph, RAG, AI Agents, Python Frameworks"
---

### Two frameworks that stopped competing

The usual question goes like this: "I want to build an AI app over my own documents. Do I learn LangChain or LlamaIndex?" Two years ago that was a real head-to-head. In late 2026 it mostly isn't. The two projects have moved in different directions. Picking the right one is now less about which is "better" and more about what you are building.

Here is where each one stands as of November 27, 2026, checked against PyPI and the projects' own docs. I did not run any benchmarks for this post, and I won't quote any.

#### Where each one stands today

1. **LangChain is now an agent layer on top of LangGraph**
   - LangChain and LangGraph both shipped 1.0 in October 2025. LangChain's center is now one function, `create_agent`. You give it a model, a list of tools and a system prompt, and it runs the model-and-tools loop for you. It runs on the LangGraph runtime under the hood.
   - LangGraph is the lower-level piece. You use it when you need explicit state, branches, retries, human approval steps or long-running jobs.
   - The 1.0 release came with a promise of no breaking changes until 2.0. That matters if you remember how often older LangChain tutorials broke.
   - Current versions: `langchain` 1.5.2 (November 18, 2026) and `langgraph` 1.2.24 (November 20, 2026). The `langchain` package now needs Python 3.11 or newer.

2. **LlamaIndex is a data framework, and the company's focus has moved to parsing**
   - LlamaIndex is built around getting your data into an LLM app. It gives you loaders for files and sources, indexes, retrievers and query engines. Its README shows a basic vector index over a folder of files in a handful of lines.
   - It also has agents. `FunctionAgent` and `AgentWorkflow` run on its event-driven Workflows package, which now ships separately as `llama-index-workflows` (2.26.1, October 21, 2026).
   - The core framework is still on the 0.x line: `llama-index` 0.14.26 (November 13, 2026), also Python 3.11+.
   - The big change is on the business side. The project README now says the company's primary focus has shifted to LlamaParse, its paid document parsing and extraction platform, plus a free parser called LiteParse. The open-source framework stays available "as an open toolkit". It still gets releases, but it is no longer the main product.

### Which one to reach for first

For a solo builder or a small business project, I'd use four plain rules.

#### Key Takeaways

1. **"Answer questions from my documents" → start with LlamaIndex**
   - If the job is load files, index them, and ask questions, LlamaIndex gets you there with the least ceremony. `SimpleDirectoryReader` loads a folder, `VectorStoreIndex.from_documents()` builds the index, and `index.as_query_engine()` gives you something to ask.
   - It also has the most options for the retrieval side: different index types, retrievers and node parsers. That is where most RAG quality problems live.
   - If your documents are messy PDFs with tables or scans, parsing quality matters more than the framework. That is exactly the problem LlamaParse is built for, but it is a paid, credit-based service. Price it before you build on it.

2. **"An assistant that takes actions" → start with LangChain**
   - If the app has to call tools, such as looking something up, filling a form, sending a draft for approval or calling an API, `create_agent` is the shorter road. LangChain's own RAG guide builds retrieval as a custom tool the agent calls. The current version uses Deep Agents, LangChain's ready-made agent harness on the same runtime.
   - When the flow outgrows a simple loop, for example "wait for a human to approve, then continue tomorrow", you drop down to LangGraph without changing runtimes. Because `create_agent` is itself a LangGraph graph, you don't have to rewrite anything to get there.
   - The cost is pace. Releases land often, and some of the newer features are still labeled beta. Pin your versions.

3. **You can use both, and many projects should**
   - These are not exclusive. A common split is LlamaIndex for ingestion and retrieval, wrapped as a plain Python function, then handed to a LangChain agent as one of its tools. Each side does the part it is best at.
   - Keep the boundary simple: your retrieval function takes a question string and returns text plus sources. Then either side can be swapped later without touching the other.

4. **For a small, private document set, you may not need either**
   - This is the honest one. When I upgraded my own [local-rag](https://github.com/papajo/local-rag) project into a private document assistant, the demo used no framework at all: plain Python, BM25 keyword search plus TF-IDF, cited answers, and a check that declines when the documents don't contain the answer.
   - For a few dozen documents, a framework adds install weight, version churn and abstractions you have to learn before you can debug. It doesn't add much accuracy you couldn't get yourself.
   - Reach for a framework when you need what it actually brings: many connectors, many index types, tool-calling agents, durable state. Don't reach for one just because a tutorial started there.

### A quick decision table

| Your project | Reach for first |
| --- | --- |
| Q&A over a folder of documents | LlamaIndex |
| Messy PDFs, tables, scans | Fix parsing first (LlamaParse is one paid option), then pick a framework |
| Assistant that calls tools and APIs | LangChain (`create_agent`) |
| Long-running flow with human approval steps | LangGraph |
| Both retrieval-heavy and action-heavy | LlamaIndex retrieval wrapped as a tool in a LangChain agent |
| A few dozen private documents, $0 budget | Plain Python first, add a framework only if you hit a wall |

### What to watch

Two things could change this advice in 2027.

- **LlamaIndex's direction.** A company putting its focus on a paid platform doesn't kill an open-source framework, but it changes the odds. If you build on LlamaIndex, keep your own code at the edges (your prompts, your eval questions, your data) so you could move the retrieval layer later.
- **LangChain's pace.** Weekly releases and beta features are good for capability and hard on stability. The no-breaking-changes-until-2.0 promise is the thing to hold them to. Pin versions and read the changelog before you upgrade.

### Conclusion

If your problem is your data, start with LlamaIndex. If your problem is actions and control flow, start with LangChain, and drop to LangGraph when the flow gets serious. If your document set is small and private, try it without a framework first. You may find you only need a search function and an honest "I don't know".

Whichever you pick, the part that decides whether it works is the same: a small set of real questions with known answers that you run after every change. Frameworks come and go. Your eval set is the piece you keep.

---

**References:**

1. [LangChain and LangGraph 1.0 announcement](https://www.langchain.com/blog/langchain-langgraph-1dot0)
2. [langchain on PyPI](https://pypi.org/project/langchain/)
3. [langgraph on PyPI](https://pypi.org/project/langgraph/)
4. [LangChain docs: RAG with Deep Agents](https://docs.langchain.com/oss/python/langchain/rag)
5. [LlamaIndex framework README (focus note)](https://github.com/run-llama/llama_index)
6. [llama-index on PyPI](https://pypi.org/project/llama-index/)
7. [llama-index-workflows on PyPI](https://pypi.org/project/llama-index-workflows/)
8. [LlamaIndex docs: FunctionAgent / AgentWorkflow introduction](https://developers.llamaindex.ai/python/examples/agent/agent_workflow_basic/)
9. [local-rag on GitHub](https://github.com/papajo/local-rag)
