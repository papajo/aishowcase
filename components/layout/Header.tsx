"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Sun, Moon, Sparkles } from "lucide-react"
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
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        
        {/* Left Side: Logo & Links */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-8 w-8 rounded-lg bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center transition-transform group-hover:rotate-12 duration-300">
              <Sparkles className="h-4.5 w-4.5 text-white dark:text-zinc-900" />
            </div>
            <span className="font-bold text-lg tracking-tight text-zinc-900 dark:text-zinc-50">
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
                      ? "text-zinc-900 dark:text-zinc-50"
                      : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
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
            className="rounded-full text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            aria-label="Toggle theme"
          >
            {resolvedTheme === "dark" ? (
              <Sun className="h-4.5 w-4.5" />
            ) : (
              <Moon className="h-4.5 w-4.5" />
            )}
          </Button>

          <Link href="/admin" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
            Sign In
          </Link>

          <Link href="/admin">
            <button className="bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 text-xs font-semibold px-4 py-2 rounded-full hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors">
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
            className="rounded-full text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            {resolvedTheme === "dark" ? (
              <Sun className="h-4.5 w-4.5" />
            ) : (
              <Moon className="h-4.5 w-4.5" />
            )}
          </Button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-6 py-4 space-y-3 absolute top-16 left-0 w-full shadow-lg z-50">
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
                      ? "text-zinc-900 dark:text-zinc-50"
                      : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                  }`}
                >
                  {link.name}
                </Link>
              )
            })}
          </nav>
          <div className="border-t border-zinc-150 dark:border-zinc-800 pt-3 flex flex-col gap-3">
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 py-1"
            >
              Sign In
            </Link>
            <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
              <button className="w-full bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 text-xs font-semibold py-2.5 rounded-full">
                Register
              </button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
