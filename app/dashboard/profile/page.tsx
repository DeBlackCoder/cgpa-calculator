import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import Student from "@/models/Student"
import User from "@/models/User"
import Faculty from "@/models/Faculty"
import Department from "@/models/Department"
import Programme from "@/models/Programme"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Mail, Calendar, Book, Target, Award } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

async function getProfile(userId: string) {
  await connectDB()
  
  const user = await User.findById(userId).lean()
  if (!user) {
    return { user: null, student: null }
  }

  const student = await Student.findOne({ userId }).lean()
  
  if (!student) {
    return { user, student: null }
  }

  // Manually populate the related documents
  const [faculty, department, programme] = await Promise.all([
    student.facultyId ? Faculty.findById(student.facultyId).lean() : null,
    student.departmentId ? Department.findById(student.departmentId).lean() : null,
    student.programmeId ? Programme.findById(student.programmeId).lean() : null,
  ])

  return {
    user,
    student: {
      ...student,
      faculty,
      department,
      programme,
    }
  }
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/auth/signin")
  }

  const { user, student } = await getProfile(session.user.id)

  if (!student) {
    redirect("/dashboard/profile/setup")
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">{user?.name}</h1>
          <p className="text-sm sm:text-base text-gray-600">
            {user?.email}
          </p>
        </div>
        <Link href="/dashboard/profile/edit">
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </Link>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm text-gray-600">Full Name</p>
            <p className="font-medium text-sm sm:text-base">{user?.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Email Address</p>
            <p className="font-medium text-sm sm:text-base break-all">{user?.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Matric Number</p>
            <p className="font-medium">
              <code className="bg-gray-100 px-2 py-1 rounded text-sm text-gray-900">
                {student.matricNumber}
              </code>
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Role</p>
            <Badge variant="secondary">{user?.role}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Academic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Book className="h-5 w-5" />
            Academic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm text-gray-600">Faculty</p>
            <p className="font-medium text-sm sm:text-base">
              {student.faculty?.name || "Not set"}
            </p>
            {student.faculty?.code && (
              <p className="text-xs text-gray-500">{student.faculty.code}</p>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-600">Department</p>
            <p className="font-medium text-sm sm:text-base">
              {student.department?.name || "Not set"}
            </p>
            {student.department?.code && (
              <p className="text-xs text-gray-500">{student.department.code}</p>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-600">Programme</p>
            <p className="font-medium text-sm sm:text-base">
              {student.programme?.name || "Not set"}
            </p>
            {student.programme && (
              <p className="text-xs text-gray-500">
                {student.programme.duration} years • {student.programme.totalCredits} credits
              </p>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-600">Current Level</p>
            <Badge variant="secondary" className="text-base">
              {student.level || "Not set"} {student.level && "Level"}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-gray-600">Current Semester</p>
            <p className="font-medium">
              {student.currentSemester ? `Semester ${student.currentSemester}` : "Not set"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Current Session</p>
            <p className="font-medium">{student.currentSession || "Not set"}</p>
          </div>
        </CardContent>
      </Card>

      {/* Academic Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Academic Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-sm text-gray-600">Admission Year</p>
            <p className="font-medium text-lg">{student.admissionYear || "Not set"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Credits Earned</p>
            <p className="font-medium text-lg">
              {student.creditsEarned || 0} / {student.programme?.totalCredits || "—"}
            </p>
            {student.programme?.totalCredits && (
              <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all"
                  style={{
                    width: `${Math.min(
                      ((student.creditsEarned || 0) / student.programme.totalCredits) * 100,
                      100
                    )}%`
                  }}
                />
              </div>
            )}
          </div>
          {student.targetCGPA && (
            <div>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <Target className="h-4 w-4" />
                Target CGPA
              </p>
              <p className="font-medium text-lg">{student.targetCGPA.toFixed(2)}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Account Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm text-gray-600">Account Created</p>
            <p className="font-medium text-sm">
              {new Date(user?.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
              })}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Last Updated</p>
            <p className="font-medium text-sm">
              {new Date(student.updatedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
              })}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
