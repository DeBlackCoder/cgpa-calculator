import connectDB from "@/lib/mongodb"
import Student from "@/models/Student"
import Department from "@/models/Department"
import Course from "@/models/Course"
import Faculty from "@/models/Faculty"
import Result from "@/models/Result"
import User from "@/models/User"
import Programme from "@/models/Programme"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Building2, BookOpen, TrendingUp, AlertTriangle, Award } from "lucide-react"
import { calculateGPA } from "@/lib/utils"

async function getAdminStats() {
  await connectDB()
  
  const [
    totalStudents,
    totalDepartments,
    totalCourses,
    totalFaculties,
    students,
    allResults
  ] = await Promise.all([
    Student.countDocuments(),
    Department.countDocuments(),
    Course.countDocuments(),
    Faculty.countDocuments(),
    Student.find({}).lean(),
    Result.find({}).lean()
  ])

  // Get all student results grouped by student
  const studentResults = new Map()
  for (const result of allResults) {
    const studentId = result.studentId
    if (!studentResults.has(studentId)) {
      studentResults.set(studentId, [])
    }
    studentResults.get(studentId).push(result)
  }

  // Calculate statistics for students
  const studentsWithStats = await Promise.all(
    students.map(async (student) => {
      const user = await User.findById(student.userId).lean()
      const department = await Department.findById(student.departmentId).lean()
      const results = studentResults.get(student._id.toString()) || []
      
      const cgpa = results.length > 0 ? calculateGPA(
        results.map((r: any) => ({
          gradePoint: r.gradePoint,
          creditUnits: r.creditUnits
        }))
      ) : 0
      
      return {
        student,
        user,
        department,
        cgpa,
        hasResults: results.length > 0
      }
    })
  )

  const studentsOnProbation = studentsWithStats.filter(s => s.cgpa > 0 && s.cgpa < 2.0).length

  const topPerformers = studentsWithStats
    .filter(s => s.hasResults)
    .sort((a, b) => b.cgpa - a.cgpa)
    .slice(0, 10)

  const passRate = allResults.length > 0
    ? (allResults.filter((r: any) => r.grade !== "F").length / allResults.length) * 100
    : 0

  // Get recent results with populated data
  const recentResultsData = await Promise.all(
    allResults.slice(-10).reverse().map(async (result) => {
      const student = students.find(s => s._id.toString() === result.studentId)
      const user = student ? await User.findById(student.userId).lean() : null
      const course = await Course.findById(result.courseId).lean()
      
      return {
        ...result,
        student: student ? { ...student, user } : null,
        course
      }
    })
  )

  return {
    totalStudents,
    totalDepartments,
    totalCourses,
    totalFaculties,
    studentsOnProbation,
    topPerformers,
    passRate,
    recentResults: recentResultsData.filter(r => r.student && r.course)
  }
}

export default async function AdminDashboardPage() {
  const stats = await getAdminStats()

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Overview of the academic management system
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-zinc-500 mt-1">Registered students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Building2 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalDepartments}</div>
            <p className="text-xs text-zinc-500 mt-1">Across {stats.totalFaculties} faculties</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalCourses}</div>
            <p className="text-xs text-zinc-500 mt-1">Available courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.passRate.toFixed(1)}%</div>
            <p className="text-xs text-zinc-500 mt-1">Overall performance</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Performers */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-600" />
              <CardTitle>Top Performers</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.topPerformers.length === 0 ? (
                <p className="text-sm text-zinc-500 text-center py-8">
                  No student data available yet
                </p>
              ) : (
                stats.topPerformers.map(({ student, user, department, cgpa }, index) => (
                  <div
                    key={student._id.toString()}
                    className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{user?.name || 'Unknown'}</p>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400">
                          {student.matricNumber} • {department?.name || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                      {cgpa.toFixed(2)}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Students on Probation */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <CardTitle>Students on Probation</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="text-5xl font-bold text-red-600 mb-2">
                {stats.studentsOnProbation}
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Students with CGPA below 2.0 need attention
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Results</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recentResults.length === 0 ? (
            <p className="text-sm text-zinc-500 text-center py-8">
              No results recorded yet
            </p>
          ) : (
            <div className="space-y-3">
              {stats.recentResults.map((result: any) => (
                <div
                  key={result._id.toString()}
                  className="flex items-center justify-between p-3 rounded-lg border border-zinc-200 dark:border-zinc-800"
                >
                  <div>
                    <p className="font-medium text-sm">{result.student?.user?.name || 'Unknown'}</p>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                      {result.course?.code || 'N/A'} - {result.course?.title || 'Unknown Course'}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">{result.score.toFixed(1)}%</p>
                      <p className="text-xs text-zinc-500">{result.level}L S{result.semester}</p>
                    </div>
                    <Badge
                      variant={
                        result.grade === "A"
                          ? "secondary"
                          : result.grade === "F"
                          ? "destructive"
                          : "secondary"
                      }
                      className={
                        result.grade === "A"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                          : ""
                      }
                    >
                      {result.grade}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
