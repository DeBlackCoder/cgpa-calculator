"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Shield, User } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function CreateUserPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "STUDENT",
    isSuperAdmin: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          isSuperAdmin: formData.role === "ADMIN" ? formData.isSuperAdmin : false
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create user")
      }

      toast.success(data.message || "User created successfully")
      router.push("/admin/users")
    } catch (error: any) {
      toast.error(error.message || "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/admin/users">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Users
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New User</CardTitle>
          <CardDescription>
            Add a new student or administrator account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Security Note:</strong> Only super admins can create admin accounts.
              Regular admins can only create student accounts.
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@university.edu"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">User Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value })}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STUDENT">
                    👨‍🎓 Student - Can manage their academic records
                  </SelectItem>
                  <SelectItem value="ADMIN">
                    👨‍💼 Administrator - Can manage system and students
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.role === "ADMIN" && (
              <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg space-y-3">
                <Label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isSuperAdmin}
                    onChange={(e) => setFormData({ ...formData, isSuperAdmin: e.target.checked })}
                    disabled={isLoading}
                    className="rounded"
                  />
                  <Shield className="h-4 w-4 text-amber-600" />
                  <span>Grant Super Admin privileges</span>
                </Label>
                <p className="text-sm text-gray-600 ml-6">
                  Super Admins can create other admins and super admins.
                  Regular admins can only create student accounts.
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                disabled={isLoading}
                minLength={6}
              />
              <p className="text-xs text-gray-500">Minimum 6 characters</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>

            {/* Summary */}
            <div className="p-4 bg-gray-50 rounded-lg space-y-2">
              <h4 className="font-medium text-sm">Summary</h4>
              <div className="text-sm space-y-1">
                <p>
                  <span className="text-gray-600">Creating:</span>{" "}
                  <strong>{formData.role}</strong> account
                </p>
                {formData.role === "ADMIN" && formData.isSuperAdmin && (
                  <p className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    With Super Admin privileges
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? "Creating User..." : "Create User"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
