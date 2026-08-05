import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import Student from "@/models/Student"
import Result from "@/models/Result"
import Course from "@/models/Course"
import Programme from "@/models/Programme"
import Department from "@/models/Department"
import Faculty from "@/models/Faculty"
import AIPredictionHistory from "@/models/AIPredictionHistory"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { BookOpen, TrendingUp, Target, Award, ArrowRight, AlertTriangle, Brain } from "lucide-react"
import Link from "next/link"
import { calculateGPA, getClassOfDegree } from "@/lib/utils"

async function getStudentData(userId: string) {
  await connectDB()
  
  const student = await Student.findOne({ userId }).lean()
  if (!student) return null

  const [programme, department, faculty, results] = await Promise.all([
    Programme.findById(student.programmeId).lean(),
    Department.findById(student.departmentId).lean(),
    Faculty.findById(student.facultyId).lean(),
    Result.find({ studentId: student._id.toString() })
      .sort({ createdAt: -1 })
      .lean()
  ])

  // Populate course details for each result
  const resultsWithCourses = await Promise.all(
    results.map(async (result) => {
      const course = await Course.findById(result.courseId).lean()
      return {
        ...result,
        course
      }
    })
  )

  // Get latest AI prediction
  const latestPrediction = await AIPredictionHistory.findOne({
    studentId: student._id.toString()
  })
    .sort({ timestamp: -1 })
    .lean()

  return {
    ...student,
    programme,
    department,
    faculty,
    results: resultsWithCourses,
    latestPrediction
  }
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  const student = await getStudentData(session!.user.id)

  if (!student) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Complete Your Profile</h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">
              Please complete your student profile to access your dashboard
            </p>
            <Link href="/dashboard/profile/setup">
              <Button>Complete Profile</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Calculate CGPA
  const cgpa = student?.results.length 
    ? calculateGPA(student.results.map(r => ({
        gradePoint: r.gradePoint,
        creditUnits: r.creditUnits
      })))
    : null  // Show null if no results yet

  // Calculate current semester GPA
  const currentSemesterResults = student?.results.filter(
    r => r.semester === student.currentSemester && r.level === student.level
  ) || []

  const currentGPA = currentSemesterResults.length
    ? calculateGPA(currentSemesterResults.map(r => ({
        gradePoint: r.gradePoint,
        creditUnits: r.creditUnits
      })))
    : 0

  const classOfDegree = cgpa !== null ? getClassOfDegree(cgpa) : null

  const recentResults = student.results.slice(0, 5)

  // Get risk alert info from latest prediction
  const { latestPrediction } = student
  const showRiskAlert = latestPrediction && (
    latestPrediction.riskLevel === 'high' || 
    latestPrediction.riskLevel === 'critical'
  )

  const getRiskAlertVariant = (level: string) => {
    if (level === 'critical') return 'destructive'
    if (level === 'high') return 'default'
    return 'default'
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome back, {session?.user.name}!</h1>
        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
          Here's your academic performance overview
        </p>
      </div>

      {/* Risk Alert */}
      {showRiskAlert && (
        <Alert variant={getRiskAlertVariant(latestPrediction.riskLevel)} className="border-2">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle className="text-base font-bold">
            {latestPrediction.riskLevel === 'critical' ? 'Critical Risk Alert' : 'High Risk Alert'}
          </AlertTitle>
          <AlertDescription>
            <p className="mb-2">
              Your academic performance indicates {latestPrediction.riskLevel} risk. 
              Predicted final CGPA: <strong>{latestPrediction.predictedFinalCGPA.toFixed(2)}</strong>
            </p>
            <Link href="/dashboard/predictions">
              <Button size="sm" variant="secondary" className="mt-2">
                View Recommendations
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </AlertDescription>
        </Alert>
      )}

      {/* AI Predictions Summary (if available and not high risk) */}
      {latestPrediction && !showRiskAlert && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Brain className="h-8 w-8 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-base">AI Prediction Available</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Predicted Final CGPA: <strong>{latestPrediction.predictedFinalCGPA.toFixed(2)}</strong> • 
                    Risk Level: <Badge variant="secondary" className="ml-2">{latestPrediction.riskLevel}</Badge>
                  </p>
                </div>
              </div>
              <Link href="/dashboard/predictions">
                <Button size="sm">
                  View Details
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Current CGPA</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            {cgpa !== null ? (
              <>
                <div className="text-2xl sm:text-3xl font-bold">{cgpa.toFixed(2)}</div>
                <p className="text-xs text-zinc-500 mt-1">{classOfDegree}</p>
              </>
            ) : (
              <>
                <div className="text-2xl sm:text-3xl font-bold text-zinc-400">--</div>
                <p className="text-xs text-zinc-500 mt-1">No results yet</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Predicted CGPA</CardTitle>
            <Brain className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            {latestPrediction ? (
              <>
                <div className="text-2xl sm:text-3xl font-bold">
                  {latestPrediction.predictedFinalCGPA.toFixed(2)}
                </div>
                <p className="text-xs text-zinc-500 mt-1">AI Prediction</p>
              </>
            ) : (
              <>
                <div className="text-2xl sm:text-3xl font-bold text-zinc-400">--</div>
                <p className="text-xs text-zinc-500 mt-1">Add results first</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Current GPA</CardTitle>
            <Award className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold">{currentGPA.toFixed(2)}</div>
            <p className="text-xs text-zinc-500 mt-1">This semester</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Credits Earned</CardTitle>
            <BookOpen className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold">{student.creditsEarned}</div>
            <p className="text-xs text-zinc-500 mt-1 truncate">of {student.programme?.totalCredits ?? 0} required</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Target CGPA</CardTitle>
            <Target className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold">
              {student.targetCGPA ? student.targetCGPA.toFixed(2) : "N/A"}
            </div>
            <p className="text-xs text-zinc-500 mt-1 truncate">
              {student.targetCGPA && cgpa && cgpa >= student.targetCGPA ? "Target achieved!" : "Keep pushing!"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Academic Info */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Academic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">Matric Number</span>
              <span className="text-sm font-medium">{student.matricNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">Programme</span>
              <span className="text-sm font-medium">{student.programme?.name ?? 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">Department</span>
              <span className="text-sm font-medium">{student.department?.name ?? 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">Level</span>
              <span className="text-sm font-medium">{student.level} Level</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">Current Session</span>
              <span className="text-sm font-medium">{student.currentSession}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/dashboard/results/add">
              <Button className="w-full justify-between" variant="outline">
                Add New Result
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard/analytics">
              <Button className="w-full justify-between" variant="outline">
                View Analytics
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard/ai-advisor">
              <Button className="w-full justify-between" variant="outline">
                Ask AI Advisor
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard/predictions">
              <Button className="w-full justify-between" variant="outline">
                View AI Predictions
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Results */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Results</CardTitle>
          <Link href="/dashboard/results">
            <Button variant="ghost" size="sm">
              View All
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentResults.length === 0 ? (
            <div className="text-center py-12 text-zinc-500">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No results yet. Add your first result to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentResults.map((result) => (
                <div
                  key={result._id.toString()}
                  className="flex items-center justify-between p-4 rounded-lg border border-zinc-200 dark:border-zinc-800"
                >
                  <div className="flex-1">
                    <h4 className="font-medium">{result.course?.title ?? 'Unknown Course'}</h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {result.course?.code ?? 'N/A'} • {result.creditUnits} Units
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">{result.score.toFixed(1)}%</p>
                      <p className="text-xs text-zinc-500">{result.gradePoint.toFixed(1)} GP</p>
                    </div>
                    <Badge
                      variant={
                        result.grade === "A" ? "success" :
                        result.grade === "F" ? "destructive" :
                        "secondary"
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
