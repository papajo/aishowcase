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
    <section className="py-24 border-t border-[oklch(0.88_0.02_50)/60] dark:border-[oklch(0.2_0.02_45)/60]">
      <div className="max-w-md mx-auto text-center px-6">
        <h2 className="text-3xl md:text-4xl font-heading font-extrabold tracking-tight text-[oklch(0.15_0.02_40)] dark:text-[oklch(0.92_0.02_60)]">
          Stay updated with new posts and releases.
        </h2>
        <p className="text-sm text-[oklch(0.5_0.03_40)] dark:text-[oklch(0.65_0.03_45)] mt-3 max-w-sm mx-auto leading-relaxed">
          For a monthly digest of tools, logs, and updates delivered straight to your inbox.
        </p>
        
        <form onSubmit={handleSubmit} className="mt-8 text-left space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="newsletter-email" className="text-xs font-semibold text-[oklch(0.5_0.03_40)] dark:text-[oklch(0.65_0.03_45)]">
              Email *
            </label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full text-sm bg-white dark:bg-[oklch(0.13_0.02_45)] border border-[oklch(0.88_0.02_50)] dark:border-[oklch(0.2_0.02_45)] rounded-md px-3.5 py-2.5 text-[oklch(0.15_0.02_40)] dark:text-[oklch(0.92_0.02_60)] placeholder:text-[oklch(0.5_0.03_40)] dark:placeholder:text-[oklch(0.65_0.03_45)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.55_0.14_30)] dark:focus:ring-[oklch(0.68_0.12_30)] focus:border-transparent transition-all"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[oklch(0.55_0.14_30)] hover:bg-[oklch(0.5_0.14_30)] dark:bg-[oklch(0.68_0.12_30)] dark:hover:bg-[oklch(0.63_0.12_30)] text-white dark:text-[oklch(0.09_0.01_40)] font-bold text-xs py-3 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
      </div>
    </section>
  )
}
