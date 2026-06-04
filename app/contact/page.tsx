"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Send, Code, Globe, Mail } from "lucide-react"
import { toast } from "sonner"

export default function ContactPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      })

      const data = await res.json()

      if (res.ok) {
        toast.success("Message sent!", { description: "I'll get back to you soon." })
        setName("")
        setEmail("")
        setMessage("")
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
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Contact</h1>
      <p className="text-muted-foreground mb-8">
        Have a question or want to collaborate? Reach out!
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Form */}
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="text-sm font-medium mb-1.5 block">
                  Name
                </label>
                <Input
                  id="name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="text-sm font-medium mb-1.5 block">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="text-sm font-medium mb-1.5 block">
                  Message
                </label>
                <textarea
                  id="message"
                  placeholder="Your message..."
                  value={message}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
                  required
                  rows={5}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <span className="animate-pulse">Sending...</span>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Social Links */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Connect With Me</h2>
          <a
            href="https://github.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Card className="transition-colors hover:border-primary/50">
              <CardContent className="p-4 flex items-center gap-4">
                <Code className="h-6 w-6" />
                <div>
                  <div className="font-medium">GitHub</div>
                  <div className="text-sm text-muted-foreground">
                    Check out my projects
                  </div>
                </div>
              </CardContent>
            </Card>
          </a>
          <a
            href="https://linkedin.com/in/yourusername"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Card className="transition-colors hover:border-primary/50">
              <CardContent className="p-4 flex items-center gap-4">
                <Globe className="h-6 w-6" />
                <div>
                  <div className="font-medium">LinkedIn</div>
                  <div className="text-sm text-muted-foreground">
                    Let&apos;s connect professionally
                  </div>
                </div>
              </CardContent>
            </Card>
          </a>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <Mail className="h-6 w-6" />
              <div>
                <div className="font-medium">Email</div>
                <div className="text-sm text-muted-foreground">
                  hello@yourdomain.com
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
