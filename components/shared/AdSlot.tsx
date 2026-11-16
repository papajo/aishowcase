"use client"

import { useEffect } from "react"

export interface AdSlotProps {
  enabled: boolean
  slot?: string
  className?: string
}

export function isAdsEnabled(envValue: string | undefined = process.env.NEXT_PUBLIC_ADS_ENABLED): boolean {
  return envValue === "true"
}

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[]
  }
}

export function AdSlot({ enabled, slot = "default", className = "" }: AdSlotProps) {
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT

  useEffect(() => {
    if (!enabled || !adsenseClient) return
    try {
      window.adsbygoogle = window.adsbygoogle || []
      window.adsbygoogle.push({})
    } catch {
      // Ignore AdSense initialization errors in dev/adblock environments
    }
  }, [enabled, adsenseClient])

  if (!enabled) {
    return null
  }

  return (
    <aside
      aria-label="Advertisement"
      data-testid="ad-slot"
      data-slot={slot}
      className={`w-full rounded-xl border border-[oklch(0.88_0.02_50)/60] dark:border-[oklch(0.2_0.02_45)/60] bg-[oklch(0.96_0.01_55)]/40 dark:bg-[oklch(0.13_0.02_45)]/40 px-4 py-3 ${className}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[10px] uppercase tracking-widest text-[oklch(0.5_0.03_40)] dark:text-[oklch(0.65_0.03_45)]">
          Sponsored
        </span>
      </div>
      {adsenseClient ? (
        <ins
          className="adsbygoogle block"
          style={{ display: "block" }}
          data-ad-client={adsenseClient}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      ) : (
        <div className="min-h-[90px] flex items-center justify-center rounded-lg border border-dashed border-[oklch(0.88_0.02_50)] dark:border-[oklch(0.2_0.02_45)] text-xs font-mono text-[oklch(0.5_0.03_40)] dark:text-[oklch(0.65_0.03_45)]">
          Ad container ({slot}) — set NEXT_PUBLIC_ADSENSE_CLIENT to activate
        </div>
      )}
    </aside>
  )
}
