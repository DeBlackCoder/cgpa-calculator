"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  BookOpen, 
  BarChart3, 
  MessageSquare, 
  Settings, 
  Users,
  Building2,
  GraduationCap,
  LogOut,
  Menu,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"

interface SidebarProps {
  role: "STUDENT" | "ADMIN"
  isSuperAdmin?: boolean
  isSeniorAdmin?: boolean
}

export function Sidebar({ role, isSuperAdmin = false, isSeniorAdmin = false }: SidebarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const studentLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, color: "from-indigo-500 to-purple-500" },
    { href: "/dashboard/results", label: "My Results", icon: BookOpen, color: "from-purple-500 to-pink-500" },
    { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3, color: "from-pink-500 to-orange-500" },
    { href: "/dashboard/predictions", label: "AI Predictions", icon: MessageSquare, color: "from-orange-500 to-cyan-500" },
    { href: "/dashboard/tools", label: "Tools", icon: Settings, color: "from-cyan-500 to-indigo-500" },
    { href: "/dashboard/ai-advisor", label: "AI Advisor", icon: MessageSquare, color: "from-indigo-500 to-pink-500" },
    { href: "/dashboard/profile", label: "Profile", icon: Users, color: "from-purple-500 to-orange-500" }
  ]

  // Regular admin links (view-only)
  const regularAdminLinks = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard, color: "from-indigo-500 to-purple-500" },
    { href: "/admin/students", label: "Students", icon: Users, color: "from-purple-500 to-pink-500" },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart3, color: "from-pink-500 to-orange-500" }
  ]

  // Senior admin links (can modify academic data)
  const seniorAdminLinks = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard, color: "from-indigo-500 to-purple-500" },
    { href: "/admin/students", label: "Students", icon: Users, color: "from-purple-500 to-pink-500" },
    { href: "/admin/faculties", label: "Faculties", icon: GraduationCap, color: "from-pink-500 to-orange-500" },
    { href: "/admin/departments", label: "Departments", icon: Building2, color: "from-orange-500 to-cyan-500" },
    { href: "/admin/programmes", label: "Programmes", icon: GraduationCap, color: "from-cyan-500 to-indigo-500" },
    { href: "/admin/courses", label: "Courses", icon: BookOpen, color: "from-indigo-500 to-purple-500" },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart3, color: "from-purple-500 to-pink-500" },
    { href: "/admin/settings", label: "Settings", icon: Settings, color: "from-pink-500 to-orange-500" }
  ]

  // Super admin links (full access + can manage admin roles)
  const superAdminLinks = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard, color: "from-indigo-500 to-purple-500" },
    { href: "/admin/students", label: "Students", icon: Users, color: "from-purple-500 to-pink-500" },
    { href: "/admin/users", label: "User Management", icon: Settings, color: "from-pink-500 to-orange-500" },
    { href: "/admin/admin-roles", label: "Admin Roles", icon: Users, color: "from-orange-500 to-cyan-500" },
    { href: "/admin/faculties", label: "Faculties", icon: GraduationCap, color: "from-cyan-500 to-indigo-500" },
    { href: "/admin/departments", label: "Departments", icon: Building2, color: "from-indigo-500 to-purple-500" },
    { href: "/admin/programmes", label: "Programmes", icon: GraduationCap, color: "from-purple-500 to-pink-500" },
    { href: "/admin/courses", label: "Courses", icon: BookOpen, color: "from-pink-500 to-orange-500" },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart3, color: "from-orange-500 to-cyan-500" },
    { href: "/admin/settings", label: "Settings", icon: Settings, color: "from-cyan-500 to-indigo-500" }
  ]

  const links = role === "ADMIN" 
    ? (isSuperAdmin ? superAdminLinks : (isSeniorAdmin ? seniorAdminLinks : regularAdminLinks))
    : studentLinks

  return (
    <>
      {/* Mobile Menu Button - positioned to not overlap with header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "flex flex-col h-full w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 transition-transform duration-300 ease-in-out z-50",
        // Mobile: slide in from left
        "fixed lg:relative",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-zinc-200 dark:border-zinc-800 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          <GraduationCap className="h-6 w-6 text-white flex-shrink-0" />
          <span className="font-bold text-lg truncate text-white">CGPA AI</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-950">
          {links.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/")
            
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium group relative overflow-hidden",
                  isActive
                    ? `bg-gradient-to-r ${link.color} text-white shadow-lg shadow-${link.color.split('-')[1]}-500/50`
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-gradient-to-r hover:from-zinc-100 hover:to-zinc-50 dark:hover:from-zinc-800 dark:hover:to-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100 hover:shadow-md"
                )}
              >
                <div className={cn(
                  "p-2 rounded-lg transition-colors",
                  isActive 
                    ? "bg-white/20" 
                    : "bg-zinc-100 dark:bg-zinc-800 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700"
                )}>
                  <Icon className="h-5 w-5 flex-shrink-0" />
                </div>
                <span>{link.label}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-white animate-pulse" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-gradient-to-r from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-950">
          <Button
            variant="ghost"
            className="w-full justify-start text-sm font-medium hover:bg-gradient-to-r hover:from-red-500 hover:to-pink-500 hover:text-white transition-all duration-300 group rounded-xl"
            onClick={() => {
              setIsOpen(false)
              signOut({ callbackUrl: "/" })
            }}
          >
            <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 group-hover:bg-white/20 transition-colors mr-2">
              <LogOut className="h-4 w-4" />
            </div>
            Sign Out
          </Button>
        </div>
      </div>
    </>
  )
}
