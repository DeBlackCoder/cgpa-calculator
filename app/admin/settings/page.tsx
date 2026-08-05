"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, ShieldAlert, Database, Users, GraduationCap } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkAuthorization()
  }, [])

  async function checkAuthorization() {
    try {
      const res = await fetch("/api/admin/check-super-admin")
      if (res.ok) {
        const data = await res.json()
        if (data.isSuperAdmin) {
          setAuthorized(true)
        } else {
          setAuthorized(false)
        }
      } else {
        setAuthorized(false)
      }
    } catch (error) {
      setAuthorized(false)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  if (!authorized) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ShieldAlert className="h-16 w-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-center mb-6">
              Only super admins can access system settings.
            </p>
            <Button onClick={() => router.push('/admin')}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
          <Settings className="h-8 w-8" />
          System Settings
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Manage system-wide configurations and preferences
        </p>
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer"
          onClick={() => router.push('/admin/faculties')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-blue-600" />
              Faculties
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Manage faculties and their structure
            </p>
          </CardContent>
        </Card>

        <Card className="hover:border-purple-500 dark:hover:border-purple-400 transition-colors cursor-pointer"
          onClick={() => router.push('/admin/departments')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-purple-600" />
              Departments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Manage departments under faculties
            </p>
          </CardContent>
        </Card>

        <Card className="hover:border-green-500 dark:hover:border-green-400 transition-colors cursor-pointer"
          onClick={() => router.push('/admin/programmes')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-green-600" />
              Programmes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Manage academic programmes
            </p>
          </CardContent>
        </Card>

        <Card className="hover:border-purple-500 dark:hover:border-purple-400 transition-colors cursor-pointer"
          onClick={() => router.push('/admin/courses')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-purple-600" />
              Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Manage courses across departments
            </p>
          </CardContent>
        </Card>

        <Card className="hover:border-orange-500 dark:hover:border-orange-400 transition-colors cursor-pointer"
          onClick={() => router.push('/admin/users')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-orange-600" />
              Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Manage users and permissions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Info Alerts */}
      <Alert>
        <ShieldAlert className="h-4 w-4" />
        <AlertTitle>Super Admin Access</AlertTitle>
        <AlertDescription>
          You have super admin privileges. Be careful when making changes to system-wide settings as they affect all users.
        </AlertDescription>
      </Alert>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
          <CardDescription>Current system configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-zinc-200 dark:border-zinc-800">
            <span className="text-sm font-medium">Database</span>
            <span className="text-sm text-zinc-600 dark:text-zinc-400">MongoDB</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-zinc-200 dark:border-zinc-800">
            <span className="text-sm font-medium">Authentication</span>
            <span className="text-sm text-zinc-600 dark:text-zinc-400">NextAuth.js</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-zinc-200 dark:border-zinc-800">
            <span className="text-sm font-medium">AI Provider</span>
            <span className="text-sm text-zinc-600 dark:text-zinc-400">Google Gemini</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm font-medium">Framework</span>
            <span className="text-sm text-zinc-600 dark:text-zinc-400">Next.js 16</span>
          </div>
        </CardContent>
      </Card>

      {/* Access Control */}
      <Card>
        <CardHeader>
          <CardTitle>Access Control</CardTitle>
          <CardDescription>User role definitions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <h4 className="font-semibold text-red-900 dark:text-red-400 mb-2">Super Admin</h4>
            <ul className="text-sm text-red-800 dark:text-red-300 space-y-1">
              <li>• Full system access</li>
              <li>• Manage faculties, departments, and courses</li>
              <li>• Create and manage users</li>
              <li>• Access all analytics and reports</li>
            </ul>
          </div>

          <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold text-blue-900 dark:text-blue-400 mb-2">Regular Admin</h4>
            <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
              <li>• View-only access to system data</li>
              <li>• Access student information</li>
              <li>• View analytics and reports</li>
              <li>• Cannot modify site-wide settings</li>
            </ul>
          </div>

          <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <h4 className="font-semibold text-green-900 dark:text-green-400 mb-2">Student</h4>
            <ul className="text-sm text-green-800 dark:text-green-300 space-y-1">
              <li>• Manage own profile and results</li>
              <li>• Access AI predictions and recommendations</li>
              <li>• View personal analytics</li>
              <li>• Chat with AI advisor</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
