"use client"

import React, { useState } from "react"
import { toast } from "sonner"

export function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (res.ok) {
        toast.success("Subscribed!", { description: data.message || "Thank you for subscribing!" })
        setEmail("")
      } else {
        toast.error("Error", { description: data.error || "Subscription failed" })
      }
    } catch {
      toast.error("Error", { description: "Something went wrong" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-24 border-t border-zinc-250/60 dark:border-zinc-800/60">
      <div className="max-w-md mx-auto text-center px-6">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          Stay updated with new posts and releases.
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-3 max-w-sm mx-auto leading-relaxed">
          For a monthly digest of tools, logs, and updates delivered straight to your inbox.
        </p>
        
        <form onSubmit={handleSubmit} className="mt-8 text-left space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="newsletter-email" className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
              Email *
            </label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md px-3.5 py-2.5 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-450 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-650 focus:border-transparent transition-all"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-zinc-900 hover:bg-zinc-850 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-bold text-xs py-3 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
      </div>
    </section>
  )
}
