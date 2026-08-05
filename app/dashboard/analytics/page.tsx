import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import Student from "@/models/Student"
import Result from "@/models/Result"
import Course from "@/models/Course"
import Programme from "@/models/Programme"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Award, AlertTriangle, Sparkles } from "lucide-react"
import { calculateGPA, getClassOfDegree } from "@/lib/utils"
import GPATrendChart from "@/components/analytics/gpa-trend-chart"
import GradeDistribution from "@/components/analytics/grade-distribution"
import PerformanceSummary from "@/components/analytics/performance-summary"

interface ResultWithCourse {
  _id: string
  studentId: string
  courseId: string
  level: number
  semester: number
  grade: string
  gradePoint: number
  creditUnits: number
  course: any | null
}

async function getAnalyticsData(userId: string) {
  await connectDB()

  const student = await Student.findOne({ userId }).lean()
  if (!student) return null

  const results = await Result.find({ studentId: student._id.toString() })
    .sort({ level: 1, semester: 1 })
    .lean()

  const programme = student.programmeId
    ? await Programme.findById(student.programmeId).lean()
    : null

  // Fetch all courses in a single query instead of one query per result (N+1 fix)
  const courseIds = [...new Set(results.map((r) => r.courseId))]
  const courses = await Course.find({ _id: { $in: courseIds } }).lean()
  const courseMap = new Map(courses.map((c) => [c._id.toString(), c]))

  const resultsWithCourses: ResultWithCourse[] = results.map((result) => ({
    ...result,
    course: courseMap.get(result.courseId?.toString()) ?? null
  }))

  return {
    ...student,
    results: resultsWithCourses,
    programme
  }
}

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions)

  // Guard against unauthenticated access instead of crashing on session!.user.id
  if (!session?.user?.id) {
    redirect("/login")
  }

  const student = await getAnalyticsData(session.user.id)

  if (!student || student.results.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Analytics</h1>
        <Card>
          <CardContent className="p-12 text-center">
            <h3 className="text-xl font-semibold mb-2">No Data Available</h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Add some results to see your analytics
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Calculate CGPA
  const cgpa = calculateGPA(
    student.results.map((r) => ({
      gradePoint: r.gradePoint,
      creditUnits: r.creditUnits
    }))
  )

  // Group by semester for trend
  const semesterGroups = student.results.reduce((acc, result) => {
    const key = `${result.level}-${result.semester}`
    if (!acc[key]) {
      acc[key] = {
        level: result.level,
        semester: result.semester,
        results: [] as ResultWithCourse[]
      }
    }
    acc[key].results.push(result)
    return acc
  }, {} as Record<string, { level: number; semester: number; results: ResultWithCourse[] }>)

  const semesterData = Object.values(semesterGroups)
    .sort((a, b) => {
      if (a.level !== b.level) return a.level - b.level
      return a.semester - b.semester
    })
    .map((sem) => {
      const gpa = calculateGPA(
        sem.results.map((r) => ({
          gradePoint: r.gradePoint,
          creditUnits: r.creditUnits
        }))
      )
      return {
        name: `${sem.level}L S${sem.semester}`,
        level: sem.level,
        semester: sem.semester,
        gpa: parseFloat(gpa.toFixed(2)),
        courses: sem.results.length
      }
    })

  // Grade distribution
  const gradeDistribution = student.results.reduce((acc, result) => {
    acc[result.grade] = (acc[result.grade] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const gradeData = Object.entries(gradeDistribution).map(([grade, count]) => ({
    grade,
    count,
    percentage: ((count / student.results.length) * 100).toFixed(1)
  }))

  // Performance insights
  const latestSemester = semesterData[semesterData.length - 1]
  const previousSemester = semesterData[semesterData.length - 2]
  const trend = previousSemester
    ? latestSemester.gpa - previousSemester.gpa
    : 0

  // Best and worst courses
  const sortedResults = [...student.results].sort((a, b) => b.gradePoint - a.gradePoint)
  const bestCourses = sortedResults.slice(0, 5)
  const worstCourses = sortedResults.slice(-5).reverse()

  // Calculate progress — guard against a missing/deleted programme
  const totalCredits = student.programme?.totalCredits ?? 0
  const creditsRemaining = totalCredits > 0 ? totalCredits - student.creditsEarned : 0
  const progressPercentage = totalCredits > 0 ? (student.creditsEarned / totalCredits) * 100 : 0

  // Generate AI Insights based on performance
  const aiInsights = generateAIInsights({
    cgpa,
    latestGPA: latestSemester.gpa,
    previousGPA: previousSemester?.gpa,
    trend,
    bestCourses,
    worstCourses,
    totalCourses: student.results.length,
    failedCourses: gradeDistribution.F || 0,
    progressPercentage,
    targetCGPA: student.targetCGPA
  })

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Academic Analytics</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Detailed insights into your academic performance
        </p>
      </div>

      {!student.programme && (
        <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20">
          <CardContent className="p-4 text-sm text-red-800 dark:text-red-200">
            We couldn't find your programme record, so progress and credit totals may be
            unavailable. Please contact support.
          </CardContent>
        </Card>
      )}

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current CGPA</CardTitle>
            <Award className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{cgpa.toFixed(2)}</div>
            <p className="text-xs text-zinc-500 mt-1">{getClassOfDegree(cgpa)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latest GPA</CardTitle>
            {trend > 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : trend < 0 ? (
              <TrendingDown className="h-4 w-4 text-red-600" />
            ) : (
              <TrendingUp className="h-4 w-4 text-zinc-400" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{latestSemester.gpa.toFixed(2)}</div>
            <p className={`text-xs mt-1 ${trend > 0 ? "text-green-600" : trend < 0 ? "text-red-600" : "text-zinc-500"}`}>
              {trend > 0 ? "+" : ""}{trend.toFixed(2)} from last semester
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{student.results.length}</div>
            <p className="text-xs text-zinc-500 mt-1">
              {gradeDistribution.F || 0} failed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{progressPercentage.toFixed(0)}%</div>
            <p className="text-xs text-zinc-500 mt-1">
              {creditsRemaining} credits remaining
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <GPATrendChart data={semesterData} />
        <GradeDistribution data={gradeData} />
      </div>

      {/* Performance Summary */}
      <PerformanceSummary
        bestCourses={bestCourses}
        worstCourses={worstCourses}
        cgpa={cgpa}
        targetCGPA={student.targetCGPA ?? null}
        creditsEarned={student.creditsEarned}
        totalCredits={totalCredits}
      />

      {/* AI Insights */}
      <Card className="border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <CardTitle className="text-blue-900 dark:text-blue-100">
              AI Performance Insights
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {aiInsights.map((insight, index) => (
            <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-white/60 dark:bg-zinc-900/60">
              <div className={`mt-0.5 h-2 w-2 rounded-full flex-shrink-0 ${
                insight.type === 'success' ? 'bg-green-500' :
                insight.type === 'warning' ? 'bg-amber-500' :
                insight.type === 'info' ? 'bg-blue-500' :
                'bg-red-500'
              }`} />
              <p className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed">
                {insight.message}
              </p>
            </div>
          ))}
          <div className="pt-2 border-t border-blue-200 dark:border-blue-800">
            <p className="text-xs text-blue-700 dark:text-blue-300 italic">
              💡 These insights are automatically generated based on your academic performance. 
              Visit the AI Advisor for personalized guidance and strategies.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Warnings */}
      {cgpa < 2.0 && (
        <Card className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <CardTitle className="text-amber-900 dark:text-amber-100">
                Academic Probation Warning
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-amber-800 dark:text-amber-200">
              Your CGPA is below 2.0. You may be at risk of academic probation.
              Consider speaking with your academic advisor and using the AI advisor
              for personalized improvement strategies.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}


// Generate AI insights based on performance data
function generateAIInsights(data: {
  cgpa: number
  latestGPA: number
  previousGPA?: number
  trend: number
  bestCourses: any[]
  worstCourses: any[]
  totalCourses: number
  failedCourses: number
  progressPercentage: number
  targetCGPA?: number
}): Array<{ type: 'success' | 'warning' | 'danger' | 'info'; message: string }> {
  const insights: Array<{ type: 'success' | 'warning' | 'danger' | 'info'; message: string }> = []

  // Overall performance
  if (data.cgpa >= 4.5) {
    insights.push({
      type: 'success',
      message: `🌟 Excellent! Your CGPA of ${data.cgpa.toFixed(2)} puts you in First Class honors territory. You're on track for outstanding academic achievement. Keep up this exceptional performance!`
    })
  } else if (data.cgpa >= 3.5) {
    insights.push({
      type: 'success',
      message: `🎯 Great work! With a ${data.cgpa.toFixed(2)} CGPA, you're in Second Class Upper division. You're doing well and have the potential to reach First Class with consistent effort.`
    })
  } else if (data.cgpa >= 2.4) {
    insights.push({
      type: 'info',
      message: `📚 You're currently at ${data.cgpa.toFixed(2)} CGPA (Second Class Lower). There's significant room for improvement. Focus on strengthening your weak areas to move up to Second Class Upper.`
    })
  } else if (data.cgpa >= 2.0) {
    insights.push({
      type: 'warning',
      message: `⚠️ Your CGPA of ${data.cgpa.toFixed(2)} is approaching the probation threshold. It's crucial to improve your performance immediately. Consider seeking academic support and adjusting your study strategies.`
    })
  } else {
    insights.push({
      type: 'danger',
      message: `🚨 Critical: Your CGPA of ${data.cgpa.toFixed(2)} is below 2.0, placing you at risk of academic probation. Immediate intervention is needed - speak with your academic advisor and utilize all available support resources.`
    })
  }

  // Trend analysis
  if (data.previousGPA) {
    if (data.trend > 0.3) {
      insights.push({
        type: 'success',
        message: `📈 Impressive improvement! Your GPA increased by ${data.trend.toFixed(2)} points from last semester. Whatever you're doing differently is working - maintain these effective study habits!`
      })
    } else if (data.trend > 0) {
      insights.push({
        type: 'success',
        message: `✨ Positive trend detected! You improved by ${data.trend.toFixed(2)} points. Small consistent gains lead to significant results. Keep building on this momentum!`
      })
    } else if (data.trend < -0.3) {
      insights.push({
        type: 'warning',
        message: `📉 Concerning drop: Your GPA decreased by ${Math.abs(data.trend).toFixed(2)} points. Identify what changed and address it promptly. Consider reviewing your time management and study techniques.`
      })
    } else if (data.trend < 0) {
      insights.push({
        type: 'info',
        message: `⚡ Slight decline of ${Math.abs(data.trend).toFixed(2)} points noted. Monitor this trend carefully and take action to reverse it in the next semester.`
      })
    }
  }

  // Failed courses
  if (data.failedCourses > 0) {
    insights.push({
      type: 'danger',
      message: `❌ You have ${data.failedCourses} failed course${data.failedCourses > 1 ? 's' : ''}. These significantly impact your CGPA. Prioritize retaking these courses and seek help from tutors or study groups for challenging subjects.`
    })
  }

  // Worst performing courses
  if (data.worstCourses.length > 0 && data.worstCourses[0].gradePoint < 3.0) {
    const weakCourse = data.worstCourses[0]
    insights.push({
      type: 'warning',
      message: `🎓 Your weakest area appears to be ${weakCourse.course?.code || 'certain courses'} with a ${weakCourse.grade} grade. Consider forming a study group, attending extra tutorials, or seeking one-on-one help for similar subjects.`
    })
  }

  // Target CGPA analysis
  if (data.targetCGPA && data.targetCGPA > data.cgpa) {
    const gap = data.targetCGPA - data.cgpa
    if (gap > 1.0) {
      insights.push({
        type: 'info',
        message: `🎯 Your target CGPA of ${data.targetCGPA.toFixed(2)} is ${gap.toFixed(2)} points away. This is an ambitious goal requiring significant improvement. Break it down: aim for consistent 4.5+ GPAs in upcoming semesters and consider retaking low-grade courses.`
      })
    } else if (gap > 0.5) {
      insights.push({
        type: 'info',
        message: `🎯 You're ${gap.toFixed(2)} points from your target CGPA of ${data.targetCGPA.toFixed(2)}. This is achievable! Focus on maintaining GPAs above ${(data.targetCGPA + 0.3).toFixed(2)} in remaining semesters, and prioritize high-credit courses.`
      })
    } else {
      insights.push({
        type: 'success',
        message: `🎯 Great news! You're only ${gap.toFixed(2)} points away from your target CGPA of ${data.targetCGPA.toFixed(2)}. You're very close - maintain your current performance and you'll reach your goal!`
      })
    }
  }

  // Progress analysis
  if (data.progressPercentage > 75) {
    insights.push({
      type: 'info',
      message: `🏁 You're ${data.progressPercentage.toFixed(0)}% through your programme! Final stretch ahead. Your remaining courses have extra weight on your final CGPA - make each one count for maximum impact.`
    })
  } else if (data.progressPercentage > 50) {
    insights.push({
      type: 'info',
      message: `⏰ You're past the halfway point (${data.progressPercentage.toFixed(0)}% complete). This is a critical period - strong performance now can significantly boost your final CGPA.`
    })
  }

  // Best performance recognition
  if (data.bestCourses.length > 0 && data.bestCourses[0].grade === 'A') {
    const excellentCount = data.bestCourses.filter(c => c.grade === 'A').length
    if (excellentCount >= 3) {
      insights.push({
        type: 'success',
        message: `🌟 Outstanding! You've achieved ${excellentCount} A grades. This demonstrates your capability for excellence. Apply the same strategies that worked in these courses to other subjects.`
      })
    }
  }

  return insights
}
