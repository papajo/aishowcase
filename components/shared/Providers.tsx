"use client"

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react"

type Theme = "light" | "dark" | "system"

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: "light" | "dark"
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  setTheme: () => {},
  resolvedTheme: "dark",
})

export function useTheme() {
  return useContext(ThemeContext)
}

const STORAGE_KEY = "theme"

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "dark"
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function applyTheme(theme: Theme, attribute: string) {
  const resolved = theme === "system" ? getSystemTheme() : theme
  const root = document.documentElement
  if (attribute === "class") {
    root.classList.remove("light", "dark")
    root.classList.add(resolved)
  } else {
    root.setAttribute(attribute, resolved)
  }
}

export function ThemeProvider({
  children,
  attribute = "class",
  defaultTheme = "dark",
  enableSystem = true,
  enableColorScheme = false,
}: {
  children: React.ReactNode
  attribute?: string
  defaultTheme?: Theme
  enableSystem?: boolean
  enableColorScheme?: boolean
}) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme)
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("dark")

  const resolveTheme = useCallback((t: Theme) => {
    return t === "system" ? getSystemTheme() : t
  }, [])

  useEffect(() => {
    // Read stored preference on mount
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
      if (stored && (stored === "light" || stored === "dark" || (enableSystem && stored === "system"))) {
        setThemeState(stored)
        const resolved = resolveTheme(stored)
        setResolvedTheme(resolved)
        applyTheme(stored, attribute)
      } else {
        setThemeState(defaultTheme)
        const resolved = resolveTheme(defaultTheme)
        setResolvedTheme(resolved)
        applyTheme(defaultTheme, attribute)
      }
    } catch {
      applyTheme(defaultTheme, attribute)
    }
  }, [defaultTheme, attribute, enableSystem, resolveTheme])

  // Listen for system theme changes when in "system" mode
  useEffect(() => {
    if (!enableSystem || theme !== "system") return
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const handler = () => {
      const resolved = getSystemTheme()
      setResolvedTheme(resolved)
      applyTheme("system", attribute)
    }
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [theme, attribute, enableSystem])

  // Listen for storage events from other tabs
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        const stored = e.newValue as Theme
        setThemeState(stored)
        const resolved = resolveTheme(stored)
        setResolvedTheme(resolved)
        applyTheme(stored, attribute)
      }
    }
    window.addEventListener("storage", handler)
    return () => window.removeEventListener("storage", handler)
  }, [attribute, resolveTheme])

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t)
    const resolved = resolveTheme(t)
    setResolvedTheme(resolved)
    applyTheme(t, attribute)
    try { localStorage.setItem(STORAGE_KEY, t) } catch {}
  }, [attribute, resolveTheme])

  const value = useMemo(() => ({
    theme,
    setTheme,
    resolvedTheme,
    themes: enableSystem ? (["light", "dark", "system"] as Theme[]) : (["light", "dark"] as Theme[]),
  }), [theme, setTheme, resolvedTheme, enableSystem])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      enableColorScheme={false}
    >
      {children}
    </ThemeProvider>
  )
}
