"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { navItems } from "@/lib/nav"

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-[oklch(0.88_0.02_50)] dark:border-[oklch(0.2_0.02_45)] bg-[oklch(0.98_0.01_60)]/95 dark:bg-[oklch(0.09_0.01_40)]/95 backdrop-blur supports-[backdrop-filter]:bg-[oklch(0.98_0.01_60)]/60 dark:supports-[backdrop-filter]:bg-[oklch(0.09_0.01_40)]/60">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 text-xs transition-colors ${
                isActive
                  ? "text-[oklch(0.55_0.14_30)] dark:text-[oklch(0.68_0.12_30)]"
                  : "text-[oklch(0.5_0.03_40)] dark:text-[oklch(0.65_0.03_45)]"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
