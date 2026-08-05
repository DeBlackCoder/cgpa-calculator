import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import { User, Admin, Student } from "@/models"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { UserPlus, Shield, User as UserIcon } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

async function getUsers() {
  await dbConnect()
  
  const users = await User.find({})
    .sort({ createdAt: -1 })
    .lean()

  // Get admin and student info for each user
  const usersWithRoles = await Promise.all(
    users.map(async (user) => {
      const admin = await Admin.findOne({ userId: user._id }).lean()
      const student = await Student.findOne({ userId: user._id }).lean()
      return {
        ...user,
        admin,
        student
      }
    })
  )

  return usersWithRoles
}

async function getCurrentAdmin(userId: string) {
  await dbConnect()
  const admin = await Admin.findOne({ userId }).lean()
  return admin
}

export default async function UsersManagementPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/dashboard")
  }

  const currentAdmin = await getCurrentAdmin(session.user.id)
  const users = await getUsers()

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">User Management</h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Manage system users and administrators
          </p>
        </div>
        {currentAdmin?.isSuperAdmin && (
          <Link href="/admin/users/create">
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Create User
            </Button>
          </Link>
        )}
      </div>

      {/* Permission Notice */}
      {!currentAdmin?.isSuperAdmin && (
        <Card className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20">
          <CardContent className="p-4">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              ℹ️ You can view users but only super admins can create new admin accounts.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>All Users ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {users.map((user: any) => (
              <div
                key={user._id.toString()}
                className="flex items-center justify-between p-4 rounded-lg border border-zinc-200 dark:border-zinc-800"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{user.name}</p>
                      {user.admin?.isSuperAdmin && (
                        <Badge variant="destructive" className="text-xs">
                          <Shield className="h-3 w-3 mr-1" />
                          Super Admin
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant={user.role === "ADMIN" ? "default" : "secondary"}
                  >
                    {user.role === "ADMIN" ? (
                      <Shield className="h-3 w-3 mr-1" />
                    ) : (
                      <UserIcon className="h-3 w-3 mr-1" />
                    )}
                    {user.role}
                  </Badge>
                  <p className="text-xs text-zinc-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Security Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-start gap-2">
            <span className="text-green-600 dark:text-green-400">✓</span>
            <p>Public registration creates STUDENT accounts only</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-600 dark:text-green-400">✓</span>
            <p>Only admins can create new users through admin panel</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-600 dark:text-green-400">✓</span>
            <p>Only super admins can create admin accounts</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-600 dark:text-green-400">✓</span>
            <p>Super admin status can only be granted by other super admins</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
