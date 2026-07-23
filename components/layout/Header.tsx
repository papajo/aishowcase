"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Sun, Moon } from "lucide-react"
import { useTheme } from "@/components/shared/Providers"
import { Button } from "@/components/ui/button"

export function Header() {
  const pathname = usePathname()
  const { resolvedTheme, setTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { name: "Tools", href: "/tools" },
    { name: "Projects", href: "/projects" },
    { name: "Journal", href: "/journal" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[oklch(0.88_0.02_50)] dark:border-[oklch(0.2_0.02_45)] bg-white/80 dark:bg-[#131214]/80 backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        
        {/* Left Side: Logo & Links */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-8 w-8 rounded-lg bg-[oklch(0.55_0.14_30)] flex items-center justify-center transition-transform group-hover:rotate-12 duration-300">
              <span className="text-white font-heading font-bold text-sm">A</span>
            </div>
            <span className="font-heading font-bold text-lg tracking-tight text-[oklch(0.15_0.02_40)] dark:text-[oklch(0.92_0.02_60)]">
              AI Showcase
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href)
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive
                      ? "text-[oklch(0.15_0.02_40)] dark:text-[oklch(0.92_0.02_60)]"
                      : "text-[oklch(0.5_0.03_40)] hover:text-[oklch(0.15_0.02_40)] dark:text-[oklch(0.65_0.03_45)] dark:hover:text-[oklch(0.92_0.02_60)]"
                  }`}
                >
                  {link.name}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Right Side: Actions & Theme Toggle */}
        <div className="hidden md:flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="rounded-full text-[oklch(0.5_0.03_40)] hover:text-[oklch(0.15_0.02_40)] dark:text-[oklch(0.65_0.03_45)] dark:hover:text-[oklch(0.92_0.02_60)]"
            aria-label="Toggle theme"
          >
            {resolvedTheme === "dark" ? (
              <Sun className="h-4.5 w-4.5" />
            ) : (
              <Moon className="h-4.5 w-4.5" />
            )}
          </Button>

          <Link href="/admin" className="text-sm font-medium text-[oklch(0.5_0.03_40)] hover:text-[oklch(0.15_0.02_40)] dark:text-[oklch(0.65_0.03_45)] dark:hover:text-[oklch(0.92_0.02_60)]">
            Sign In
          </Link>

          <Link href="/admin">
            <button className="bg-[oklch(0.55_0.14_30)] text-white dark:bg-[oklch(0.68_0.12_30)] dark:text-[oklch(0.09_0.01_40)] text-xs font-semibold px-4 py-2 rounded-full hover:bg-[oklch(0.5_0.14_30)] dark:hover:bg-[oklch(0.63_0.12_30)] transition-colors">
              Register
            </button>
          </Link>
        </div>

        {/* Mobile Action Controls */}
        <div className="flex md:hidden items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="rounded-full text-[oklch(0.5_0.03_40)] hover:text-[oklch(0.15_0.02_40)] dark:text-[oklch(0.65_0.03_45)] dark:hover:text-[oklch(0.92_0.02_60)]"
          >
            {resolvedTheme === "dark" ? (
              <Sun className="h-4.5 w-4.5" />
            ) : (
              <Moon className="h-4.5 w-4.5" />
            )}
          </Button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1 text-[oklch(0.5_0.03_40)] hover:text-[oklch(0.15_0.02_40)] dark:text-[oklch(0.65_0.03_45)] dark:hover:text-[oklch(0.92_0.02_60)]"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[oklch(0.88_0.02_50)] dark:border-[oklch(0.2_0.02_45)] bg-white dark:bg-[#131214] px-6 py-4 space-y-3 absolute top-16 left-0 w-full shadow-lg z-50">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href)
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm font-semibold transition-colors py-1 ${
                    isActive
                      ? "text-[oklch(0.15_0.02_40)] dark:text-[oklch(0.92_0.02_60)]"
                      : "text-[oklch(0.5_0.03_40)] hover:text-[oklch(0.15_0.02_40)] dark:text-[oklch(0.65_0.03_45)] dark:hover:text-[oklch(0.92_0.02_60)]"
                  }`}
                >
                  {link.name}
                </Link>
              )
            })}
          </nav>
          <div className="border-t border-[oklch(0.88_0.02_50)] dark:border-[oklch(0.2_0.02_45)] pt-3 flex flex-col gap-3">
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold text-[oklch(0.5_0.03_40)] hover:text-[oklch(0.15_0.02_40)] dark:text-[oklch(0.65_0.03_45)] dark:hover:text-[oklch(0.92_0.02_60)] py-1"
            >
              Sign In
            </Link>
            <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
              <button className="w-full bg-[oklch(0.55_0.14_30)] text-white dark:bg-[oklch(0.68_0.12_30)] dark:text-[oklch(0.09_0.01_40)] text-xs font-semibold py-2.5 rounded-full">
                Register
              </button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
