import { prisma } from "@/lib/db"
import { JournalList } from "./JournalList"

export const metadata = {
  title: "Manage Journal — AI Showcase",
}

export default async function AdminJournalPage() {
  let posts: Awaited<ReturnType<typeof prisma.dailyPost.findMany>> = []

  try {
    posts = await prisma.dailyPost.findMany({
      orderBy: { publishedAt: "desc" },
    })
  } catch (e) {
    // Database not available
  }

  return (
    <JournalList
      posts={posts.map((p) => ({
        ...p,
        publishedAt: p.publishedAt.toISOString(),
      }))}
    />
  )
}
