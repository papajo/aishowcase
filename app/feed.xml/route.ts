import { prisma } from "@/lib/db";
import { getMarkdownPosts } from "@/lib/md-utils";
import { NextResponse } from "next/server";

export async function GET() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://aishowcase-vert.vercel.app";

  // Merge DB posts and markdown posts, sort by date desc
  let dbPosts: any[] = [];
  let projects: any[] = [];

  try {
    dbPosts = await prisma.dailyPost.findMany({
      orderBy: { publishedAt: "desc" },
      take: 20,
    });
    projects = await prisma.project.findMany({
      orderBy: { order: "asc" },
      take: 10,
    });
  } catch (e) {
    // Database not available
  }

  const mdPosts = getMarkdownPosts();

  // Normalize to a uniform shape for RSS items
  const mdItems = mdPosts.map((p) => ({
    title: p.title,
    excerpt: p.excerpt,
    slug: p.slug,
    publishedAt: p.date,
  }));

  const dbItems = dbPosts.map((p) => ({
    title: p.title,
    excerpt: p.excerpt,
    slug: p.slug,
    publishedAt: p.publishedAt.toISOString(),
  }));

  // Merge, deduplicate by slug, sort newest first
  const seen = new Set<string>();
  const allPosts = [...mdItems, ...dbItems]
    .filter((p) => {
      if (seen.has(p.slug)) return false;
      seen.add(p.slug);
      return true;
    })
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 20);

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>AI Showcase</title>
    <description>AI developer building, testing, and sharing tools and projects daily.</description>
    <link>${siteUrl}</link>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <language>en</language>
    ${allPosts
      .map(
        (post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <description>${escapeXml(post.excerpt)}</description>
      <link>${siteUrl}/journal/${post.slug}</link>
      <guid isPermaLink="true">${siteUrl}/journal/${post.slug}</guid>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
    </item>`,
      )
      .join("")}
    ${projects
      .map(
        (project) => `
    <item>
      <title>${escapeXml(project.title)}</title>
      <description>${escapeXml(project.description)}</description>
      <link>${siteUrl}/projects/${project.slug}</link>
      <guid isPermaLink="true">${siteUrl}/projects/${project.slug}</guid>
      <pubDate>${new Date(project.createdAt).toUTCString()}</pubDate>
    </item>`,
      )
      .join("")}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate",
    },
  });
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
