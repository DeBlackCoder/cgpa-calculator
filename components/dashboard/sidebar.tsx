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
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/results", label: "My Results", icon: BookOpen },
    { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/dashboard/predictions", label: "AI Predictions", icon: MessageSquare },
    { href: "/dashboard/tools", label: "Tools", icon: Settings },
    { href: "/dashboard/ai-advisor", label: "AI Advisor", icon: MessageSquare },
    { href: "/dashboard/profile", label: "Profile", icon: Users }
  ]

  // Regular admin links (view-only)
  const regularAdminLinks = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/students", label: "Students", icon: Users },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart3 }
  ]

  // Senior admin links (can modify academic data)
  const seniorAdminLinks = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/students", label: "Students", icon: Users },
    { href: "/admin/faculties", label: "Faculties", icon: GraduationCap },
    { href: "/admin/departments", label: "Departments", icon: Building2 },
    { href: "/admin/programmes", label: "Programmes", icon: GraduationCap },
    { href: "/admin/courses", label: "Courses", icon: BookOpen },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/admin/settings", label: "Settings", icon: Settings }
  ]

  // Super admin links (full access + can manage admin roles)
  const superAdminLinks = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/students", label: "Students", icon: Users },
    { href: "/admin/users", label: "User Management", icon: Settings },
    { href: "/admin/admin-roles", label: "Admin Roles", icon: Users },
    { href: "/admin/faculties", label: "Faculties", icon: GraduationCap },
    { href: "/admin/departments", label: "Departments", icon: Building2 },
    { href: "/admin/programmes", label: "Programmes", icon: GraduationCap },
    { href: "/admin/courses", label: "Courses", icon: BookOpen },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/admin/settings", label: "Settings", icon: Settings }
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
        <div className="h-16 flex items-center gap-3 px-6 border-b border-zinc-200 dark:border-zinc-800">
          <GraduationCap className="h-6 w-6 text-blue-600 flex-shrink-0" />
          <span className="font-bold text-lg truncate">CGPA AI</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/")
            
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium",
                  isActive
                    ? "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100"
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span>{link.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
          <Button
            variant="ghost"
            className="w-full justify-start text-sm font-medium hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400"
            onClick={() => {
              setIsOpen(false)
              signOut({ callbackUrl: "/" })
            }}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Sign Out
          </Button>
        </div>
      </div>
    </>
  )
}
