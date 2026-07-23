"use client"

import { useTheme } from "@/components/shared/Providers"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="w-full justify-start gap-3"
    >
      <div className="relative h-4 w-4">
        <Sun className="h-4 w-4 absolute inset-0 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-[oklch(0.55_0.14_30)] dark:text-[oklch(0.68_0.12_30)]" />
        <Moon className="h-4 w-4 absolute inset-0 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-[oklch(0.55_0.14_30)] dark:text-[oklch(0.68_0.12_30)]" />
      </div>
      <span className="text-sm text-[oklch(0.5_0.03_40)] dark:text-[oklch(0.65_0.03_45)]">
        {resolvedTheme === "dark" ? "Light Mode" : "Dark Mode"}
      </span>
    </Button>
  )
}
