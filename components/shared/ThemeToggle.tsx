"use client"

import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  function handleToggle() {
    // Add no-transition class to prevent flash
    document.documentElement.classList.add("no-transition")
    setTheme(theme === "dark" ? "light" : "dark")
    // Remove class after a frame
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.documentElement.classList.remove("no-transition")
      })
    })
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className="w-full justify-start gap-3"
    >
      <div className="relative h-4 w-4">
        <motion.div
          initial={false}
          animate={{
            rotate: theme === "dark" ? 0 : 90,
            scale: theme === "dark" ? 1 : 0,
          }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Sun className="h-4 w-4" />
        </motion.div>
        <motion.div
          initial={false}
          animate={{
            rotate: theme === "dark" ? 0 : -90,
            scale: theme === "dark" ? 0 : 1,
          }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Moon className="h-4 w-4" />
        </motion.div>
      </div>
      <span className="text-sm text-muted-foreground">
        {theme === "dark" ? "Light Mode" : "Dark Mode"}
      </span>
    </Button>
  )
}
