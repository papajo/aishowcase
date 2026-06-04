"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"
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
        toast.success("Subscribed!", { description: data.message })
        setEmail("")
      } else {
        toast.error("Error", { description: data.error })
      }
    } catch {
      toast.error("Error", { description: "Something went wrong" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="rounded-xl border bg-card p-8">
      <div className="max-w-xl">
        <h2 className="text-2xl font-bold mb-2">Stay Updated</h2>
        <p className="text-muted-foreground mb-4">
          Get weekly updates on AI tools, projects, and insights delivered to your inbox.
        </p>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            required
            className="flex-1"
          />
          <Button type="submit" disabled={loading}>
            {loading ? (
              <span className="animate-pulse">...</span>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Subscribe
              </>
            )}
          </Button>
        </form>
      </div>
    </section>
  )
}
