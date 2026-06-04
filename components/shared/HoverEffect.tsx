"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface HoverEffectProps {
  children: ReactNode
  className?: string
  scale?: number
  y?: number
}

export function HoverEffect({
  children,
  className,
  scale = 1.02,
  y = -2,
}: HoverEffectProps) {
  return (
    <motion.div
      whileHover={{ scale, y }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Card with built-in hover effect
interface AnimatedCardProps {
  children: ReactNode
  className?: string
}

export function AnimatedCard({ children, className }: AnimatedCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Button press effect
export function PressEffect({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
