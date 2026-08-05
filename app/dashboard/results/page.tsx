import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import { Student, Result, Course, AcademicSession } from "@/models"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Download, Pencil } from "lucide-react"
import Link from "next/link"
import { calculateGPA } from "@/lib/utils"

async function getResults(userId: string) {
  await dbConnect()
  
  const student = await Student.findOne({ userId }).lean()
  
  if (!student) {
    return null
  }

  // Fetch results for this student
  const results = await Result.find({ studentId: student._id })
    .sort({ level: -1, semester: -1, createdAt: -1 })
    .lean()

  // Fetch courses and sessions
  const courseIds = [...new Set(results.map(r => r.courseId))]
  const sessionIds = [...new Set(results.map(r => r.sessionId))]

  const [courses, sessions] = await Promise.all([
    Course.find({ _id: { $in: courseIds } }).lean(),
    AcademicSession.find({ _id: { $in: sessionIds } }).lean()
  ])

  // Create lookup maps
  const courseMap = new Map(courses.map(c => [c._id.toString(), c]))
  const sessionMap = new Map(sessions.map(s => [s._id.toString(), s]))

  // Attach course and session data to results
  const populatedResults = results.map(result => ({
    ...result,
    course: courseMap.get(result.courseId.toString()),
    session: sessionMap.get(result.sessionId.toString())
  }))

  return {
    ...student,
    results: populatedResults
  }
}

export default async function ResultsPage() {
  const session = await getServerSession(authOptions)
  const student = await getResults(session!.user.id)

  if (!student) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-12 text-center">
            <h2 className="text-2xl font-bold mb-4">No Profile Found</h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">
              Please complete your profile first
            </p>
            <Link href="/dashboard/profile/setup">
              <Button>Complete Profile</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Group results by level and semester
  const groupedResults = student.results.reduce((acc, result) => {
    const key = `${result.level}-${result.semester}`
    if (!acc[key]) {
      acc[key] = {
        level: result.level,
        semester: result.semester,
        results: []
      }
    }
    acc[key].results.push(result)
    return acc
  }, {} as Record<string, any>)

  const semesters = Object.values(groupedResults).sort((a, b) => {
    if (b.level !== a.level) return b.level - a.level
    return b.semester - a.semester
  })

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Results</h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            View and manage your academic results
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Link href="/dashboard/results/add">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Result
            </Button>
          </Link>
        </div>
      </div>

      {/* Results by Semester */}
      {semesters.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <h3 className="text-xl font-semibold mb-2">No Results Yet</h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">
              Start by adding your first result
            </p>
            <Link href="/dashboard/results/add">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Result
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        semesters.map((semester) => {
          const semesterGPA = calculateGPA(
            semester.results.map((r: any) => ({
              gradePoint: r.gradePoint,
              creditUnits: r.creditUnits
            }))
          )

          const totalCredits = semester.results.reduce(
            (sum: number, r: any) => sum + r.creditUnits,
            0
          )

          return (
            <Card key={`${semester.level}-${semester.semester}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>
                      {semester.level} Level - Semester {semester.semester}
                    </CardTitle>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                      {semester.results.length} courses • {totalCredits} units
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {semesterGPA.toFixed(2)}
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Semester GPA
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {semester.results.map((result: any) => (
                    <div
                      key={result._id}
                      className="flex items-center justify-between p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium">{result.course.title}</h4>
                        <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                          <span>
                            {result.course.code} • {result.creditUnits} Units
                          </span>
                          {result.course.isElective && (
                            <Badge variant="secondary">
                              Elective
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {result.score.toFixed(1)}%
                          </p>
                          <p className="text-xs text-zinc-500">
                            {result.gradePoint.toFixed(1)} GP
                          </p>
                        </div>
                        <Badge
                          variant={
                            result.grade === "A"
                              ? "success"
                              : result.grade === "F"
                              ? "destructive"
                              : "secondary"
                          }
                          className="w-12 justify-center"
                        >
                          {result.grade}
                        </Badge>
                        <Link href={`/dashboard/results/edit/${result._id}`}>
                          <Button variant="ghost" size="sm">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })
      )}
    </div>
  )
}
