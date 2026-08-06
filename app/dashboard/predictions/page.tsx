import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import Student from "@/models/Student"
import Result from "@/models/Result"
import AIPredictionHistory from "@/models/AIPredictionHistory"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Brain, TrendingUp, AlertTriangle, Target, Lightbulb, Calendar, CheckCircle2, XCircle } from "lucide-react"
import { calculateGPA } from "@/lib/utils"
import { generateAIPredictions } from "@/lib/ai-predictions"
import Link from "next/link"

async function getStudentPredictions(userId: string) {
  await connectDB()

  const student = await Student.findOne({ userId }).lean()
  if (!student) return null

  const results = await Result.find({ studentId: student._id.toString() })
    .sort({ level: 1, semester: 1 })
    .lean()

  if (results.length === 0) return null

  // Group by semester to get semester GPAs
  const semesterMap = new Map()
  results.forEach(result => {
    const key = `${result.level}-${result.semester}`
    if (!semesterMap.has(key)) {
      semesterMap.set(key, [])
    }
    semesterMap.get(key).push(result)
  })

  const semesterGPAs = Array.from(semesterMap.values()).map(semResults =>
    calculateGPA(semResults.map((r: any) => ({
      gradePoint: r.gradePoint,
      creditUnits: r.creditUnits
    })))
  )

  const currentCGPA = calculateGPA(results.map((r: any) => ({
    gradePoint: r.gradePoint,
    creditUnits: r.creditUnits
  })))

  const failedCourses = results.filter(r => r.grade === 'F').length

  const predictions = generateAIPredictions({
    currentCGPA,
    creditsEarned: student.creditsEarned || 0,
    totalCreditsRequired: 120,
    semesterGPAs,
    failedCourses,
    level: student.level || 100,
    targetCGPA: student.targetCGPA || undefined,
    results: results.map(r => ({
      gradePoint: r.gradePoint,
      creditUnits: r.creditUnits,
      semester: r.semester,
      level: r.level
    }))
  })

  // Save prediction to database for backtracking
  try {
    await AIPredictionHistory.create({
      studentId: student._id.toString(),
      currentCGPA,
      creditsEarned: student.creditsEarned || 0,
      predictedFinalCGPA: predictions.predictedFinalCGPA,
      riskLevel: predictions.riskLevel,
      confidenceLevel: predictions.confidenceLevel,
      projections: predictions.projections,
      riskFactors: predictions.riskFactors,
      recommendations: predictions.recommendations,
      milestones: predictions.milestones,
      metadata: {
        semesterCount: semesterGPAs.length,
        failedCourses,
        level: student.level || 100,
        targetCGPA: student.targetCGPA
      }
    })
  } catch (error) {
    console.error("Failed to save prediction history:", error)
    // Continue even if save fails
  }

  return { student, predictions, currentCGPA }
}

export default async function PredictionsPage() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect("/auth/signin")
  }

  const data = await getStudentPredictions(session.user.id)

  if (!data) {
    return (
      <div className="p-4 sm:p-6 max-w-4xl mx-auto">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Brain className="h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Data Available</h2>
            <p className="text-gray-600 text-center mb-6">
              Add your course results to get AI-powered predictions and recommendations.
            </p>
            <Link href="/dashboard/results/add">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Add Results
              </button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { predictions, currentCGPA } = data

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800'
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800'
      case 'critical': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
      default: return 'bg-zinc-100 text-zinc-700 border-zinc-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive'
      case 'high': return 'secondary'
      case 'medium': return 'secondary'
      case 'low': return 'secondary'
      default: return 'secondary'
    }
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
          <Brain className="h-8 w-8" />
          AI Predictions & Recommendations
        </h1>
        <p className="text-sm text-gray-600">
          Data-driven insights for your academic success
        </p>
      </div>

      {/* Risk Assessment */}
      <Card className={`border-2 ${getRiskColor(predictions.riskLevel)}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Risk Assessment: {predictions.riskLevel.toUpperCase()}
          </CardTitle>
          <CardDescription>
            Confidence Level: <Badge variant="secondary">{predictions.confidenceLevel}</Badge>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="font-semibold mb-3">Risk Factors:</p>
            <ul className="space-y-2">
              {predictions.riskFactors.map((factor, index) => (
                <li key={index} className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{factor}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* CGPA Projections */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Future CGPA Projections
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
              <p className="text-sm text-gray-600 mb-1">Optimistic</p>
              <p className="text-3xl font-bold text-green-700 dark:text-green-400">
                {predictions.projections.optimistic.toFixed(2)}
              </p>
              <p className="text-xs mt-1">With excellent performance</p>
            </div>
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500">
              <p className="text-sm text-gray-600 mb-1">Realistic</p>
              <p className="text-3xl font-bold text-blue-700 dark:text-blue-400">
                {predictions.projections.realistic.toFixed(2)}
              </p>
              <p className="text-xs mt-1">Based on current trend</p>
            </div>
            <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20">
              <p className="text-sm text-gray-600 mb-1">Pessimistic</p>
              <p className="text-3xl font-bold text-orange-700 dark:text-orange-400">
                {predictions.projections.pessimistic.toFixed(2)}
              </p>
              <p className="text-xs mt-1">If performance declines</p>
            </div>
          </div>

          <Alert>
            <Target className="h-4 w-4" />
            <AlertDescription>
              <strong>Predicted Final CGPA: {predictions.predictedFinalCGPA.toFixed(2)}</strong>
              <br />
              <span className="text-sm">
                This prediction is based on your current performance trend and assumes you maintain similar effort levels.
              </span>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Personalized Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Personalized Recommendations
          </CardTitle>
          <CardDescription>
            Action items to improve your academic performance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {predictions.recommendations.map((rec, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{rec.title}</h4>
                    <Badge variant={getPriorityColor(rec.priority)} className={
                      rec.priority === 'urgent' ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' : ''
                    }>
                      {rec.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {rec.description}
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Action Steps:</p>
                    <ul className="space-y-1">
                      {rec.actionItems.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Semester Milestones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Semester Milestones
          </CardTitle>
          <CardDescription>
            Target GPAs for upcoming semesters to reach your goal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {predictions.milestones.map((milestone) => (
              <div
                key={milestone.semester}
                className={`p-4 rounded-lg border-2 ${
                  milestone.achievable
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {milestone.achievable ? (
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-600" />
                    )}
                    <div>
                      <p className="font-semibold">Semester {milestone.semester}</p>
                      <p className="text-sm text-gray-600">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{milestone.targetGPA.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">Target GPA</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Alert>
        <Brain className="h-4 w-4" />
        <AlertDescription className="text-xs">
          <strong>Note:</strong> These predictions are generated using statistical analysis of your academic performance.
          They are estimates meant to guide your academic planning and should be used alongside advice from your academic advisors.
          Your actual results may vary based on effort, course difficulty, and other factors.
        </AlertDescription>
      </Alert>
    </div>
  )
}
