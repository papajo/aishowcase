import { describe, it, expect } from "vitest"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { toolSchema } from "@/lib/schemas"
import { parseFrontmatter, parseSponsorTier } from "@/lib/md-utils"
import { AdSlot, isAdsEnabled } from "@/components/shared/AdSlot"

describe("Tool monetization fields", () => {
  it("accepts affiliateUrl and sponsorTier in toolSchema", () => {
    const parsed = toolSchema.parse({
      name: "Cursor",
      slug: "cursor",
      description: "AI-first code editor",
      websiteUrl: "https://cursor.sh",
      affiliateUrl: "https://cursor.sh/?ref=aishowcase",
      sponsorTier: "featured",
    })

    expect(parsed.affiliateUrl).toBe("https://cursor.sh/?ref=aishowcase")
    expect(parsed.sponsorTier).toBe("featured")
  })

  it("allows omitting affiliateUrl and sponsorTier in toolSchema", () => {
    const parsed = toolSchema.parse({
      name: "Local Tool",
      slug: "local-tool",
      description: "A tool without affiliate links",
    })

    expect(parsed.affiliateUrl).toBeUndefined()
    expect(parsed.sponsorTier).toBeUndefined()
  })

  it("rejects invalid sponsorTier values in toolSchema", () => {
    const result = toolSchema.safeParse({
      name: "Bad Tier",
      slug: "bad-tier",
      description: "Invalid tier test",
      sponsorTier: "enterprise",
    })

    expect(result.success).toBe(false)
  })

  it("parses affiliateUrl and sponsorTier from markdown frontmatter", () => {
    const meta = parseFrontmatter(`---
name: "Pinecone"
websiteUrl: "https://pinecone.io"
affiliateUrl: "https://pinecone.io/?via=aishowcase"
sponsorTier: "featured"
---

Body content.`)

    expect(meta.affiliateUrl).toBe("https://pinecone.io/?via=aishowcase")
    expect(parseSponsorTier(meta.sponsorTier)).toBe("featured")
  })

  it("defaults sponsorTier to none when missing or unrecognized", () => {
    expect(parseSponsorTier(undefined)).toBe("none")
    expect(parseSponsorTier("unknown")).toBe("none")
    expect(parseSponsorTier("basic")).toBe("basic")
    expect(parseSponsorTier("featured")).toBe("featured")
  })
})

describe("AdSlot gating", () => {
  it("isAdsEnabled returns false when unset or not 'true'", () => {
    expect(isAdsEnabled(undefined)).toBe(false)
    expect(isAdsEnabled("")).toBe(false)
    expect(isAdsEnabled("false")).toBe(false)
    expect(isAdsEnabled("1")).toBe(false)
    expect(isAdsEnabled("true")).toBe(true)
  })

  it("renders nothing when enabled is false", () => {
    const html = renderToStaticMarkup(React.createElement(AdSlot, { enabled: false }))
    expect(html).toBe("")
  })

  it("renders ad container when enabled is true", () => {
    const html = renderToStaticMarkup(
      React.createElement(AdSlot, { enabled: true, slot: "home-projects" })
    )
    expect(html).toContain('data-testid="ad-slot"')
    expect(html).toContain('data-slot="home-projects"')
    expect(html).toContain("Sponsored")
  })
})
