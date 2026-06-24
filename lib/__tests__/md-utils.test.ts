import { describe, it, expect } from "vitest"
import { parseFrontmatter } from "@/lib/md-utils"
import path from "path"

// ── Shared helpers ──────────────────────────────────────────────────────────

function parseTestFile(filename: string, content: string) {
  const meta = parseFrontmatter(content)
  const body = content.replace(/^---[\s\S]*?---/, "").trim()
  return { meta, body, slug: path.basename(filename, ".md") }
}

function csvToArray(val: string | undefined): string[] {
  if (!val) return []
  return val.split(",").map((t) => t.trim()).filter((t) => t.length > 0)
}

function floatOr(val: string | undefined, fallback: number): number {
  if (!val) return fallback
  const n = parseFloat(val)
  return isNaN(n) ? fallback : n
}

function intOr(val: string | undefined, fallback: number): number {
  if (!val) return fallback
  const n = parseInt(val, 10)
  return isNaN(n) ? fallback : n
}

// ── parseFrontmatter (pure function, no I/O) ────────────────────────────────

describe("parseFrontmatter", () => {
  it("returns empty object for content with no frontmatter", () => {
    expect(parseFrontmatter("Just some raw markdown content.")).toEqual({})
  })

  it("extracts basic key-value pairs", () => {
    const meta = parseFrontmatter(`---
title: "Hello World"
date: "2026-06-24T12:00:00Z"
tags: "AI, LLM"
---

Content.`)
    expect(meta.title).toBe("Hello World")
    expect(meta.date).toBe("2026-06-24T12:00:00Z")
    expect(meta.tags).toBe("AI, LLM")
  })

  it("handles title with a colon in quotes", () => {
    const meta = parseFrontmatter(`---
title: "LLMs: The Future of AI"
---

Content.`)
    expect(meta.title).toBe("LLMs: The Future of AI")
  })

  it("handles unquoted values with colons (splits on first colon)", () => {
    const meta = parseFrontmatter(`---
title: My Post: A Subtitle
---

Content.`)
    expect(meta.title).toBe("My Post: A Subtitle")
  })

  it("handles single-quoted values", () => {
    const meta = parseFrontmatter(`---
title: 'Single Quote Title'
---

Content.`)
    expect(meta.title).toBe("Single Quote Title")
  })

  it("parses YAML list-style tags into comma-separated string", () => {
    const meta = parseFrontmatter(`---
title: "Test"
tags:
  - AI
  - LLM
  - RAG
---

Content.`)
    expect(meta.tags).toBe("AI, LLM, RAG")
  })

  it("returns empty tags string when YAML list is under a non-tags key", () => {
    const meta = parseFrontmatter(`---
title: "Test"
categories:
  - News
  - Opinion
---

Content.`)
    expect(meta.categories).toBe("News, Opinion")
    expect(meta.tags).toBeUndefined()
  })

  it("ignores lines that are just colons or empty", () => {
    const meta = parseFrontmatter(`---
title: "Test"
:
noprefix
---

Content.`)
    expect(meta.title).toBe("Test")
  })
})

// ── Tool markdown parsing ──────────────────────────────────────────────────

describe("Tool markdown parsing", () => {
  it("parses a full tool with all fields", () => {
    const { meta, body } = parseTestFile("openai-gpt4.md", `---
name: "OpenAI GPT-4"
description: "Large language model for complex reasoning"
category: "LLMs"
logoUrl: "https://cdn.simpleicons.org/openai/412991"
websiteUrl: "https://openai.com"
rating: "4.7"
reviewCount: "156"
features: "Function calling, Vision capabilities, Code interpreter"
tags: "LLM, OpenAI, GPT-4"
featured: "true"
---

Body content here.`)

    expect(meta.name).toBe("OpenAI GPT-4")
    expect(meta.category).toBe("LLMs")
    expect(floatOr(meta.rating, 0)).toBe(4.7)
    expect(intOr(meta.reviewCount, 0)).toBe(156)
    expect(csvToArray(meta.features)).toEqual(["Function calling", "Vision capabilities", "Code interpreter"])
    expect(csvToArray(meta.tags)).toEqual(["LLM", "OpenAI", "GPT-4"])
    expect(meta.featured).toBe("true")
    expect(body).toBe("Body content here.")
  })

  it("uses name field (falls back to title)", () => {
    const { meta } = parseTestFile("fallback.md", `---
title: "Fallback Title"
---

Content.`)
    // Tools prefer 'name', fall back to 'title'
    expect(meta.title).toBe("Fallback Title")
    expect(meta.name).toBeUndefined()
  })

  it("handles a minimal tool with no optional fields", () => {
    const { meta } = parseTestFile("minimal.md", `---
name: "Minimal Tool"
description: "Does a thing"
category: "Frameworks"
---

Just a tool.`)
    expect(meta.name).toBe("Minimal Tool")
    expect(meta.logoUrl).toBeUndefined()
    expect(meta.websiteUrl).toBeUndefined()
    expect(csvToArray(meta.features)).toEqual([])
    expect(floatOr(meta.rating, 0)).toBe(0)
  })
})

// ── Project markdown parsing ────────────────────────────────────────────────

describe("Project markdown parsing", () => {
  it("parses a full project with all fields", () => {
    const { meta } = parseTestFile("rag-pipeline.md", `---
title: "RAG Pipeline Builder"
description: "Production-ready RAG pipeline"
techStack: "Python, LangChain, Pinecone, OpenAI, FastAPI"
tags: "RAG, LLM, Pipeline, Python"
githubUrl: "https://github.com/papajo/rag-pipeline"
liveUrl: "https://rag.aishowcase.qzz.io"
featured: "true"
order: "1"
---

Content.`)
    expect(meta.title).toBe("RAG Pipeline Builder")
    expect(csvToArray(meta.techStack)).toEqual(["Python", "LangChain", "Pinecone", "OpenAI", "FastAPI"])
    expect(csvToArray(meta.tags)).toEqual(["RAG", "LLM", "Pipeline", "Python"])
    expect(intOr(meta.order, 0)).toBe(1)
    expect(meta.featured).toBe("true")
  })

  it("handles a project with minimal fields", () => {
    const { meta } = parseTestFile("minimal.md", `---
title: "Simple Project"
---

Just a project.`)
    expect(meta.title).toBe("Simple Project")
    expect(csvToArray(meta.techStack)).toEqual([])
    expect(csvToArray(meta.tags)).toEqual([])
  })
})

// ── About markdown parsing ──────────────────────────────────────────────────

describe("About markdown parsing", () => {
  it("parses full about.md", () => {
    const { meta, body } = parseTestFile("about.md", `---
name: "PJ"
tagline: "AI Developer — Building with AI Daily"
bio: "AI developer passionate about building intelligent systems."
githubUrl: "https://github.com/papajo"
linkedinUrl: "https://linkedin.com/in/pajo"
email: "test@example.com"
skills: "LLMs:90, Python:95, TypeScript:80"
techStack: "Python, TypeScript, Next.js"
---

Extended bio content here.`)

    expect(meta.name).toBe("PJ")
    expect(meta.tagline).toBe("AI Developer — Building with AI Daily")
    expect(meta.bio).toBe("AI developer passionate about building intelligent systems.")
    expect(meta.githubUrl).toBe("https://github.com/papajo")
    expect(body).toBe("Extended bio content here.")

    // Skills parsing
    const skills = meta.skills!.split(",").map((pair) => {
      const parts = pair.split(":")
      return { name: parts[0].trim(), level: intOr(parts[1], 50) }
    })
    expect(skills).toEqual([
      { name: "LLMs", level: 90 },
      { name: "Python", level: 95 },
      { name: "TypeScript", level: 80 },
    ])
  })

  it("parses experience with pipe-delimited format", () => {
    const { meta } = parseTestFile("about.md", `---
experience: "title:AI Dev|company:Independent|period:2024-Present|description:Building AI apps., title:Full Stack|company:Tech Corp|period:2022-2024|description:Led dev"
---

Content.`)

    // Split on comma followed by title: pattern
    const items = (meta.experience || "").split(/,(?=\s*title:)/)
    expect(items).toHaveLength(2)

    const fields0: Record<string, string> = {}
    for (const part of items[0].split("|")) {
      const idx = part.indexOf(":")
      if (idx > 0) fields0[part.slice(0, idx).trim()] = part.slice(idx + 1).trim()
    }
    expect(fields0.title).toBe("AI Dev")
    expect(fields0.company).toBe("Independent")
  })
})

// ── Journal post parsing (already tested earlier, comprehensive here) ──────

describe("Journal post markdown parsing", () => {
  it("parses a manually-created post with all fields", () => {
    const { meta, body, slug } = parseTestFile("my-post.md", `---
title: "My Manual Post"
date: "2026-06-24T12:00:00Z"
tags: "AI, Manual, Test"
---

This is a manually created post.`)
    expect(slug).toBe("my-post")
    expect(meta.title).toBe("My Manual Post")
    expect(csvToArray(meta.tags)).toEqual(["AI", "Manual", "Test"])
    expect(body).toBe("This is a manually created post.")
  })

  it("parses a manually-created post with zero fields", () => {
    const { meta, body, slug } = parseTestFile("bare.md", "Just some raw markdown content with no frontmatter.")
    expect(slug).toBe("bare")
    expect(meta.title).toBeUndefined() // no frontmatter = empty meta
    expect(csvToArray(meta.tags)).toEqual([])
  })

  it("handles tags with extra whitespace", () => {
    const { meta } = parseTestFile("spacey.md", `---
title: "Spacey Tags"
tags: "  AI ,  LLM  ,  RAG  "
---

Content.`)
    expect(csvToArray(meta.tags)).toEqual(["AI", "LLM", "RAG"])
  })

  it("handles YAML list tags", () => {
    const { meta } = parseTestFile("list-tags.md", `---
title: "List Tags"
tags:
  - AI
  - LLM
  - RAG
---

Content.`)
    expect(csvToArray(meta.tags)).toEqual(["AI", "LLM", "RAG"])
  })

  it("sorts posts by date descending", () => {
    const posts = [
      parseTestFile("old.md", `---\ntitle: "Old"\ndate: "2026-01-01T00:00:00Z"\n---\nOld.`),
      parseTestFile("new.md", `---\ntitle: "New"\ndate: "2026-06-24T00:00:00Z"\n---\nNew.`),
      parseTestFile("mid.md", `---\ntitle: "Mid"\ndate: "2026-03-15T00:00:00Z"\n---\nMid.`),
    ].map((p) => ({ title: p.meta.title || "", date: p.meta.date || new Date().toISOString() }))
     .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    expect(posts[0].title).toBe("New")
    expect(posts[1].title).toBe("Mid")
    expect(posts[2].title).toBe("Old")
  })

  it("handles empty tags string gracefully", () => {
    const { meta } = parseTestFile("empty-tags.md", `---
title: "No Tags"
tags: ""
---

Content.`)
    expect(csvToArray(meta.tags)).toEqual([])
  })
})
