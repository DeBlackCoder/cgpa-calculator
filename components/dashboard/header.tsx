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
    <header className="sticky top-0 z-30 h-16 border-b border-gray-200 bg-white flex items-center justify-between px-4 sm:px-6">
      {/* Search - Hidden on mobile */}
      <div className="hidden md:flex flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-10 bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-500"
          />
        </div>
      </div>

      {/* Mobile: App name with proper spacing from hamburger */}
      <div className="md:hidden flex-1 ml-14 font-bold text-lg text-gray-900">
        Dashboard
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative h-9 w-9 hover:bg-gray-50 text-gray-700">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-blue-600 rounded-full" />
        </Button>

        {/* User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-gray-900 truncate max-w-[150px]">{user.name}</p>
            <p className="text-xs text-gray-600 truncate max-w-[150px]">{user.email}</p>
          </div>
          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm sm:text-base flex-shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  )
}
