import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Target } from "lucide-react"
import { calculateRequiredGPA } from "@/lib/utils"
import Link from "next/link"

interface PerformanceSummaryProps {
  bestCourses: any[]
  worstCourses: any[]
  cgpa: number
  targetCGPA: number | null
  creditsEarned: number
  totalCredits: number
}

export default function PerformanceSummary({
  bestCourses,
  worstCourses,
  cgpa,
  targetCGPA,
  creditsEarned,
  totalCredits
}: PerformanceSummaryProps) {
  const creditsRemaining = totalCredits - creditsEarned
  const requiredGPA = targetCGPA 
    ? calculateRequiredGPA(cgpa, creditsEarned, targetCGPA, creditsRemaining)
    : null

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Best Performing Courses */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <CardTitle>Best Performing Courses</CardTitle>
          </div>
          <CardDescription>Your top 5 courses by grade</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {bestCourses.map((result, index) => (
              <div
                key={result.id}
                className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900"
              >
                <div className="flex-1">
                  <p className="font-medium text-sm">{result.course.title}</p>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    {result.course.code}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium">{result.score.toFixed(1)}%</p>
                    <p className="text-xs text-zinc-500">{result.gradePoint.toFixed(1)} GP</p>
                  </div>
                  <Badge variant="success">{result.grade}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Courses Needing Improvement */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-orange-600" />
            <CardTitle>Courses Needing Improvement</CardTitle>
          </div>
          <CardDescription>Focus areas for better performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {worstCourses.map((result, index) => (
              <div
                key={result.id}
                className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900"
              >
                <div className="flex-1">
                  <p className="font-medium text-sm">{result.course.title}</p>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    {result.course.code}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium">{result.score.toFixed(1)}%</p>
                    <p className="text-xs text-zinc-500">{result.gradePoint.toFixed(1)} GP</p>
                  </div>
                  <Badge
                    variant={result.grade === "F" ? "destructive" : "warning"}
                  >
                    {result.grade}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Target CGPA Card */}
      {targetCGPA && (
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-600" />
              <CardTitle>Target CGPA Analysis</CardTitle>
            </div>
            <CardDescription>
              What you need to achieve your target of {targetCGPA.toFixed(2)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Current CGPA</p>
                <p className="text-2xl font-bold">{cgpa.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Target CGPA</p>
                <p className="text-2xl font-bold">{targetCGPA.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Required GPA</p>
                <p className={`text-2xl font-bold ${
                  requiredGPA && requiredGPA > 5 
                    ? "text-red-600" 
                    : requiredGPA && requiredGPA > 4
                    ? "text-amber-600"
                    : "text-green-600"
                }`}>
                  {requiredGPA ? requiredGPA.toFixed(2) : "N/A"}
                </p>
              </div>
            </div>
            {requiredGPA && requiredGPA > 5 && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
                <p className="text-sm text-red-800 dark:text-red-200">
                  ⚠️ Your target CGPA may not be achievable with your current performance. 
                  Consider adjusting your target or speaking with an academic advisor.
                </p>
              </div>
            )}
            {requiredGPA && requiredGPA <= 5 && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                  📊 You need an average GPA of <strong>{requiredGPA.toFixed(2)}</strong> in 
                  your remaining {creditsRemaining} credits to reach your target.
                </p>
                <Link href="/dashboard/ai-advisor">
                  <Button size="sm">
                    Get AI Study Plan
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
