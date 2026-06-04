import "dotenv/config"
import { PrismaClient } from "../lib/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is required")
}
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

const tools = [
  {
    name: "OpenAI GPT-4",
    slug: "openai-gpt4",
    description: "Large language model for complex reasoning, code generation, and creative tasks",
    longDescription: "GPT-4 is OpenAI's most advanced language model, capable of solving difficult problems with greater accuracy than any previous model due to its broader general knowledge and problem-solving abilities.",
    category: "LLMs",
    logoUrl: "https://cdn.simpleicons.org/openai/412991",
    websiteUrl: "https://openai.com",
    rating: 4.7,
    reviewCount: 156,
    features: ["Function calling", "Vision capabilities", "Code interpreter", "Fine-tuning support", "200K context window"],
    pricing: [
      { plan: "Pay-as-you-go", price: "$0.03/1K tokens" },
      { plan: "Enterprise", price: "Custom pricing" },
    ],
    featured: true,
  },
  {
    name: "Anthropic Claude",
    slug: "anthropic-claude",
    description: "Constitutional AI with strong safety, reasoning, and long-context capabilities",
    longDescription: "Claude is built by Anthropic to be helpful, harmless, and honest. It excels at analysis, writing, coding, and math with industry-leading context length.",
    category: "LLMs",
    logoUrl: "https://cdn.simpleicons.org/anthropic/D4A574",
    websiteUrl: "https://anthropic.com",
    rating: 4.8,
    reviewCount: 132,
    features: ["200K context window", "Tool use", "Artifacts", "Projects", "Computer use"],
    pricing: [
      { plan: "Free", price: "$0" },
      { plan: "Pro", price: "$20/mo" },
      { plan: "Team", price: "$25/user/mo" },
    ],
    featured: true,
  },
  {
    name: "Pinecone",
    slug: "pinecone",
    description: "Serverless vector database optimized for AI applications and semantic search",
    longDescription: "Pinecone is a managed vector database that makes it easy to build high-performance vector search applications. It handles the complexity of vector storage and retrieval.",
    category: "Vector DBs",
    logoUrl: "https://cdn.simpleicons.org/pinecone/000000",
    websiteUrl: "https://pinecone.io",
    rating: 4.6,
    reviewCount: 89,
    features: ["Serverless scaling", "Hybrid search", "Real-time filtering", "Metadata storage", "Namespaces"],
    pricing: [
      { plan: "Starter", price: "Free" },
      { plan: "Standard", price: "$0.33/hour" },
      { plan: "Enterprise", price: "Custom" },
    ],
    featured: true,
  },
  {
    name: "LangChain",
    slug: "langchain",
    description: "Framework for building applications powered by language models and agents",
    longDescription: "LangChain is a framework for developing applications powered by LLMs. It provides tools for building chains, agents, retrieval systems, and more.",
    category: "Frameworks",
    logoUrl: "https://cdn.simpleicons.org/langchain/000000",
    websiteUrl: "https://langchain.com",
    rating: 4.4,
    reviewCount: 203,
    features: ["Chain composition", "Agent framework", "RAG support", "Tool integration", "Memory systems"],
    pricing: [
      { plan: "Open Source", price: "Free" },
      { plan: "LangSmith", price: "$39/mo" },
    ],
    featured: true,
  },
  {
    name: "CrewAI",
    slug: "crewai",
    description: "Multi-agent AI framework for orchestrating role-playing AI agents",
    longDescription: "CrewAI enables you to create AI agents with specific roles, goals, and backstories that work together to accomplish complex tasks.",
    category: "Agents",
    logoUrl: "https://cdn.simpleicons.org/crewai/FF6B6B",
    websiteUrl: "https://crewai.com",
    rating: 4.5,
    reviewCount: 67,
    features: ["Role-based agents", "Task delegation", "Memory sharing", "Tool integration", "Process management"],
    pricing: [
      { plan: "Open Source", price: "Free" },
      { plan: "Enterprise", price: "Custom" },
    ],
    featured: true,
  },
  {
    name: "Cursor",
    slug: "cursor",
    description: "AI-first code editor built for pair programming with AI",
    longDescription: "Cursor is a fork of VS Code that deeply integrates AI capabilities, making it the best IDE for AI-assisted development.",
    category: "IDEs",
    logoUrl: "https://cdn.simpleicons.org/cursor/000000",
    websiteUrl: "https://cursor.sh",
    rating: 4.9,
    reviewCount: 312,
    features: ["AI chat", "Code completion", "Codebase context", "Multi-file edits", "Terminal integration"],
    pricing: [
      { plan: "Free", price: "$0" },
      { plan: "Pro", price: "$20/mo" },
      { plan: "Business", price: "$40/user/mo" },
    ],
    featured: true,
  },
  {
    name: "Vercel AI SDK",
    slug: "vercel-ai-sdk",
    description: "TypeScript toolkit for building AI-powered applications with streaming",
    longDescription: "The Vercel AI SDK provides a unified interface for building AI applications with support for multiple LLM providers, streaming, and edge deployment.",
    category: "Frameworks",
    logoUrl: "https://cdn.simpleicons.org/vercel/000000",
    websiteUrl: "https://sdk.vercel.ai",
    rating: 4.7,
    reviewCount: 98,
    features: ["Multi-provider support", "Streaming responses", "Edge-ready", "React hooks", "RAG utilities"],
    pricing: [
      { plan: "Open Source", price: "Free" },
    ],
    featured: false,
  },
  {
    name: "Weaviate",
    slug: "weaviate",
    description: "Open-source vector database for AI-native applications",
    longDescription: "Weaviate is an open-source vector database that allows you to store and query vector embeddings alongside your data.",
    category: "Vector DBs",
    logoUrl: "https://cdn.simpleicons.org/weaviate/000000",
    websiteUrl: "https://weaviate.io",
    rating: 4.5,
    reviewCount: 74,
    features: ["GraphQL API", "Hybrid search", "Multi-tenancy", "Auto-schema", "Module system"],
    pricing: [
      { plan: "Open Source", price: "Free" },
      { plan: "Cloud", price: "$0.25/hour" },
    ],
    featured: false,
  },
  {
    name: "Groq",
    slug: "groq",
    description: "Ultra-fast LLM inference with custom LPU hardware",
    longDescription: "Groq provides the fastest LLM inference available, powered by their custom Language Processing Unit (LPU) technology.",
    category: "LLMs",
    logoUrl: "https://cdn.simpleicons.org/groq/000000",
    websiteUrl: "https://groq.com",
    rating: 4.8,
    reviewCount: 156,
    features: ["Sub-millisecond latency", "OpenAI-compatible API", "Batch processing", "Streaming", "Free tier"],
    pricing: [
      { plan: "Free", price: "$0" },
      { plan: "Pay-as-you-go", price: "$0.05/1M tokens" },
    ],
    featured: false,
  },
  {
    name: "LlamaIndex",
    slug: "llamaindex",
    description: "Data framework for building LLM applications over your data",
    longDescription: "LlamaIndex is a data framework for connecting LLMs with external data sources to build powerful retrieval-augmented applications.",
    category: "Frameworks",
    logoUrl: "https://cdn.simpleicons.org/meta/0668E1",
    websiteUrl: "https://llamaindex.ai",
    rating: 4.6,
    reviewCount: 112,
    features: ["Data connectors", "Index types", "Query engines", "Agents", "Evaluation tools"],
    pricing: [
      { plan: "Open Source", price: "Free" },
      { plan: "Cloud", price: "Custom" },
    ],
    featured: false,
  },
  {
    name: "Weights & Biases",
    slug: "wandb",
    description: "MLOps platform for experiment tracking, model management, and data versioning",
    longDescription: "W&B provides tools for tracking ML experiments, visualizing results, and managing the entire ML lifecycle.",
    category: "Evaluation",
    logoUrl: "https://cdn.simpleicons.org/wandb/FFBE00",
    websiteUrl: "https://wandb.ai",
    rating: 4.7,
    reviewCount: 189,
    features: ["Experiment tracking", "Model versioning", "Sweeps", "Reports", "Artifacts"],
    pricing: [
      { plan: "Free", price: "$0" },
      { plan: "Teams", price: "$50/user/mo" },
      { plan: "Enterprise", price: "Custom" },
    ],
    featured: false,
  },
  {
    name: "Replicate",
    slug: "replicate",
    description: "Run ML models in the cloud with a simple API",
    longDescription: "Replicate makes it easy to run ML models in the cloud. Deploy your own models or use thousands of open-source models.",
    category: "Deployment",
    logoUrl: "https://cdn.simpleicons.org/replicate/000000",
    websiteUrl: "https://replicate.com",
    rating: 4.5,
    reviewCount: 94,
    features: ["One-click deployment", "GPU access", "Webhooks", "Scheduling", "Model marketplace"],
    pricing: [
      { plan: "Free tier", price: "$0" },
      { plan: "Pro", price: "$0.000225/second" },
    ],
    featured: false,
  },
]

const projects = [
  {
    title: "RAG Pipeline for Documentation",
    slug: "rag-pipeline",
    description: "A retrieval-augmented generation system that makes documentation searchable with natural language queries",
    thumbnailUrl: "/images/rag-pipeline.png",
    techStack: ["LangChain", "Pinecone", "OpenAI", "Next.js", "Prisma"],
    tags: ["RAG", "Vector Search", "LLM", "Full-Stack"],
    githubUrl: "https://github.com/yourusername/rag-pipeline",
    liveUrl: "https://rag-pipeline.vercel.app",
    featured: true,
    order: 1,
    content: `# RAG Pipeline for Documentation

## Overview

Built a complete RAG (Retrieval-Augmented Generation) system that allows users to query documentation using natural language. The system chunks documents, creates embeddings, stores them in Pinecone, and retrieves relevant context for LLM-powered answers.

## Architecture

\`\`\`
User Query → Embedding (OpenAI) → Vector Search (Pinecone)
                                          ↓
                                   Context Retrieval
                                          ↓
                                   LLM Answer (GPT-4)
\`\`\`

## Key Features

- **Smart Chunking**: Documents are split into optimal chunks for retrieval
- **Hybrid Search**: Combines semantic and keyword search
- **Source Citations**: Every answer includes links to source documents
- **Real-time Updates**: New docs are automatically indexed

## Lessons Learned

1. Chunk size matters a lot - 500 tokens with 50 token overlap worked best
2. Metadata filtering dramatically improves relevance
3. Hybrid search outperforms pure vector search for technical content
`,
  },
  {
    title: "Multi-Agent Research Assistant",
    slug: "multi-agent-research",
    description: "A crew of AI agents that collaborate to research topics and produce comprehensive reports",
    thumbnailUrl: "/images/multi-agent.png",
    techStack: ["CrewAI", "OpenAI", "Tavily", "Streamlit"],
    tags: ["Agents", "Multi-Agent", "Research", "Automation"],
    githubUrl: "https://github.com/yourusername/multi-agent-research",
    featured: true,
    order: 2,
    content: `# Multi-Agent Research Assistant

## Overview

Built a multi-agent system using CrewAI where specialized AI agents collaborate to research topics, gather sources, analyze findings, and produce comprehensive reports.

## Agent Roles

1. **Researcher**: Finds relevant sources and extracts key information
2. **Analyst**: Synthesizes findings and identifies patterns
3. **Writer**: Creates well-structured reports from the analysis
4. **Editor**: Reviews and polishes the final output

## How It Works

The system uses CrewAI's process management to orchestrate agent collaboration, with each agent having specific tools and capabilities.

## Results

- Reduces research time from hours to minutes
- Produces consistent, well-sourced reports
- Can handle complex, multi-faceted topics
`,
  },
  {
    title: "AI Code Review Bot",
    slug: "ai-code-review-bot",
    description: "GitHub bot that automatically reviews pull requests with AI-powered suggestions",
    thumbnailUrl: "/images/code-review.png",
    techStack: ["Python", "GitHub API", "Claude", "FastAPI"],
    tags: ["GitHub", "Code Review", "CI/CD", "Automation"],
    githubUrl: "https://github.com/yourusername/ai-code-review-bot",
    liveUrl: "https://github.com/apps/ai-review-bot",
    featured: true,
    order: 3,
    content: `# AI Code Review Bot

## Overview

A GitHub bot that automatically reviews pull requests using AI, providing helpful suggestions, catching potential bugs, and ensuring code quality.

## Features

- **Automatic Reviews**: Triggered on every PR
- **Security Scanning**: Identifies potential security issues
- **Code Suggestions**: Provides specific improvement recommendations
- **Learning**: Adapts to your team's coding standards

## Technical Details

Built with FastAPI for the webhook server, using Claude for code analysis, and integrating with GitHub's API for seamless PR management.
`,
  },
]

const posts = [
  {
    title: "Building a RAG Pipeline from Scratch",
    slug: "building-rag-pipeline",
    excerpt: "Today I built a complete RAG system using LangChain and Pinecone. Here's what I learned about chunking strategies and embedding models.",
    content: `# Building a RAG Pipeline from Scratch

Today was all about building a production-ready RAG (Retrieval-Augmented Generation) system. I've been wanting to understand the intricacies of document retrieval for a while, and finally got my hands dirty.

## The Stack

- **LangChain** for orchestration
- **Pinecone** for vector storage
- **OpenAI** for embeddings and generation
- **Next.js** for the frontend

## Key Learnings

### 1. Chunking Strategy Matters

I experimented with different chunk sizes and found that **500 tokens with 50 token overlap** works best for technical documentation. Too small and you lose context; too large and you get noisy retrieval.

### 2. Metadata is Your Friend

Adding metadata (file path, section title, document type) to chunks dramatically improved retrieval quality. You can filter by metadata before doing vector search.

### 3. Hybrid Search > Pure Vector

Combining semantic search with keyword search gave me better results than pure vector similarity. Pinecone's hybrid search feature made this easy.

## Code Snippet

\`\`\`python
from langchain.text_splitter import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50,
    length_function=len,
    separators=["\\n\\n", "\\n", ". ", " "]
)
\`\`\`

## Next Steps

- Add support for multiple document formats
- Implement citation tracking
- Build a feedback loop for continuous improvement

---
*Tags: RAG, LangChain, Pinecone, Vector Search*`,
    tags: ["RAG", "LangChain", "Pinecone", "Vector Search"],
  },
  {
    title: "Trying CrewAI for Multi-Agent Workflows",
    slug: "trying-crewai",
    excerpt: "Explored CrewAI today for building multi-agent systems. The role-based approach is surprisingly intuitive.",
    content: `# Trying CrewAI for Multi-Agent Workflows

I've been curious about multi-agent systems for a while. Today I finally tried CrewAI, and I'm impressed by how intuitive the API is.

## Why Multi-Agent?

Single LLM calls are great for simple tasks, but complex workflows benefit from specialization. Instead of one prompt doing everything, you have specialized agents collaborating.

## My First Crew

I built a research crew with three agents:
1. **Researcher** - finds relevant information
2. **Writer** - structures and writes the content
3. **Editor** - polishes and improves

## Initial Impressions

**Pros:**
- Very clean API
- Role-based design is intuitive
- Built-in memory and delegation

**Cons:**
- Can be slow with multiple LLM calls
- Debugging is challenging
- Token costs add up quickly

## The Code

\`\`\`python
from crewai import Agent, Task, Crew

researcher = Agent(
    role="Research Analyst",
    goal="Find comprehensive information about the topic",
    backstory="Expert at finding and verifying information",
    verbose=True
)
\`\`\`

## Verdict

CrewAI is a solid choice for multi-agent workflows. I'll continue experimenting with it for more complex use cases.

---
*Tags: CrewAI, Multi-Agent, AI, Automation*`,
    tags: ["CrewAI", "Multi-Agent", "AI", "Automation"],
  },
  {
    title: "Why I Switched to Cursor Full-Time",
    slug: "switched-to-cursor",
    excerpt: "After 3 months of daily use, here's why I can't go back to regular VS Code for AI development.",
    content: `# Why I Switched to Cursor Full-Time

Three months ago, I made the switch from VS Code to Cursor. Here's my honest review after daily use.

## The Killer Feature: Codebase Context

Cursor understands your entire codebase. When you ask a question, it searches through your files and provides contextually relevant answers. This is a game-changer.

## What I Love

### 1. AI Chat with Context
Ask questions about your code and get answers that actually reference your files.

### 2. Multi-File Editing
Select multiple files and make changes across your codebase in one go.

### 3. Cmd+K Magic
Select code, press Cmd+K, and get instant transformations. Refactor, explain, or modify with natural language.

## What Could Be Better

- **Price**: $20/month adds up
- **Occasional hallucinations**: Still happens, especially with complex logic
- **Learning curve**: Takes time to unlearn VS Code habits

## My Workflow Now

1. **Exploration**: Ask Cursor to explain unfamiliar code
2. **Implementation**: Use Cmd+K for quick edits, chat for complex changes
3. **Review**: Ask Cursor to review my code before committing

## Verdict

Cursor is now essential to my workflow. The productivity gains justify the cost, especially for AI-heavy development.

---
*Tags: Cursor, IDE, AI, Developer Tools*`,
    tags: ["Cursor", "IDE", "AI", "Developer Tools"],
  },
  {
    title: "Vector Database Comparison: Pinecone vs Weaviate vs Qdrant",
    slug: "vector-db-comparison",
    excerpt: "Tested three popular vector databases for a real-world RAG application. Here are the results.",
    content: `# Vector Database Comparison

I've been evaluating vector databases for a production RAG application. Here's how Pinecone, Weaviate, and Qdrant compare.

## Test Setup

- **Dataset**: 100K technical documentation chunks
- **Embeddings**: OpenAI text-embedding-3-small (1536 dimensions)
- **Queries**: 100 representative queries
- **Hardware**: Default cloud settings for each

## Results

| Metric | Pinecone | Weaviate | Qdrant |
|--------|----------|----------|--------|
| Index Time | 12 min | 18 min | 15 min |
| Query Latency (p95) | 45ms | 62ms | 38ms |
| Accuracy (MRR) | 0.82 | 0.79 | 0.81 |
| Monthly Cost | $70 | $55 | $45 |

## Key Findings

### Pinecone
- Easiest to set up
- Great managed experience
- Hybrid search works well

### Weaviate
- Most flexible
- GraphQL API is powerful
- Module system is clever

### Qdrant
- Fastest performance
- Best value for money
- Rust-based = efficient

## Recommendation

For most use cases, **Pinecone** is the safest choice. For cost-sensitive or performance-critical applications, **Qdrant** is excellent.

---
*Tags: Vector Database, Pinecone, Weaviate, Qdrant, Comparison*`,
    tags: ["Vector Database", "Pinecone", "Weaviate", "Qdrant", "Comparison"],
  },
  {
    title: "Setting Up LLM Observability with LangSmith",
    slug: "llm-observability",
    excerpt: "Instrumented my LLM app with LangSmith for tracing, debugging, and monitoring. Essential for production.",
    content: `# Setting Up LLM Observability with LangSmith

If you're running LLM applications in production, observability is non-negotiable. Today I set up LangSmith for my RAG pipeline.

## Why Observability Matters

LLMs are non-deterministic. You need to:
- Trace every request through your pipeline
- Debug when responses are wrong
- Monitor costs and latency
- A/B test different prompts

## LangSmith Setup

\`\`\`python
import os
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_API_KEY"] = "your-api-key"
\`\`\`

That's it for basic tracing. LangSmith automatically captures:
- Each step in your chain
- Input/output at each step
- Latency per step
- Token usage

## What I Learned

### 1. Traces Reveal Surprises
My "simple" RAG chain had 7 steps I didn't realize. Tracing helped me optimize.

### 2. Cost Attribution
Now I can see exactly which parts of my pipeline are expensive.

### 3. Debugging is 10x Faster
Instead of adding print statements, I just look at the trace.

## Pricing

- **Free tier**: 5K traces/month
- **Developer**: $39/month
- **Enterprise**: Custom

## Verdict

LangSmith is now essential for my LLM development. The free tier is generous enough for side projects.

---
*Tags: LangSmith, Observability, LLM, Monitoring*`,
    tags: ["LangSmith", "Observability", "LLM", "Monitoring"],
  },
]

async function main() {
  console.log("Seeding database...")

  // Clear existing data
  await prisma.review.deleteMany()
  await prisma.tool.deleteMany()
  await prisma.project.deleteMany()
  await prisma.dailyPost.deleteMany()

  // Seed tools
  for (const tool of tools) {
    await prisma.tool.create({
      data: tool,
    })
  }
  console.log(`Seeded ${tools.length} tools`)

  // Seed reviews for each tool
  const allTools = await prisma.tool.findMany()
  for (const tool of allTools) {
    const numReviews = Math.floor(Math.random() * 3) + 1
    for (let i = 0; i < numReviews; i++) {
      await prisma.review.create({
        data: {
          toolId: tool.id,
          rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
          content: `Great ${tool.category.toLowerCase()} tool. ${tool.name} has been a valuable addition to my workflow.`,
          pros: ["Easy to use", "Good documentation", "Active development"],
          cons: ["Learning curve", "Pricing could be better"],
          authorName: ["Alex", "Jordan", "Sam", "Casey"][Math.floor(Math.random() * 4)],
        },
      })
    }
  }
  console.log("Seeded reviews")

  // Seed projects
  for (const project of projects) {
    await prisma.project.create({
      data: project,
    })
  }
  console.log(`Seeded ${projects.length} projects`)

  // Seed posts
  for (const post of posts) {
    await prisma.dailyPost.create({
      data: {
        ...post,
        publishedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      },
    })
  }
  console.log(`Seeded ${posts.length} posts`)

  console.log("Database seeded successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
