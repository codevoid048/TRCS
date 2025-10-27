"use client"

import { motion } from "framer-motion"
import { Sun, Moon } from "lucide-react"
import { useTheme } from "./ThemeProvider"

export default function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme()

  if (!mounted) {
    return (
      <div className="p-2 w-10 h-10 rounded-full">
        <div className="w-6 h-6 rounded-full animate-pulse" />
      </div>
    )
  }

  return (
    <motion.button
      whileHover={{ scale: 1.55 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="relative p-2 rounded-full transition-all duration-300"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <motion.div
        initial={false}
        animate={{
          rotate: theme === "dark" ? 180 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="relative w-6 h-6"
      >
        <Sun className="absolute inset-0 w-6 h-6 text-yellow-500 transition-opacity duration-300 opacity-100 dark:opacity-0" />
        <Moon className="absolute inset-0 w-6 h-6 text-blue-400 transition-opacity duration-300 opacity-0 dark:opacity-100" />
      </motion.div>
    </motion.button>
  )
}
