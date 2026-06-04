import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import { JournalForm } from "../JournalForm"

export const metadata = {
  title: "Edit Entry — AI Showcase",
}

export default async function EditJournalPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  let post: any = null

  try {
    post = await prisma.dailyPost.findUnique({
      where: { id },
    })
  } catch (e) {
    notFound()
  }

  if (!post) {
    notFound()
  }

  return <JournalForm post={post} />
}
