import connectDB from "@/lib/mongodb"
import Student from "@/models/Student"
import Result from "@/models/Result"
import Department from "@/models/Department"
import Faculty from "@/models/Faculty"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, Users, Award, AlertTriangle } from "lucide-react"
import { calculateGPA, getClassOfDegree } from "@/lib/utils"

async function getAnalytics() {
  await connectDB()

  const [students, results, departments, faculties] = await Promise.all([
    Student.find({}).lean(),
    Result.find({}).lean(),
    Department.find({}).lean(),
    Faculty.find({}).lean()
  ])

  // Group results by student
  const studentResults = new Map()
  results.forEach(result => {
    const studentId = result.studentId
    if (!studentResults.has(studentId)) {
      studentResults.set(studentId, [])
    }
    studentResults.get(studentId).push(result)
  })

  // Calculate CGPA for each student
  const studentsWithCGPA = students.map(student => {
    const studentResultsList = studentResults.get(student._id.toString()) || []
    const cgpa = studentResultsList.length > 0
      ? calculateGPA(studentResultsList.map((r: any) => ({
          gradePoint: r.gradePoint,
          creditUnits: r.creditUnits
        })))
      : 0

    return { ...student, cgpa, resultsCount: studentResultsList.length }
  })

  // CGPA Distribution
  const cgpaDistribution = {
    firstClass: studentsWithCGPA.filter(s => s.cgpa >= 4.5).length,
    secondUpper: studentsWithCGPA.filter(s => s.cgpa >= 3.5 && s.cgpa < 4.5).length,
    secondLower: studentsWithCGPA.filter(s => s.cgpa >= 2.5 && s.cgpa < 3.5).length,
    thirdClass: studentsWithCGPA.filter(s => s.cgpa >= 1.5 && s.cgpa < 2.5).length,
    pass: studentsWithCGPA.filter(s => s.cgpa > 0 && s.cgpa < 1.5).length,
    noResults: studentsWithCGPA.filter(s => s.cgpa === 0).length
  }

  // Grade Distribution
  const gradeDistribution = {
    A: results.filter(r => r.grade === 'A').length,
    B: results.filter(r => r.grade === 'B').length,
    C: results.filter(r => r.grade === 'C').length,
    D: results.filter(r => r.grade === 'D').length,
    E: results.filter(r => r.grade === 'E').length,
    F: results.filter(r => r.grade === 'F').length
  }

  // Department Performance
  const departmentStats = await Promise.all(
    departments.map(async (dept) => {
      const deptStudents = studentsWithCGPA.filter(
        s => s.departmentId === dept._id.toString()
      )
      const avgCGPA = deptStudents.length > 0
        ? deptStudents.reduce((sum, s) => sum + s.cgpa, 0) / deptStudents.length
        : 0

      return {
        name: dept.name,
        code: dept.code,
        studentCount: deptStudents.length,
        avgCGPA
      }
    })
  )

  // Overall Statistics
  const totalResults = results.length
  const passedResults = results.filter(r => r.grade !== 'F').length
  const passRate = totalResults > 0 ? (passedResults / totalResults) * 100 : 0

  const studentsWithResults = studentsWithCGPA.filter(s => s.resultsCount > 0)
  const avgCGPA = studentsWithResults.length > 0
    ? studentsWithResults.reduce((sum, s) => sum + s.cgpa, 0) / studentsWithResults.length
    : 0

  const studentsOnProbation = studentsWithCGPA.filter(s => s.cgpa > 0 && s.cgpa < 2.0).length

  return {
    cgpaDistribution,
    gradeDistribution,
    departmentStats: departmentStats.sort((a, b) => b.avgCGPA - a.avgCGPA),
    overallStats: {
      totalStudents: students.length,
      studentsWithResults: studentsWithResults.length,
      avgCGPA,
      passRate,
      studentsOnProbation,
      totalResults
    }
  }
}

export default async function AdminAnalyticsPage() {
  const analytics = await getAnalytics()

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">System Analytics</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Comprehensive analysis of academic performance
        </p>
      </div>

      {/* Overall Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.overallStats.totalStudents}</div>
            <p className="text-xs text-zinc-500 mt-1">
              {analytics.overallStats.studentsWithResults} with results
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average CGPA</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {analytics.overallStats.avgCGPA.toFixed(2)}
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              {getClassOfDegree(analytics.overallStats.avgCGPA)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
            <Award className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {analytics.overallStats.passRate.toFixed(1)}%
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              Across {analytics.overallStats.totalResults} results
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Probation</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {analytics.overallStats.studentsOnProbation}
            </div>
            <p className="text-xs text-zinc-500 mt-1">CGPA below 2.0</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* CGPA Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              CGPA Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">First Class (4.5+)</span>
                  <span className="text-sm font-semibold">
                    {analytics.cgpaDistribution.firstClass}
                  </span>
                </div>
                <div className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-600"
                    style={{
                      width: `${(analytics.cgpaDistribution.firstClass / analytics.overallStats.totalStudents) * 100}%`
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Second Upper (3.5-4.49)</span>
                  <span className="text-sm font-semibold">
                    {analytics.cgpaDistribution.secondUpper}
                  </span>
                </div>
                <div className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600"
                    style={{
                      width: `${(analytics.cgpaDistribution.secondUpper / analytics.overallStats.totalStudents) * 100}%`
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Second Lower (2.5-3.49)</span>
                  <span className="text-sm font-semibold">
                    {analytics.cgpaDistribution.secondLower}
                  </span>
                </div>
                <div className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-600"
                    style={{
                      width: `${(analytics.cgpaDistribution.secondLower / analytics.overallStats.totalStudents) * 100}%`
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Third Class (1.5-2.49)</span>
                  <span className="text-sm font-semibold">
                    {analytics.cgpaDistribution.thirdClass}
                  </span>
                </div>
                <div className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-600"
                    style={{
                      width: `${(analytics.cgpaDistribution.thirdClass / analytics.overallStats.totalStudents) * 100}%`
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Pass (&lt;1.5)</span>
                  <span className="text-sm font-semibold">
                    {analytics.cgpaDistribution.pass}
                  </span>
                </div>
                <div className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-600"
                    style={{
                      width: `${(analytics.cgpaDistribution.pass / analytics.overallStats.totalStudents) * 100}%`
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-zinc-500">No Results Yet</span>
                  <span className="text-sm font-semibold text-zinc-500">
                    {analytics.cgpaDistribution.noResults}
                  </span>
                </div>
                <div className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-zinc-400"
                    style={{
                      width: `${(analytics.cgpaDistribution.noResults / analytics.overallStats.totalStudents) * 100}%`
                    }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grade Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Grade Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(analytics.gradeDistribution).map(([grade, count]) => (
                <div key={grade}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Grade {grade}</span>
                    <span className="text-sm font-semibold">{count}</span>
                  </div>
                  <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        grade === 'A' ? 'bg-green-600' :
                        grade === 'B' ? 'bg-blue-600' :
                        grade === 'C' ? 'bg-yellow-600' :
                        grade === 'D' ? 'bg-orange-600' :
                        grade === 'E' ? 'bg-red-400' :
                        'bg-red-600'
                      }`}
                      style={{
                        width: `${(count / analytics.overallStats.totalResults) * 100}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Department Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.departmentStats.map((dept, index) => (
              <div
                key={dept.code}
                className="flex items-center justify-between p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    #{index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{dept.name}</p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {dept.studentCount} students • {dept.code}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{dept.avgCGPA.toFixed(2)}</p>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    Avg CGPA
                  </p>
                </div>
              </div>
            ))}
            {analytics.departmentStats.length === 0 && (
              <p className="text-center text-zinc-500 py-8">
                No department data available
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
