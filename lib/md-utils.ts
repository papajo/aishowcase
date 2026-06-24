import fs from "fs"
import path from "path"

const POSTS_DIR = path.join(process.cwd(), "content", "posts")
const TOOLS_DIR = path.join(process.cwd(), "content", "tools")
const PROJECTS_DIR = path.join(process.cwd(), "content", "projects")
const ABOUT_FILE = path.join(process.cwd(), "content", "about.md")

// ── Interfaces ────────────────────────────────────────────────────────────

export interface MarkdownPost {
  slug: string
  title: string
  date: string
  excerpt: string
  content: string
  tags: string[]
}

export interface MarkdownTool {
  slug: string
  name: string
  description: string
  longDescription: string
  category: string
  logoUrl: string | null
  websiteUrl: string | null
  rating: number
  reviewCount: number
  features: string[]
  tags: string[]
  content: string
  featured: boolean
}

export interface MarkdownProject {
  slug: string
  title: string
  description: string
  thumbnailUrl: string | null
  techStack: string[]
  tags: string[]
  githubUrl: string | null
  liveUrl: string | null
  content: string
  featured: boolean
  order: number
}

export interface MarkdownAbout {
  name: string
  tagline: string
  bio: string
  avatar: string | null
  githubUrl: string | null
  linkedinUrl: string | null
  email: string | null
  skills: { name: string; level: number }[]
  experience: { title: string; company: string; period: string; description: string }[]
  techStack: string[]
  content: string
}

// ── Frontmatter parser ────────────────────────────────────────────────────

/** Very basic frontmatter parser — extracts key fields from `---` blocks */
export function parseFrontmatter(fileContent: string) {
  const match = fileContent.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return {}
  const meta: Record<string, string> = {}
  for (const line of match[1].split("\n")) {
    if (/^\s+-\s/.test(line)) continue
    const idx = line.indexOf(":")
    if (idx > 0) {
      const key = line.slice(0, idx).trim()
      let val = line.slice(idx + 1).trim()
      val = val.replace(/^["']|["']$/g, "")
      if (val === "") {
        const lines = match[1].split("\n")
        const lineIdx = lines.indexOf(line)
        const listItems: string[] = []
        for (let i = lineIdx + 1; i < lines.length; i++) {
          const itemMatch = lines[i].match(/^\s+-\s+(.+)/)
          if (itemMatch) {
            listItems.push(itemMatch[1].trim().replace(/^["']|["']$/g, ""))
          } else {
            break
          }
        }
        if (listItems.length > 0) val = listItems.join(", ")
      }
      meta[key] = val
    }
  }
  return meta
}

/** Parse a comma-separated string into a trimmed array, filtering empties */
function csvToArray(val: string | undefined): string[] {
  if (!val) return []
  return val.split(",").map((t) => t.trim()).filter((t) => t.length > 0)
}

/** Safely parse a float with fallback */
function floatOr(val: string | undefined, fallback: number): number {
  if (!val) return fallback
  const n = parseFloat(val)
  return isNaN(n) ? fallback : n
}

/** Safely parse an int with fallback */
function intOr(val: string | undefined, fallback: number): number {
  if (!val) return fallback
  const n = parseInt(val, 10)
  return isNaN(n) ? fallback : n
}

/** Parse "name:level, name:level" pairs into skill objects */
function parseSkills(val: string | undefined): { name: string; level: number }[] {
  if (!val) return []
  return val.split(",").map((pair) => {
    const parts = pair.split(":")
    return { name: parts[0].trim(), level: intOr(parts[1], 50) }
  }).filter((s) => s.name.length > 0)
}

/** Parse experience blocks from frontmatter:
 *  experience:
 *    - title: AI Dev | company: Independent | period: 2024 - Present | description: Building AI apps
 *    - title: Full Stack | company: Tech Corp | period: 2022-2024 | description: Led dev
 */
function parseExperience(val: string | undefined): { title: string; company: string; period: string; description: string }[] {
  if (!val) return []
  const items = val.includes("|") ? val.split(/,(?=[^|]*\|)/) : []
  return items.map((item) => {
    const fields: Record<string, string> = {}
    for (const part of item.split("|")) {
      const idx = part.indexOf(":")
      if (idx > 0) {
        fields[part.slice(0, idx).trim()] = part.slice(idx + 1).trim()
      }
    }
    return {
      title: fields.title || "",
      company: fields.company || "",
      period: fields.period || "",
      description: fields.description || "",
    }
  }).filter((e) => e.title.length > 0)
}

// ── Generic directory reader ───────────────────────────────────────────────

function readMarkdownDir<T>(dir: string, parser: (filepath: string) => T | null): T[] {
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => parser(path.join(dir, f)))
    .filter((p): p is T => p !== null)
}

// ── Journal / Posts ───────────────────────────────────────────────────────

function parsePostFile(filepath: string): MarkdownPost | null {
  try {
    const fileContent = fs.readFileSync(filepath, "utf-8")
    const meta = parseFrontmatter(fileContent)
    const body = fileContent.replace(/^---[\s\S]*?---/, "").trim()
    return {
      slug: path.basename(filepath, ".md"),
      title: meta.title || "Untitled",
      date: meta.date || new Date().toISOString(),
      excerpt: body.slice(0, 160).replace(/\n/g, " ") + "...",
      content: body,
      tags: csvToArray(meta.tags),
    }
  } catch {
    return null
  }
}

export function getMarkdownPosts(): MarkdownPost[] {
  return readMarkdownDir(POSTS_DIR, parsePostFile)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getMarkdownPostBySlug(slug: string): MarkdownPost | null {
  const filepath = path.join(POSTS_DIR, `${slug}.md`)
  if (!fs.existsSync(filepath)) return null
  return parsePostFile(filepath)
}

// ── Tools ─────────────────────────────────────────────────────────────────

function parseToolFile(filepath: string): MarkdownTool | null {
  try {
    const fileContent = fs.readFileSync(filepath, "utf-8")
    const meta = parseFrontmatter(fileContent)
    const body = fileContent.replace(/^---[\s\S]*?---/, "").trim()
    return {
      slug: path.basename(filepath, ".md"),
      name: meta.name || meta.title || "Unnamed Tool",
      description: meta.description || "",
      longDescription: meta.longDescription || body.slice(0, 500),
      category: meta.category || "Uncategorized",
      logoUrl: meta.logoUrl || null,
      websiteUrl: meta.websiteUrl || null,
      rating: floatOr(meta.rating, 0),
      reviewCount: intOr(meta.reviewCount, 0),
      features: csvToArray(meta.features),
      tags: csvToArray(meta.tags),
      content: body,
      featured: meta.featured === "true",
    }
  } catch {
    return null
  }
}

export function getMarkdownTools(): MarkdownTool[] {
  return readMarkdownDir(TOOLS_DIR, parseToolFile)
    .sort((a, b) => b.rating - a.rating)
}

export function getMarkdownToolBySlug(slug: string): MarkdownTool | null {
  const filepath = path.join(TOOLS_DIR, `${slug}.md`)
  if (!fs.existsSync(filepath)) return null
  return parseToolFile(filepath)
}

// ── Projects ───────────────────────────────────────────────────────────────

function parseProjectFile(filepath: string): MarkdownProject | null {
  try {
    const fileContent = fs.readFileSync(filepath, "utf-8")
    const meta = parseFrontmatter(fileContent)
    const body = fileContent.replace(/^---[\s\S]*?---/, "").trim()
    return {
      slug: path.basename(filepath, ".md"),
      title: meta.title || "Untitled Project",
      description: meta.description || "",
      thumbnailUrl: meta.thumbnailUrl || null,
      techStack: csvToArray(meta.techStack),
      tags: csvToArray(meta.tags),
      githubUrl: meta.githubUrl || null,
      liveUrl: meta.liveUrl || null,
      content: body,
      featured: meta.featured === "true",
      order: intOr(meta.order, 0),
    }
  } catch {
    return null
  }
}

export function getMarkdownProjects(): MarkdownProject[] {
  return readMarkdownDir(PROJECTS_DIR, parseProjectFile)
    .sort((a, b) => a.order - b.order)
}

export function getMarkdownProjectBySlug(slug: string): MarkdownProject | null {
  const filepath = path.join(PROJECTS_DIR, `${slug}.md`)
  if (!fs.existsSync(filepath)) return null
  return parseProjectFile(filepath)
}

// ── About ──────────────────────────────────────────────────────────────────

export function getMarkdownAbout(): MarkdownAbout | null {
  if (!fs.existsSync(ABOUT_FILE)) return null
  try {
    const fileContent = fs.readFileSync(ABOUT_FILE, "utf-8")
    const meta = parseFrontmatter(fileContent)
    const body = fileContent.replace(/^---[\s\S]*?---/, "").trim()

    return {
      name: meta.name || "PJ",
      tagline: meta.tagline || "",
      bio: meta.bio || body.slice(0, 300),
      avatar: meta.avatar || null,
      githubUrl: meta.githubUrl || null,
      linkedinUrl: meta.linkedinUrl || null,
      email: meta.email || null,
      skills: parseSkills(meta.skills),
      experience: parseExperience(meta.experience),
      techStack: csvToArray(meta.techStack),
      content: body,
    }
  } catch {
    return null
  }
}
