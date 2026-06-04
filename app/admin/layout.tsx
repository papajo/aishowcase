"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Wrench,
  FolderKanban,
  FileText,
  ArrowLeft,
} from "lucide-react"

const navItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Tools",
    href: "/admin/tools",
    icon: Wrench,
  },
  {
    label: "Projects",
    href: "/admin/projects",
    icon: FolderKanban,
  },
  {
    label: "Journal",
    href: "/admin/journal",
    icon: FileText,
  },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r bg-card p-4">
        <div className="mb-8">
          <Link
            href="/admin"
            className="text-lg font-bold tracking-tight hover:opacity-80 transition-opacity"
          >
            AI Showcase
          </Link>
          <p className="text-xs text-muted-foreground mt-1">Admin Panel</p>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href))

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto pt-8 border-t mt-8">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Site
          </Link>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
