"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Terminal, Scissors, Sliders, GitCompare, Network, ArrowUpRight, CheckCircle2, AlertTriangle, Lock, Download } from "lucide-react"
import { toast } from "sonner"

type DemoTab = "rag" | "lora" | "parity" | "mlkg"

const SAMPLE_RAG_TEXT = `Pinecone is a managed serverless vector database designed for zero-ops scaling and metadata filtering. Weaviate combines BM25 keyword search with dense vector retrieval and supports structured GraphQL schemas. Qdrant is written in Rust and runs cleanly in a single Docker container with fast boolean payload filtering. For small RAG apps, hybrid retrieval (BM25 + embeddings) often improves recall on exact product names, error codes, and proper nouns.`

const PARITY_PRESETS = {
  pass: {
    legacy: "00010428910000125000USD20261116CARDDEMO_ACCT_01  OK\n00010428920000084550USD20261116CARDDEMO_ACCT_02  OK",
    modern: "00010428910000125000USD20261116CARDDEMO_ACCT_01  OK\n00010428920000084550USD20261116CARDDEMO_ACCT_02  OK",
  },
  mismatch: {
    legacy: "00010428910000125000USD20261116CARDDEMO_ACCT_01  OK\n00010428920000084550USD20261116CARDDEMO_ACCT_02  OK",
    modern: "00010428910000125000USD20261116CARDDEMO_ACCT_01  OK\n00010428920000084551USD20261116CARDDEMO_ACCT_02  OK",
  },
}

function tokenize(text: string): string[] {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean)
}

function RagChunkDemo() {
  const [text, setText] = useState(SAMPLE_RAG_TEXT)
  const [chunkSize, setChunkSize] = useState(160)
  const [overlap, setOverlap] = useState(30)
  const [query, setQuery] = useState("Rust Docker payload filtering")

  const chunks = useMemo(() => {
    const step = Math.max(20, chunkSize - Math.min(overlap, chunkSize - 20))
    const out: { index: number; start: number; end: number; text: string; score: number }[] = []
    const qTokens = new Set(tokenize(query))

    for (let start = 0; start < text.length; start += step) {
      const end = Math.min(text.length, start + chunkSize)
      const slice = text.slice(start, end)
      const cTokens = tokenize(slice)
      const hits = cTokens.filter((t) => qTokens.has(t)).length
      const score = qTokens.size > 0 ? Math.min(0.99, hits / Math.max(1, qTokens.size)) : 0
      out.push({ index: out.length + 1, start, end, text: slice, score })
      if (end === text.length) break
    }
    return out.sort((a, b) => b.score - a.score)
  }, [text, chunkSize, overlap, query])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-heading font-bold">RAG Chunking &amp; Retrieval Simulator</h2>
          <p className="text-sm text-muted-foreground">
            Adjust chunk size and overlap to inspect how text splits affect keyword/hybrid match scores.
          </p>
        </div>
        <Link href="/projects/rag-pipeline" className="text-xs font-mono text-[oklch(0.55_0.14_30)] dark:text-[oklch(0.68_0.12_30)] hover:underline inline-flex items-center gap-1">
          Related project <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-2">
          <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground block">
            Source Document
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground block mb-1">
              Query
            </label>
            <Input value={query} onChange={(e) => setQuery(e.target.value)} className="font-mono text-sm" />
          </div>
          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span>Chunk Size</span>
              <span>{chunkSize} chars</span>
            </div>
            <input type="range" min={80} max={320} step={20} value={chunkSize} onChange={(e) => setChunkSize(Number(e.target.value))} className="w-full accent-[oklch(0.55_0.14_30)]" />
          </div>
          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span>Overlap</span>
              <span>{overlap} chars</span>
            </div>
            <input type="range" min={0} max={100} step={10} value={overlap} onChange={(e) => setOverlap(Number(e.target.value))} className="w-full accent-[oklch(0.55_0.14_30)]" />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="text-xs font-mono text-muted-foreground">
          Ranked Chunks ({chunks.length} total)
        </div>
        <div className="grid gap-3">
          {chunks.map((c) => (
            <div key={c.index} className="rounded-lg border border-border bg-card/60 p-3.5 text-sm">
              <div className="flex items-center justify-between mb-1.5 font-mono text-xs">
                <span className="text-muted-foreground">
                  chunk #{c.index} [{c.start}:{c.end}]
                </span>
                <Badge variant={c.score >= 0.5 ? "default" : "secondary"} className="font-mono text-[11px]">
                  score: {c.score.toFixed(2)}
                </Badge>
              </div>
              <p className="font-mono text-xs leading-relaxed text-foreground/90">{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function LoraLabDemo() {
  const [rank, setRank] = useState(16)
  const [alpha, setAlpha] = useState(32)
  const [baseParamsB, setBaseParamsB] = useState(8)
  const [scheduler, setScheduler] = useState<"cosine" | "linear" | "constant">("cosine")

  const trainableMillions = useMemo(() => {
    // Approximate adapter parameter count across attention projections (~0.05% * r/8 scaled)
    return (baseParamsB * 1000 * 0.00055 * (rank / 8)).toFixed(2)
  }, [baseParamsB, rank])

  const trainablePct = useMemo(() => {
    return ((Number(trainableMillions) / (baseParamsB * 1000)) * 100).toFixed(3)
  }, [trainableMillions, baseParamsB])

  const curvePoints = useMemo(() => {
    const pts: string[] = []
    for (let step = 0; step <= 20; step++) {
      const t = step / 20
      let lr = 1
      if (t < 0.1) {
        lr = t / 0.1
      } else if (scheduler === "cosine") {
        lr = 0.5 * (1 + Math.cos(Math.PI * ((t - 0.1) / 0.9)))
      } else if (scheduler === "linear") {
        lr = 1 - (t - 0.1) / 0.9
      }
      const x = 10 + t * 280
      const y = 90 - lr * 70
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`)
    }
    return pts.join(" ")
  }, [scheduler])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-heading font-bold">LoRA Adapter &amp; LR Scheduler Lab</h2>
          <p className="text-sm text-muted-foreground">
            Explore how LoRA rank, alpha scaling, and learning-rate schedules change trainable footprint.
          </p>
        </div>
        <Link href="/projects/lora-training-lab" className="text-xs font-mono text-[oklch(0.55_0.14_30)] dark:text-[oklch(0.68_0.12_30)] hover:underline inline-flex items-center gap-1">
          Related project <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span>LoRA Rank (r)</span>
              <span>{rank}</span>
            </div>
            <input type="range" min={4} max={64} step={4} value={rank} onChange={(e) => setRank(Number(e.target.value))} className="w-full accent-[oklch(0.55_0.14_30)]" />
          </div>
          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span>LoRA Alpha (α)</span>
              <span>{alpha}</span>
            </div>
            <input type="range" min={8} max={128} step={8} value={alpha} onChange={(e) => setAlpha(Number(e.target.value))} className="w-full accent-[oklch(0.55_0.14_30)]" />
          </div>
          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span>Base Model Size</span>
              <span>{baseParamsB}B params</span>
            </div>
            <input type="range" min={1} max={70} step={1} value={baseParamsB} onChange={(e) => setBaseParamsB(Number(e.target.value))} className="w-full accent-[oklch(0.55_0.14_30)]" />
          </div>
          <div className="flex gap-2 pt-1">
            {(["cosine", "linear", "constant"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setScheduler(mode)}
                className={`px-3 py-1.5 rounded-md text-xs font-mono border transition-colors ${
                  scheduler === mode
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg border border-border p-3">
              <div className="text-[10px] font-mono uppercase text-muted-foreground">Trainable</div>
              <div className="text-lg font-mono font-bold mt-1">{trainableMillions}M</div>
            </div>
            <div className="rounded-lg border border-border p-3">
              <div className="text-[10px] font-mono uppercase text-muted-foreground">% of Base</div>
              <div className="text-lg font-mono font-bold mt-1">{trainablePct}%</div>
            </div>
            <div className="rounded-lg border border-border p-3">
              <div className="text-[10px] font-mono uppercase text-muted-foreground">α / r Scale</div>
              <div className="text-lg font-mono font-bold mt-1">{(alpha / rank).toFixed(2)}x</div>
            </div>
          </div>

          <div className="rounded-lg border border-border p-3 bg-card/50">
            <div className="text-[10px] font-mono uppercase text-muted-foreground mb-2">
              LR Schedule (10% warmup → {scheduler})
            </div>
            <svg viewBox="0 0 300 100" className="w-full h-28">
              <line x1="10" y1="90" x2="290" y2="90" stroke="currentColor" strokeOpacity="0.2" />
              <line x1="10" y1="15" x2="10" y2="90" stroke="currentColor" strokeOpacity="0.2" />
              <polyline
                fill="none"
                stroke="oklch(0.68 0.12 30)"
                strokeWidth="2.5"
                points={curvePoints}
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

function ParityDiffDemo() {
  const [legacy, setLegacy] = useState(PARITY_PRESETS.mismatch.legacy)
  const [modern, setModern] = useState(PARITY_PRESETS.mismatch.modern)

  const diff = useMemo(() => {
    const maxLen = Math.max(legacy.length, modern.length)
    const mismatches: { offset: number; expected: string; actual: string }[] = []
    for (let i = 0; i < maxLen; i++) {
      if (legacy[i] !== modern[i]) {
        mismatches.push({
          offset: i,
          expected: legacy[i] ?? "<EOF>",
          actual: modern[i] ?? "<EOF>",
        })
      }
    }
    return { totalBytes: maxLen, mismatches, isMatch: mismatches.length === 0 }
  }, [legacy, modern])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-heading font-bold">COBOL → Spring Batch Byte-Parity Checker</h2>
          <p className="text-sm text-muted-foreground">
            Compare legacy fixed-width batch records against modern output byte-for-byte.
          </p>
        </div>
        <Link href="/projects/cobol-to-cloud" className="text-xs font-mono text-[oklch(0.55_0.14_30)] dark:text-[oklch(0.68_0.12_30)] hover:underline inline-flex items-center gap-1">
          Related project <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => { setLegacy(PARITY_PRESETS.pass.legacy); setModern(PARITY_PRESETS.pass.modern) }}
          className="px-3 py-1.5 rounded-md text-xs font-mono border border-border hover:bg-muted transition-colors"
        >
          Load Passing Batch
        </button>
        <button
          onClick={() => { setLegacy(PARITY_PRESETS.mismatch.legacy); setModern(PARITY_PRESETS.mismatch.modern) }}
          className="px-3 py-1.5 rounded-md text-xs font-mono border border-border hover:bg-muted transition-colors"
        >
          Load 1-Byte Drift
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground block mb-1.5">
            Legacy COBOL Golden Output
          </label>
          <textarea
            value={legacy}
            onChange={(e) => setLegacy(e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs font-mono"
          />
        </div>
        <div>
          <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground block mb-1.5">
            Spring Batch Output
          </label>
          <textarea
            value={modern}
            onChange={(e) => setModern(e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs font-mono"
          />
        </div>
      </div>

      <div className="rounded-lg border border-border p-4 bg-card/60 flex items-start gap-3">
        {diff.isMatch ? (
          <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
        ) : (
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
        )}
        <div className="space-y-1 text-xs font-mono">
          <div className="font-semibold text-sm">
            {diff.isMatch
              ? `PARITY PASS — ${diff.totalBytes} bytes identical`
              : `PARITY DRIFT — ${diff.mismatches.length} byte mismatch(es) across ${diff.totalBytes} bytes`}
          </div>
          {diff.mismatches.slice(0, 5).map((m) => (
            <div key={m.offset} className="text-muted-foreground">
              offset {m.offset}: expected <span className="text-foreground">{JSON.stringify(m.expected)}</span>, got{" "}
              <span className="text-amber-500">{JSON.stringify(m.actual)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function MlKnowledgeGraphDemo() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [unlockedHtml, setUnlockedHtml] = useState<string | null>(null)

  function triggerDownload(html: string) {
    const blob = new Blob([html], { type: "text/html;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "ml-knowledge-graph-studio.html"
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  async function handleUnlock(e: React.FormEvent) {
    e.preventDefault()
    if (!email || loading) return
    setLoading(true)
    try {
      const res = await fetch("/api/demos/studio-download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        toast.error("Signup failed", { description: err.error || "Please check your email and try again." })
        return
      }
      const html = await res.text()
      setUnlockedHtml(html)
      triggerDownload(html)
      toast.success("Study Studio v2 unlocked!", {
        description: "Downloading ml-knowledge-graph-studio.html now.",
      })
    } catch {
      toast.error("Error", { description: "Could not reach the server. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-heading font-bold">AI / ML Knowledge Graph Tutor</h2>
          <p className="text-sm text-muted-foreground">
            Interactive prerequisite graph, code challenges, and visual labs (Gradient Descent, Attention Lens, Grokking).
          </p>
        </div>
        <a
          href="/demos/ml-knowledge-graph.html"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-mono text-[oklch(0.55_0.14_30)] dark:text-[oklch(0.68_0.12_30)] hover:underline inline-flex items-center gap-1 shrink-0"
        >
          Open v1 fullscreen <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </div>

      {/* Signup Wall for Study Studio (v2) Download */}
      <div className="rounded-xl border border-[oklch(0.55_0.14_30)/40] dark:border-[oklch(0.68_0.12_30)/40] bg-[oklch(0.55_0.14_30)/5] dark:bg-[oklch(0.68_0.12_30)/5] p-5 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Lock className="h-4 w-4 text-[oklch(0.55_0.14_30)] dark:text-[oklch(0.68_0.12_30)]" />
          <span className="font-heading font-bold text-sm">
            Download Study Studio Edition (v2 — Standalone HTML)
          </span>
          <Badge variant="secondary" className="font-mono text-[10px]">FREE AFTER SIGNUP</Badge>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          The downloadable v2 edition adds the complete <strong>Study Studio</strong> tab with all 7 learning methods:
          Socratic questioning, 3-level explanations (child → high school → academic), 3-tier practice questions,
          paper/PDF summarize &amp; compare, 20 categorized key terms, Bloom&apos;s taxonomy challenges, and analogies.
        </p>

        {unlockedHtml ? (
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => triggerDownload(unlockedHtml)}
              className="inline-flex items-center gap-2 rounded-lg bg-[oklch(0.55_0.14_30)] dark:bg-[oklch(0.68_0.12_30)] text-white dark:text-[oklch(0.09_0.01_40)] px-4 py-2 text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              <Download className="h-3.5 w-3.5" />
              Download ml-knowledge-graph-studio.html again
            </button>
            <span className="text-xs font-mono text-emerald-500">✓ Unlocked</span>
          </div>
        ) : (
          <form onSubmit={handleUnlock} className="flex flex-col sm:flex-row gap-2.5 pt-1 max-w-lg">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="bg-background font-mono text-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[oklch(0.55_0.14_30)] dark:bg-[oklch(0.68_0.12_30)] text-white dark:text-[oklch(0.09_0.01_40)] px-4 py-2 text-xs font-semibold whitespace-nowrap hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Download className="h-3.5 w-3.5" />
              {loading ? "Unlocking..." : "Sign up & Download"}
            </button>
          </form>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-[#0d1117]">
        <iframe
          src="/demos/ml-knowledge-graph.html"
          title="AI/ML Knowledge Graph Tutor (v1 Preview)"
          className="w-full h-[760px] border-0"
        />
      </div>
    </div>
  )
}

export function DemosClient() {
  const [activeTab, setActiveTab] = useState<DemoTab>("rag")

  const tabs: { id: DemoTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "mlkg", label: "ML Knowledge Graph", icon: Network },
    { id: "rag", label: "RAG Chunking", icon: Scissors },
    { id: "lora", label: "LoRA & LR Lab", icon: Sliders },
    { id: "parity", label: "Byte-Parity Diff", icon: GitCompare },
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const active = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-mono transition-colors border ${
                active
                  ? "bg-[oklch(0.55_0.14_30)] text-white dark:bg-[oklch(0.68_0.12_30)] dark:text-[oklch(0.09_0.01_40)] border-transparent"
                  : "border-border bg-card/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      <Card>
        <CardHeader className="border-b border-border/60 pb-4">
          <CardTitle className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
            <Terminal className="h-4 w-4 text-[oklch(0.55_0.14_30)] dark:text-[oklch(0.68_0.12_30)]" />
            Interactive Client-Side Sandbox
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {activeTab === "mlkg" && <MlKnowledgeGraphDemo />}
          {activeTab === "rag" && <RagChunkDemo />}
          {activeTab === "lora" && <LoraLabDemo />}
          {activeTab === "parity" && <ParityDiffDemo />}
        </CardContent>
      </Card>
    </div>
  )
}
