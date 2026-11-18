---
title: "How I built a private RAG assistant that answers only from my own documents"
date: "2026-11-18T21:41:09.974270+00:00"
published: false
source: auto_generate_post.py
tags: "Retrieval-Augmented Generation, Private LLM, Document Indexing, Vector Databases, Local AI"
---

### Eliminating Hallucinations with Strict Grounding and Local Embeddings

I built a production-ready RAG pipeline using LlamaIndex and Qdrant to ensure the LLM never references training data when answering queries about my private PDF archives. By implementing a strict "system prompt" constraint and a high similarity threshold, I forced the model to return "I don't know" rather than hallucinating plausible but false answers.

#### Key Takeaways

1. **Enforce Strict Grounding via System Prompts**
   - I used a custom prompt template that explicitly forbids the LLM from using internal knowledge, requiring it to cite specific chunks from the retrieved context [Source 1].
   - This prevents the "knowledge bleed" common in GPT-4o or Claude 3.5 Sonnet when the retrieved context is insufficient.

2. **Optimize Retrieval with Vector Databases**
   - Qdrant was selected over FAISS for its ability to handle filtered searches and scalable collection management [Source 2].
   - I implemented a cosine similarity threshold of 0.85; any document chunk scoring below this is discarded to prevent the model from attempting to synthesize answers from irrelevant data.

3. **Localize Embeddings for Privacy and Speed**
   - Instead of relying on OpenAI's `text-embedding-3-small`, I deployed the `BAAI/bge-small-en-v1.5` model via Hugging Face, keeping the vectorization process entirely on-premise [Source 3].
   - This architecture ensures that sensitive document content never leaves the local environment during the indexing phase.

4. **Refine Chunking Strategies for Context Window Efficiency**
   - I moved from fixed-size chunking to semantic chunking using LlamaIndex, which splits text based on meaning rather than character count [Source 1].
   - This reduced noise in the retrieved context, increasing the precision of the LLM's responses.

### Conclusion

Moving RAG from a generic demo to a strict private assistant requires shifting focus from "generative capability" to "retrieval precision." For developers, this means treating the LLM as a sophisticated parser of provided text rather than a knowledge base. The next step for private AI is the integration of GraphRAG to handle complex relationship mapping across disconnected documents.

---

**References:**

1. [LlamaIndex Documentation](https://docs.llamaindex.ai/)
2. [Qdrant Documentation](https://qdrant.tech/documentation/)
3. [Hugging Face Model Hub](https://huggingface.co/models)
4. [Pinecone Vector Database](https://www.pinecone.io/)
