import type { Metadata } from "next"
import { DemosClient } from "@/components/demos/DemosClient"

export const metadata: Metadata = {
  title: "Demos",
  description:
    "Interactive browser sandboxes for RAG chunking, LoRA adapter sizing, and COBOL-to-Spring Batch byte-parity testing.",
}

export default function DemosPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-widest text-[oklch(0.55_0.14_30)] dark:text-[oklch(0.68_0.12_30)] mb-2">
          Interactive Sandboxes
        </p>
        <h1 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight mb-2">
          Live Demos
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Hands-on browser simulations paired with my open-source projects—zero API keys or backend setup required.
        </p>
      </div>

      <DemosClient />
    </div>
  )
}
