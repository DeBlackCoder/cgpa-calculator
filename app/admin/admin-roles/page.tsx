"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, ShieldAlert, ShieldCheck, Crown, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Admin {
  _id: string
  name: string
  email: string
  adminRole: 'SUPER_ADMIN' | 'SENIOR_ADMIN' | 'REGULAR_ADMIN' | null
  createdAt: string
}

const roleInfo = {
  SUPER_ADMIN: {
    label: "Super Admin",
    icon: Crown,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
    description: "Full access + Can promote admins"
  },
  SENIOR_ADMIN: {
    label: "Senior Admin",
    icon: ShieldCheck,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    description: "Can modify courses, departments, programmes, faculties"
  },
  REGULAR_ADMIN: {
    label: "Regular Admin",
    icon: Shield,
    color: "text-gray-600",
    bgColor: "bg-gray-100",
    description: "View-only access to admin panels"
  }
}

export default function AdminRolesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [admins, setAdmins] = useState<Admin[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    } else if (status === "authenticated" && session?.user.role !== "ADMIN") {
      router.push("/dashboard")
    } else if (status === "authenticated") {
      fetchAdmins()
    }
  }, [status, session, router])

  const fetchAdmins = async () => {
    try {
      const response = await fetch("/api/admin/roles")
      if (response.ok) {
        const data = await response.json()
        setAdmins(data.admins)
      } else if (response.status === 403) {
        alert("Only super admins can manage admin roles")
        router.push("/admin")
      }
    } catch (error) {
      console.error("Error fetching admins:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!confirm(`Are you sure you want to change this admin's role to ${roleInfo[newRole as keyof typeof roleInfo].label}?`)) {
      return
    }

    setUpdating(userId)
    try {
      const response = await fetch("/api/admin/roles", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, adminRole: newRole })
      })

      if (response.ok) {
        alert("Admin role updated successfully!")
        fetchAdmins()
      } else {
        const data = await response.json()
        alert(data.error || "Failed to update admin role")
      }
    } catch (error) {
      console.error("Error updating admin role:", error)
      alert("Failed to update admin role")
    } finally {
      setUpdating(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Role Management</h1>
        <p className="text-gray-600">
          Manage admin roles and permissions. Only super admins can access this page.
        </p>
      </div>

      {/* Role Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {Object.entries(roleInfo).map(([role, info]) => {
          const Icon = info.icon
          return (
            <Card key={role}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Icon className={`h-5 w-5 ${info.color}`} />
                  {info.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{info.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Admins List */}
      <Card>
        <CardHeader>
          <CardTitle>All Administrators ({admins.length})</CardTitle>
          <CardDescription>
            View and manage roles for all admin users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {admins.map((admin) => {
              const role = admin.adminRole || 'REGULAR_ADMIN'
              const info = roleInfo[role]
              const Icon = info.icon
              const isCurrentUser = session?.user.id === admin._id

              return (
                <div
                  key={admin._id.toString()}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`p-2 rounded-full ${info.bgColor}`}>
                      <Icon className={`h-5 w-5 ${info.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{admin.name}</h3>
                        {isCurrentUser && (
                          <Badge variant="outline" className="text-xs">
                            You
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{admin.email}</p>
                      <p className="text-xs text-gray-500 mt-1">{info.description}</p>
                    </div>
                  </div>

                  <div className="w-48">
                    <Select
                      value={role}
                      onValueChange={(value) => handleRoleChange(admin._id, value)}
                      disabled={updating === admin._id || isCurrentUser}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SUPER_ADMIN">
                          <div className="flex items-center gap-2">
                            <Crown className="h-4 w-4 text-yellow-600" />
                            Super Admin
                          </div>
                        </SelectItem>
                        <SelectItem value="SENIOR_ADMIN">
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-blue-600" />
                            Senior Admin
                          </div>
                        </SelectItem>
                        <SelectItem value="REGULAR_ADMIN">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-gray-600" />
                            Regular Admin
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {isCurrentUser && (
                      <p className="text-xs text-gray-500 mt-1">
                        Cannot change your own role
                      </p>
                    )}
                  </div>
                </div>
              )
            })}

            {admins.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No administrators found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Permission Matrix */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Permission Matrix</CardTitle>
          <CardDescription>
            Overview of what each admin role can do
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Permission</th>
                  <th className="text-center py-3 px-4">Super Admin</th>
                  <th className="text-center py-3 px-4">Senior Admin</th>
                  <th className="text-center py-3 px-4">Regular Admin</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">Promote/Demote Admins</td>
                  <td className="text-center">✅</td>
                  <td className="text-center">❌</td>
                  <td className="text-center">❌</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">Create/Edit Faculties</td>
                  <td className="text-center">✅</td>
                  <td className="text-center">✅</td>
                  <td className="text-center">❌</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">Create/Edit Departments</td>
                  <td className="text-center">✅</td>
                  <td className="text-center">✅</td>
                  <td className="text-center">❌</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">Create/Edit Programmes</td>
                  <td className="text-center">✅</td>
                  <td className="text-center">✅</td>
                  <td className="text-center">❌</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">Create/Edit Courses</td>
                  <td className="text-center">✅</td>
                  <td className="text-center">✅</td>
                  <td className="text-center">❌</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">View Analytics</td>
                  <td className="text-center">✅</td>
                  <td className="text-center">✅</td>
                  <td className="text-center">✅</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4">View Students</td>
                  <td className="text-center">✅</td>
                  <td className="text-center">✅</td>
                  <td className="text-center">✅</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
