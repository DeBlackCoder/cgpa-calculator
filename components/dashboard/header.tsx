"use client"

import { Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface HeaderProps {
  user: {
    name: string
    email: string
    image?: string
  }
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 h-16 border-b border-zinc-200 dark:border-zinc-800 bg-gradient-to-r from-white via-indigo-50 to-purple-50 dark:from-zinc-950 dark:via-indigo-950/20 dark:to-purple-950/20 backdrop-blur-sm flex items-center justify-between px-4 sm:px-6 shadow-sm">
      {/* Search - Hidden on mobile */}
      <div className="hidden md:flex flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-400" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-10 border-indigo-200 dark:border-indigo-900 focus:border-indigo-500 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      {/* Mobile: Just show app name with proper spacing from hamburger */}
      <div className="md:hidden flex-1 ml-14 font-bold text-lg bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        Dashboard
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative h-9 w-9 hover:bg-gradient-to-br hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30 transition-all">
          <Bell className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full animate-pulse" />
        </Button>

        {/* User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* User info - Hidden on small mobile */}
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium truncate max-w-[150px] text-zinc-900 dark:text-zinc-100">{user.name}</p>
            <p className="text-xs text-zinc-500 truncate max-w-[150px]">{user.email}</p>
          </div>
          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm sm:text-base flex-shrink-0 shadow-lg shadow-purple-500/50 ring-2 ring-white dark:ring-zinc-900">
            {user.name.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  )
}
