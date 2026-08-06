"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="relative h-9 w-9 rounded-lg"
      >
        <div className="h-5 w-5" />
      </Button>
    )
  }

  const isDark = resolvedTheme === "dark"

  const handleToggle = () => {
    const newTheme = isDark ? "light" : "dark"
    setTheme(newTheme)
    console.log("Theme toggled to:", newTheme)
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className="relative h-9 w-9 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <div className="relative w-5 h-5">
        {/* Sun Icon for Light Mode */}
        <Sun
          className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${
            isDark
              ? "rotate-90 scale-0 opacity-0"
              : "rotate-0 scale-100 opacity-100"
          } text-amber-500`}
        />
        
        {/* Moon Icon for Dark Mode */}
        <Moon
          className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${
            isDark
              ? "rotate-0 scale-100 opacity-100"
              : "-rotate-90 scale-0 opacity-0"
          } text-indigo-400`}
        />
      </div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
