import { prisma } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wrench, FolderKanban, FileText, Users, Mail } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Admin Dashboard — AI Showcase",
}

export default async function AdminDashboardPage() {
  let stats = {
    tools: 0,
    projects: 0,
    posts: 0,
    subscribers: 0,
    contacts: 0,
  }

  try {
    const [tools, projects, posts, subscribers] = await Promise.all([
      prisma.tool.count(),
      prisma.project.count(),
      prisma.dailyPost.count(),
      prisma.newsletterSubscriber.count(),
    ])
    stats = { tools, projects, posts, subscribers, contacts: 0 }
  } catch (e) {
    // Database not available
  }

  const statCards = [
    {
      title: "Tools",
      value: stats.tools,
      icon: Wrench,
      href: "/admin/tools",
      color: "text-blue-500",
    },
    {
      title: "Projects",
      value: stats.projects,
      icon: FolderKanban,
      href: "/admin/projects",
      color: "text-violet-500",
    },
    {
      title: "Journal Posts",
      value: stats.posts,
      icon: FileText,
      href: "/admin/journal",
      color: "text-emerald-500",
    },
    {
      title: "Subscribers",
      value: stats.subscribers,
      icon: Mail,
      href: "#",
      color: "text-amber-500",
    },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Manage your AI showcase content.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Link key={card.title} href={card.href}>
            <Card className="hover:ring-1 hover:ring-primary/20 transition-all cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link
              href="/admin/tools/new"
              className="block px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 text-sm font-medium transition-colors"
            >
              + Add New Tool
            </Link>
            <Link
              href="/admin/projects/new"
              className="block px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 text-sm font-medium transition-colors"
            >
              + Add New Project
            </Link>
            <Link
              href="/admin/journal/new"
              className="block px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 text-sm font-medium transition-colors"
            >
              + Write Journal Entry
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Activity tracking coming soon. For now, check your database for
              recent changes.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
