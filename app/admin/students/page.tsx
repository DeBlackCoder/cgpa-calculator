import connectDB from "@/lib/mongodb"
import Student from "@/models/Student"
import User from "@/models/User"
import Department from "@/models/Department"
import Programme from "@/models/Programme"
import Faculty from "@/models/Faculty"
import Result from "@/models/Result"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Download, Filter } from "lucide-react"
import Link from "next/link"
import { calculateGPA, getClassOfDegree } from "@/lib/utils"

async function getStudents() {
  await connectDB()
  
  const students = await Student.find({}).sort({ createdAt: -1 }).lean()

  // Manually fetch related data for each student
  const studentsWithData = await Promise.all(
    students.map(async (student) => {
      const [user, department, programme, faculty, results] = await Promise.all([
        User.findById(student.userId).lean(),
        Department.findById(student.departmentId).lean(),
        Programme.findById(student.programmeId).lean(),
        Faculty.findById(student.facultyId).lean(),
        Result.find({ studentId: student._id.toString() }).lean()
      ])

      const cgpa = results && results.length
        ? calculateGPA(
            results.map((r: any) => ({
              gradePoint: r.gradePoint,
              creditUnits: r.creditUnits
            }))
          )
        : 0

      return {
        ...student,
        user,
        department,
        programme,
        faculty,
        results,
        cgpa
      }
    })
  )

  return studentsWithData
}

export default async function StudentsPage() {
  const students = await getStudents()

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Students Management</h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Manage and monitor student records
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                placeholder="Search by name, matric number, or email..."
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Students ({students.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <div className="text-center py-12 text-zinc-500">
              No students registered yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800">
                    <th className="text-left py-3 px-4 text-sm font-medium">Student</th>
                    <th className="text-left py-3 px-4 text-sm font-medium">Matric Number</th>
                    <th className="text-left py-3 px-4 text-sm font-medium">Department</th>
                    <th className="text-left py-3 px-4 text-sm font-medium">Level</th>
                    <th className="text-left py-3 px-4 text-sm font-medium">CGPA</th>
                    <th className="text-left py-3 px-4 text-sm font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student: any) => (
                    <tr
                      key={student._id}
                      className="border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                    >
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{student.user?.name || 'Unknown'}</p>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            {student.user?.email || 'N/A'}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <code className="text-sm bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
                          {student.matricNumber}
                        </code>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm">{student.department?.name || 'N/A'}</p>
                          <p className="text-xs text-zinc-600 dark:text-zinc-400">
                            {student.faculty?.code || 'N/A'}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary">{student.level || 0}L</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-semibold">{student.cgpa.toFixed(2)}</p>
                          <p className="text-xs text-zinc-600 dark:text-zinc-400">
                            {getClassOfDegree(student.cgpa)}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {student.cgpa >= 3.5 ? (
                          <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">Excellent</Badge>
                        ) : student.cgpa >= 2.5 ? (
                          <Badge variant="secondary">Good</Badge>
                        ) : student.cgpa >= 2.0 ? (
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400">Fair</Badge>
                        ) : student.cgpa > 0 ? (
                          <Badge variant="destructive">Probation</Badge>
                        ) : (
                          <Badge variant="secondary">New</Badge>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <Link href={`/admin/students/${student._id}`}>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
