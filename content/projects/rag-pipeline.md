---
title: "RAG Pipeline Builder"
description: "Production-ready RAG pipeline with chunking, embedding, and retrieval"
techStack: "Python, LangChain, Pinecone, OpenAI, FastAPI"
tags: "RAG, LLM, Pipeline, Python"
githubUrl: "https://github.com/papajo/local-rag"
liveUrl: ""
featured: "true"
order: "1"
---

A production-grade Retrieval-Augmented Generation pipeline that handles document ingestion, intelligent chunking, embedding via OpenAI, and vector search via Pinecone.

## Architecture

1. **Document Ingestion**: PDF, Markdown, and plain text support
2. **Chunking Strategy**: Recursive character splitting with overlap
3. **Embedding**: OpenAI `text-embedding-3-small`
4. **Vector Store**: Pinecone serverless with metadata filtering
5. **Retrieval**: Hybrid search combining dense and sparse vectors
6. **Generation**: Claude 3.5 Sonnet with retrieved context

## Results

- **92% retrieval accuracy** on benchmark dataset
- **<200ms** average query latency
- **10K+ documents** indexed and searchable

---
*Tags: RAG, LLM, Pipeline, Python*
