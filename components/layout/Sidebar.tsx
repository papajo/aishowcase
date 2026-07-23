"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { navItems } from "@/lib/nav"
import { ThemeToggle } from "@/components/shared/ThemeToggle"

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 flex-col border-r border-[oklch(0.88_0.02_50)] dark:border-[oklch(0.2_0.02_45)] bg-[oklch(0.96_0.01_55)] dark:bg-[oklch(0.11_0.02_45)] p-6">
      <Link href="/" className="mb-8 text-xl font-heading font-bold tracking-tight text-[oklch(0.15_0.02_40)] dark:text-[oklch(0.92_0.02_60)]">
        AI<span className="text-[oklch(0.55_0.14_30)] dark:text-[oklch(0.68_0.12_30)]">Showcase</span>
      </Link>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                isActive
                  ? "bg-[oklch(0.55_0.14_30)/10] dark:bg-[oklch(0.68_0.12_30)/10] text-[oklch(0.55_0.14_30)] dark:text-[oklch(0.68_0.12_30)]"
                  : "text-[oklch(0.5_0.03_40)] dark:text-[oklch(0.65_0.03_45)] hover:bg-[oklch(0.94_0.01_50)] dark:hover:bg-[oklch(0.16_0.02_40)] hover:text-[oklch(0.15_0.02_40)] dark:hover:text-[oklch(0.78_0.02_55)]"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-[oklch(0.88_0.02_50)] dark:border-[oklch(0.2_0.02_45)]">
        <ThemeToggle />
      </div>
    </aside>
  )
}
