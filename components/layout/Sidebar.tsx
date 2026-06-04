"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Wrench, Rocket, BookOpen, User, Mail } from "lucide-react"
import { ThemeToggle } from "@/components/shared/ThemeToggle"

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/tools", label: "AI Tools", icon: Wrench },
  { href: "/projects", label: "Projects", icon: Rocket },
  { href: "/journal", label: "Journal", icon: BookOpen },
  { href: "/about", label: "About", icon: User },
  { href: "/contact", label: "Contact", icon: Mail },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 flex-col border-r bg-sidebar p-6">
      <Link href="/" className="mb-8 text-xl font-bold tracking-tight">
        AI<span className="text-primary">Showcase</span>
      </Link>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto pt-4 border-t">
        <ThemeToggle />
      </div>
    </aside>
  )
}
