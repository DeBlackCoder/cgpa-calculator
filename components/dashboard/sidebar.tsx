"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  BookOpen, 
  BarChart3, 
  Brain,
  Calculator,
  Settings, 
  Users,
  Building2,
  GraduationCap,
  LogOut,
  Menu,
  X,
  Calendar,
  Target
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
    { href: "/dashboard/predictions", label: "AI Predictions", icon: Target },
    { href: "/dashboard/tools", label: "Tools", icon: Calculator },
    { href: "/dashboard/ai-advisor", label: "AI Advisor", icon: Brain },
    { href: "/dashboard/timetable", label: "Timetable", icon: Calendar },
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
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X className="h-5 w-5 text-gray-700" />
        ) : (
          <Menu className="h-5 w-5 text-gray-700" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "flex flex-col h-full w-64 border-r border-gray-200 bg-white transition-transform duration-300 ease-in-out z-50 relative overflow-hidden",
        "fixed lg:relative",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Decorative gradient splash on left edge */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 via-purple-400 to-green-400" />
        
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-gray-200 bg-gradient-to-r from-blue-50/30 to-transparent">
          <Calculator className="h-6 w-6 text-blue-600 flex-shrink-0" />
          <span className="font-bold text-lg text-gray-900">CGPA AI</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/")
            
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm font-medium relative overflow-hidden",
                  isActive
                    ? "bg-gradient-to-r from-blue-50 to-transparent text-blue-700 shadow-sm border-l-2 border-l-blue-500"
                    : "text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent hover:text-gray-900"
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span>{link.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-red-50/20 to-transparent">
          <Button
            variant="ghost"
            className="w-full justify-start text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors rounded-lg"
            onClick={() => {
              setIsOpen(false)
              signOut({ callbackUrl: "/" })
            }}
          >
            <LogOut className="h-4 w-4 mr-3" />
            Sign Out
          </Button>
        </div>
      </div>
    </>
  )
}
