"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calculator, TrendingUp, GraduationCap, Target, Award, AlertCircle } from "lucide-react"
import { 
  calculateRequiredGPA, 
  calculateRequiredCourseGrade,
  getScoreFromGradePoint,
  calculateCreditsToGraduation,
  isOnProbation,
  calculateMaxCGPA,
  calculateGraduationYear,
  percentageToGradePoint,
  getClassOfDegree,
  getAcademicStanding
} from "@/lib/utils"

export default function ToolsPage() {
  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
          <Calculator className="h-8 w-8" />
          Academic Tools & Calculators
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Helpful tools to plan your academic journey
        </p>
      </div>

      <Tabs defaultValue="target-gpa" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-6">
          <TabsTrigger value="target-gpa">Target GPA</TabsTrigger>
          <TabsTrigger value="grade-needed">Grade Needed</TabsTrigger>
          <TabsTrigger value="score-converter">Score Converter</TabsTrigger>
          <TabsTrigger value="graduation">Graduation</TabsTrigger>
          <TabsTrigger value="probation">Probation Check</TabsTrigger>
          <TabsTrigger value="max-cgpa">Max CGPA</TabsTrigger>
        </TabsList>

        {/* Target GPA Calculator */}
        <TabsContent value="target-gpa">
          <TargetGPACalculator />
        </TabsContent>

        {/* Grade Needed Calculator */}
        <TabsContent value="grade-needed">
          <GradeNeededCalculator />
        </TabsContent>

        {/* Score Converter */}
        <TabsContent value="score-converter">
          <ScoreConverter />
        </TabsContent>

        {/* Graduation Calculator */}
        <TabsContent value="graduation">
          <GraduationCalculator />
        </TabsContent>

        {/* Probation Check */}
        <TabsContent value="probation">
          <ProbationChecker />
        </TabsContent>

        {/* Max CGPA Calculator */}
        <TabsContent value="max-cgpa">
          <MaxCGPACalculator />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Target GPA Calculator Component
function TargetGPACalculator() {
  const [currentCGPA, setCurrentCGPA] = useState("")
  const [creditsEarned, setCreditsEarned] = useState("")
  const [targetCGPA, setTargetCGPA] = useState("")
  const [creditsRemaining, setCreditsRemaining] = useState("")
  const [result, setResult] = useState<number | null>(null)

  const calculate = () => {
    const required = calculateRequiredGPA(
      parseFloat(currentCGPA),
      parseFloat(creditsEarned),
      parseFloat(targetCGPA),
      parseFloat(creditsRemaining)
    )
    setResult(required)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          What GPA Do I Need?
        </CardTitle>
        <CardDescription>
          Calculate the GPA you need in remaining courses to reach your target CGPA
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Current CGPA</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              max="5"
              placeholder="e.g., 3.5"
              value={currentCGPA}
              onChange={(e) => setCurrentCGPA(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Credits Earned</Label>
            <Input
              type="number"
              placeholder="e.g., 60"
              value={creditsEarned}
              onChange={(e) => setCreditsEarned(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Target CGPA</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              max="5"
              placeholder="e.g., 4.0"
              value={targetCGPA}
              onChange={(e) => setTargetCGPA(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Credits Remaining</Label>
            <Input
              type="number"
              placeholder="e.g., 60"
              value={creditsRemaining}
              onChange={(e) => setCreditsRemaining(e.target.value)}
            />
          </div>
        </div>

        <Button onClick={calculate} className="w-full">
          Calculate Required GPA
        </Button>

        {result !== null && (
          <div className={`p-4 rounded-lg ${result > 5 ? 'bg-red-50 dark:bg-red-900/20' : 'bg-green-50 dark:bg-green-900/20'}`}>
            <p className="font-semibold text-lg mb-2">
              Required GPA: <span className="text-2xl">{result.toFixed(2)}</span>
            </p>
            {result > 5 ? (
              <div className="flex items-start gap-2 text-red-600 dark:text-red-400">
                <AlertCircle className="h-5 w-5 mt-0.5" />
                <div>
                  <p className="font-semibold">Target not achievable</p>
                  <p className="text-sm">Your target CGPA cannot be reached even with perfect grades (5.0) in all remaining courses.</p>
                </div>
              </div>
            ) : result > 4.5 ? (
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                You need mostly <strong>A grades (70%+)</strong> in your remaining courses.
              </p>
            ) : result > 3.5 ? (
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                You need mostly <strong>B grades (60-69%)</strong> in your remaining courses.
              </p>
            ) : (
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Your target is achievable with consistent effort!
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Grade Needed in Specific Course
function GradeNeededCalculator() {
  const [currentCGPA, setCurrentCGPA] = useState("")
  const [creditsEarned, setCreditsEarned] = useState("")
  const [targetGPA, setTargetGPA] = useState("")
  const [courseCredits, setCourseCredits] = useState("")
  const [result, setResult] = useState<any>(null)

  const calculate = () => {
    const needed = calculateRequiredCourseGrade(
      parseFloat(currentCGPA),
      parseFloat(creditsEarned),
      parseFloat(targetGPA),
      parseFloat(courseCredits)
    )
    setResult(needed)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          What Grade Do I Need in This Course?
        </CardTitle>
        <CardDescription>
          Find out what grade you need in a specific course to reach your target
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Current CGPA</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              max="5"
              placeholder="e.g., 3.2"
              value={currentCGPA}
              onChange={(e) => setCurrentCGPA(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Credits Earned</Label>
            <Input
              type="number"
              placeholder="e.g., 40"
              value={creditsEarned}
              onChange={(e) => setCreditsEarned(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Target Semester GPA</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              max="5"
              placeholder="e.g., 4.0"
              value={targetGPA}
              onChange={(e) => setTargetGPA(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Course Credit Units</Label>
            <Input
              type="number"
              placeholder="e.g., 3"
              value={courseCredits}
              onChange={(e) => setCourseCredits(e.target.value)}
            />
          </div>
        </div>

        <Button onClick={calculate} className="w-full">
          Calculate Required Grade
        </Button>

        {result && (
          <div className={`p-4 rounded-lg ${result.possible ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
            <p className="font-semibold text-lg mb-2">
              You need: <span className="text-2xl">Grade {result.grade}</span>
            </p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
              Grade Point: {result.gradePoint.toFixed(2)} / 5.0
            </p>
            {!result.possible && (
              <div className="flex items-start gap-2 text-red-600 dark:text-red-400">
                <AlertCircle className="h-5 w-5 mt-0.5" />
                <p className="text-sm">This target is not achievable with maximum grade (A) in this course alone.</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Score Converter
function ScoreConverter() {
  const [score, setScore] = useState("")
  const [gradePoint, setGradePoint] = useState("")

  const convertScore = (value: string) => {
    setScore(value)
    if (value) {
      const gp = percentageToGradePoint(parseFloat(value))
      setGradePoint(gp.toFixed(1))
    }
  }

  const convertGP = (value: string) => {
    setGradePoint(value)
    if (value) {
      const s = getScoreFromGradePoint(parseFloat(value))
      setScore(s.toString())
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Score ↔ Grade Point Converter
        </CardTitle>
        <CardDescription>
          Convert between percentage scores and grade points
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Percentage Score</Label>
            <Input
              type="number"
              min="0"
              max="100"
              placeholder="e.g., 75"
              value={score}
              onChange={(e) => convertScore(e.target.value)}
            />
            <p className="text-xs text-zinc-500">Enter score (0-100%)</p>
          </div>
          <div className="space-y-2">
            <Label>Grade Point</Label>
            <Input
              type="number"
              step="0.1"
              min="0"
              max="5"
              placeholder="e.g., 5.0"
              value={gradePoint}
              onChange={(e) => convertGP(e.target.value)}
            />
            <p className="text-xs text-zinc-500">Grade point (0.0-5.0)</p>
          </div>
        </div>

        <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
          <h4 className="font-semibold mb-3">Grading Scale:</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>70-100%</span><span className="font-mono">→</span><span>A (5.0)</span></div>
            <div className="flex justify-between"><span>60-69%</span><span className="font-mono">→</span><span>B (4.0)</span></div>
            <div className="flex justify-between"><span>50-59%</span><span className="font-mono">→</span><span>C (3.0)</span></div>
            <div className="flex justify-between"><span>45-49%</span><span className="font-mono">→</span><span>D (2.0)</span></div>
            <div className="flex justify-between"><span>40-44%</span><span className="font-mono">→</span><span>E (1.0)</span></div>
            <div className="flex justify-between"><span>0-39%</span><span className="font-mono">→</span><span>F (0.0)</span></div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Graduation Calculator
function GraduationCalculator() {
  const [creditsEarned, setCreditsEarned] = useState("")
  const [totalCredits, setTotalCredits] = useState("120")
  const [admissionYear, setAdmissionYear] = useState("")
  const [duration, setDuration] = useState("4")
  const [result, setResult] = useState<any>(null)

  const calculate = () => {
    const credits = calculateCreditsToGraduation(
      parseFloat(creditsEarned),
      parseFloat(totalCredits)
    )
    const graduation = calculateGraduationYear(
      parseInt(admissionYear),
      parseInt(duration),
      0
    )
    setResult({ ...credits, ...graduation })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          Graduation Timeline
        </CardTitle>
        <CardDescription>
          Calculate when you'll graduate and credits remaining
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Credits Earned</Label>
            <Input
              type="number"
              placeholder="e.g., 60"
              value={creditsEarned}
              onChange={(e) => setCreditsEarned(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Total Credits Required</Label>
            <Input
              type="number"
              placeholder="e.g., 120"
              value={totalCredits}
              onChange={(e) => setTotalCredits(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Admission Year</Label>
            <Input
              type="number"
              placeholder="e.g., 2020"
              value={admissionYear}
              onChange={(e) => setAdmissionYear(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Programme Duration (years)</Label>
            <Input
              type="number"
              placeholder="e.g., 4"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>
        </div>

        <Button onClick={calculate} className="w-full">
          Calculate Graduation Info
        </Button>

        {result && (
          <div className="space-y-3">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Expected Graduation Year</p>
              <p className="text-3xl font-bold">{result.expectedYear}</p>
              <p className="text-sm mt-1">{result.yearsRemaining} years remaining</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Credits Remaining</p>
                <p className="text-2xl font-bold">{result.remaining}</p>
              </div>
              <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Progress</p>
                <p className="text-2xl font-bold">{result.percentage.toFixed(1)}%</p>
              </div>
            </div>
            <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all"
                style={{ width: `${result.percentage}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Probation Checker
function ProbationChecker() {
  const [cgpa, setCgpa] = useState("")
  const [threshold, setThreshold] = useState("1.5")
  const [result, setResult] = useState<any>(null)

  const check = () => {
    const status = isOnProbation(parseFloat(cgpa), parseFloat(threshold))
    const standing = getAcademicStanding(parseFloat(cgpa))
    const classOf = getClassOfDegree(parseFloat(cgpa))
    setResult({ ...status, standing, classOf })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Academic Standing Check
        </CardTitle>
        <CardDescription>
          Check your academic standing and probation status
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Your CGPA</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              max="5"
              placeholder="e.g., 2.8"
              value={cgpa}
              onChange={(e) => setCgpa(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Probation Threshold</Label>
            <Input
              type="number"
              step="0.01"
              placeholder="e.g., 1.5"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
            />
          </div>
        </div>

        <Button onClick={check} className="w-full">
          Check Status
        </Button>

        {result && (
          <div className="space-y-3">
            <div className={`p-4 rounded-lg ${
              result.onProbation 
                ? 'bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800' 
                : 'bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800'
            }`}>
              <p className="font-semibold text-lg mb-1">
                {result.onProbation ? '⚠️ On Academic Probation' : '✅ Good Academic Standing'}
              </p>
              {result.onProbation && (
                <p className="text-sm">
                  You need to improve your CGPA by {result.pointsNeeded.toFixed(2)} points to clear probation.
                </p>
              )}
            </div>
            
            <div className="grid sm:grid-cols-2 gap-3">
              <div className={`p-3 rounded-lg border-2 ${
                result.standing.color === 'green' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' :
                result.standing.color === 'blue' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' :
                result.standing.color === 'yellow' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' :
                'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
              }`}>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Academic Standing</p>
                <p className="text-xl font-bold">{result.standing.standing}</p>
                <p className="text-xs">{result.standing.description}</p>
              </div>
              <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Class of Degree</p>
                <p className="text-xl font-bold">{result.classOf}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Max CGPA Calculator
function MaxCGPACalculator() {
  const [currentCGPA, setCurrentCGPA] = useState("")
  const [creditsEarned, setCreditsEarned] = useState("")
  const [creditsRemaining, setCreditsRemaining] = useState("")
  const [result, setResult] = useState<number | null>(null)

  const calculate = () => {
    const max = calculateMaxCGPA(
      parseFloat(currentCGPA),
      parseFloat(creditsEarned),
      parseFloat(creditsRemaining)
    )
    setResult(max)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Maximum Achievable CGPA
        </CardTitle>
        <CardDescription>
          Find out the highest CGPA you can achieve if you get A's in all remaining courses
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Current CGPA</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              max="5"
              placeholder="e.g., 3.0"
              value={currentCGPA}
              onChange={(e) => setCurrentCGPA(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Credits Earned</Label>
            <Input
              type="number"
              placeholder="e.g., 40"
              value={creditsEarned}
              onChange={(e) => setCreditsEarned(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Credits Remaining</Label>
            <Input
              type="number"
              placeholder="e.g., 80"
              value={creditsRemaining}
              onChange={(e) => setCreditsRemaining(e.target.value)}
            />
          </div>
        </div>

        <Button onClick={calculate} className="w-full">
          Calculate Max CGPA
        </Button>

        {result !== null && (
          <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg">
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
              Maximum Achievable CGPA
            </p>
            <p className="text-4xl font-bold">{result.toFixed(2)}</p>
            <p className="text-sm mt-2">
              Class: <strong>{getClassOfDegree(result)}</strong>
            </p>
            <p className="text-xs mt-3 text-zinc-500">
              This assumes you get A grades (5.0) in all {creditsRemaining} remaining credits
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
