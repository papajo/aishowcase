"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Sparkles } from "lucide-react"
import { toast } from "sonner"

export function Footer() {
  const [email, setEmail] = useState("")

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    toast.success("Thanks for subscribing to our newsletter!")
    setEmail("")
  }

  return (
    <footer className="w-full bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-6 py-16">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-6 mb-12">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="h-8 w-8 rounded-lg bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center transition-transform group-hover:rotate-12 duration-300">
                <Sparkles className="h-4.5 w-4.5 text-white dark:text-zinc-900" />
              </div>
              <span className="font-bold text-lg tracking-tight text-zinc-900 dark:text-zinc-50">
                AI Showcase
              </span>
            </Link>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm">
              AI developer building, testing, and sharing tools daily.
              This is my showcase of projects, tools, and learnings on the frontier of AI development.
            </p>
          </div>

          {/* Links Cols */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-200">
              Products
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/tools" className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors">
                  AI Tools
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors">
                  Featured Projects
                </Link>
              </li>
              <li>
                <a href="/feed.xml" className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors">
                  RSS Feed
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-200">
              Support
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors">
                  Admin Panel
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors">
                  About Me
                </Link>
              </li>
            </ul>
          </div>

          {/* Subscribe Col */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-200">
              Subscribe to Newsletter
            </h4>
            <form onSubmit={handleSubscribe} className="space-y-2.5">
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium block">
                  Email *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md px-3.5 py-2 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 focus:border-transparent transition-all"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-250 text-white dark:text-zinc-900 font-semibold text-xs py-2 px-4 rounded-md transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Big Large Stroke text at bottom */}
        <div className="relative border-t border-zinc-200/60 dark:border-zinc-800/60 pt-12 select-none overflow-hidden">
          <div className="text-center md:text-left leading-none font-extrabold text-[12vw] tracking-tighter text-outline opacity-[0.06] dark:opacity-[0.03]">
            AI SHOWCASE
          </div>
        </div>

        {/* Bottom Socials & Copyright */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-zinc-200/40 dark:border-zinc-800/40 pt-8">
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            © {new Date().getFullYear()} AI Showcase. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-zinc-400 dark:text-zinc-500">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
              <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
              <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.507a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.87.507 9.388.507 9.388.507s7.518 0 9.388-.507a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
              <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>

      </div>
    </footer>
  )
}
