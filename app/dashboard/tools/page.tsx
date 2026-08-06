"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calculator, TrendingUp, GraduationCap, Target, Award, AlertCircle, ChevronDown, ChevronUp, Plus, Trash2, Save } from "lucide-react"
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

interface Course {
  id: string
  code: string
  score: string
  creditUnits: string
}

interface Semester {
  id: string
  year: number
  semester: number
  label: string
  courses: Course[]
  gpa: number
  isOpen: boolean
}

// CGPA Calculator with Semester Breakdown
function CGPACalculator() {
  const [semesters, setSemesters] = useState<Semester[]>([
    { id: '1', year: 1, semester: 1, label: 'Year 1 - 1st Semester', courses: [], gpa: 0, isOpen: false },
    { id: '2', year: 1, semester: 2, label: 'Year 1 - 2nd Semester', courses: [], gpa: 0, isOpen: false },
    { id: '3', year: 2, semester: 1, label: 'Year 2 - 1st Semester', courses: [], gpa: 0, isOpen: false },
    { id: '4', year: 2, semester: 2, label: 'Year 2 - 2nd Semester', courses: [], gpa: 0, isOpen: false },
    { id: '5', year: 3, semester: 1, label: 'Year 3 - 1st Semester', courses: [], gpa: 0, isOpen: false },
    { id: '6', year: 3, semester: 2, label: 'Year 3 - 2nd Semester', courses: [], gpa: 0, isOpen: false },
  ])
  const [finalCGPA, setFinalCGPA] = useState(0)
  const [totalCredits, setTotalCredits] = useState(0)
  const [autoCalculate, setAutoCalculate] = useState(true)

  const toggleSemester = (semesterId: string) => {
    setSemesters(semesters.map(sem => 
      sem.id === semesterId ? { ...sem, isOpen: !sem.isOpen } : sem
    ))
  }

  const addCourse = (semesterId: string) => {
    setSemesters(semesters.map(sem => {
      if (sem.id === semesterId) {
        const newCourse = { 
          id: `${semesterId}-${Date.now()}`, 
          code: '', 
          score: '', 
          creditUnits: '3' // Default to 3 credits
        }
        return {
          ...sem,
          courses: [...sem.courses, newCourse],
          isOpen: true // Keep it open when adding courses
        }
      }
      return sem
    }))
  }

  const removeCourse = (semesterId: string, courseId: string) => {
    setSemesters(semesters.map(sem => {
      if (sem.id === semesterId) {
        return {
          ...sem,
          courses: sem.courses.filter(c => c.id !== courseId)
        }
      }
      return sem
    }))
    if (autoCalculate) {
      setTimeout(() => calculateFinalCGPA(), 100)
    }
  }

  const updateCourse = (semesterId: string, courseId: string, field: keyof Course, value: string) => {
    setSemesters(semesters.map(sem => {
      if (sem.id === semesterId) {
        return {
          ...sem,
          courses: sem.courses.map(c => 
            c.id === courseId ? { ...c, [field]: value } : c
          )
        }
      }
      return sem
    }))
    
    // Auto-calculate on input change
    if (autoCalculate) {
      setTimeout(() => calculateFinalCGPA(), 100)
    }
  }

  const calculateSemesterGPA = (semesterId: string): number => {
    const semester = semesters.find(s => s.id === semesterId)
    if (!semester || semester.courses.length === 0) return 0

    let totalPoints = 0
    let totalCredits = 0

    semester.courses.forEach(course => {
      const score = parseFloat(course.score)
      const credits = parseFloat(course.creditUnits)
      
      if (!isNaN(score) && !isNaN(credits) && score >= 0 && score <= 100) {
        const gradePoint = percentageToGradePoint(score)
        totalPoints += gradePoint * credits
        totalCredits += credits
      }
    })

    const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0
    return gpa
  }

  const calculateFinalCGPA = () => {
    let totalPoints = 0
    let totalCreds = 0
    const updatedSemesters = [...semesters]

    updatedSemesters.forEach(semester => {
      let semPoints = 0
      let semCredits = 0

      semester.courses.forEach(course => {
        const score = parseFloat(course.score)
        const credits = parseFloat(course.creditUnits)
        
        if (!isNaN(score) && !isNaN(credits) && score >= 0 && score <= 100) {
          const gradePoint = percentageToGradePoint(score)
          semPoints += gradePoint * credits
          semCredits += credits
          totalPoints += gradePoint * credits
          totalCreds += credits
        }
      })

      semester.gpa = semCredits > 0 ? semPoints / semCredits : 0
    })

    const cgpa = totalCreds > 0 ? totalPoints / totalCreds : 0
    setFinalCGPA(cgpa)
    setTotalCredits(totalCreds)
    setSemesters(updatedSemesters)
  }

  const clearAll = () => {
    if (confirm('Are you sure you want to clear all courses?')) {
      setSemesters(semesters.map(sem => ({ ...sem, courses: [], gpa: 0, isOpen: false })))
      setFinalCGPA(0)
      setTotalCredits(0)
    }
  }

  const expandAll = () => {
    setSemesters(semesters.map(sem => ({ ...sem, isOpen: true })))
  }

  const collapseAll = () => {
    setSemesters(semesters.map(sem => ({ ...sem, isOpen: false })))
  }

  const getGradeColor = (gpa: number) => {
    if (gpa >= 4.5) return 'text-green-600'
    if (gpa >= 3.5) return 'text-blue-600'
    if (gpa >= 2.4) return 'text-yellow-600'
    if (gpa >= 1.5) return 'text-orange-600'
    return 'text-red-600'
  }

  const getGrade = (score: number) => {
    if (score >= 70) return 'A'
    if (score >= 60) return 'B'
    if (score >= 50) return 'C'
    if (score >= 45) return 'D'
    if (score >= 40) return 'E'
    return 'F'
  }

  const totalCourses = semesters.reduce((sum, sem) => sum + sem.courses.length, 0)

  return (
    <div className="space-y-4">
      <Card className="relative overflow-hidden border-l-4 border-l-blue-400 bg-gradient-to-r from-blue-50/30 to-white">
        <CardHeader>
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2 mb-2">
                <Calculator className="h-5 w-5 text-blue-600" />
                CGPA Calculator
              </CardTitle>
              <CardDescription>
                Calculate your CGPA by entering courses for each semester. Auto-calculation is {autoCalculate ? 'enabled' : 'disabled'}.
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={expandAll}
                className="text-xs h-8"
              >
                Expand All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={collapseAll}
                className="text-xs h-8"
              >
                Collapse All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
            <div className="text-center">
              <p className="text-xs text-gray-600 mb-1">Total Courses</p>
              <p className="text-xl font-bold text-gray-900">{totalCourses}</p>
            </div>
            <div className="text-center border-x border-gray-200">
              <p className="text-xs text-gray-600 mb-1">Total Credits</p>
              <p className="text-xl font-bold text-gray-900">{totalCredits}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-600 mb-1">Semesters</p>
              <p className="text-xl font-bold text-gray-900">{semesters.filter(s => s.courses.length > 0).length}/6</p>
            </div>
          </div>
          {/* Semester Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {semesters.map((semester, index) => {
              const semesterGrade = semester.gpa > 0 ? getClassOfDegree(semester.gpa) : ''
              const gradientColors = [
                'from-blue-50/50 to-transparent border-blue-200',
                'from-purple-50/50 to-transparent border-purple-200',
                'from-green-50/50 to-transparent border-green-200',
                'from-orange-50/50 to-transparent border-orange-200',
                'from-pink-50/50 to-transparent border-pink-200',
                'from-cyan-50/50 to-transparent border-cyan-200'
              ]
              
              return (
                <div 
                  key={semester.id} 
                  className={`border-2 rounded-xl overflow-hidden bg-gradient-to-r ${semester.courses.length > 0 ? gradientColors[index % 6] : 'border-gray-200 bg-white'} transition-all duration-200 hover:shadow-md`}
                >
                  {/* Semester Header */}
                  <button
                    onClick={() => toggleSemester(semester.id)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/60 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-gray-800">{semester.label}</span>
                      {semester.courses.length > 0 && (
                        <span className="text-xs bg-white px-2 py-0.5 rounded-full text-gray-600 font-medium">
                          {semester.courses.length}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className={`text-sm font-bold ${semester.gpa > 0 ? getGradeColor(semester.gpa) : 'text-gray-400'}`}>
                          {semester.gpa > 0 ? semester.gpa.toFixed(2) : '0.00'}
                        </span>
                        {semesterGrade && (
                          <p className="text-[10px] text-gray-500">{semesterGrade}</p>
                        )}
                      </div>
                      {semester.isOpen ? (
                        <ChevronUp className="h-4 w-4 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      )}
                    </div>
                  </button>

                  {/* Semester Content */}
                  {semester.isOpen && (
                    <div className="p-4 border-t border-gray-200 space-y-3 bg-white/50">
                      {semester.courses.length === 0 ? (
                        <div className="text-center py-4">
                          <p className="text-xs text-gray-500 mb-3">No courses added yet</p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs"
                            onClick={() => addCourse(semester.id)}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add First Course
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {/* Course Header */}
                          <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-gray-600 px-2 pb-1">
                            <div className="col-span-4">COURSE</div>
                            <div className="col-span-3">SCORE</div>
                            <div className="col-span-2">CU</div>
                            <div className="col-span-2">GRADE</div>
                            <div className="col-span-1"></div>
                          </div>

                          {/* Courses */}
                          {semester.courses.map((course) => {
                            const score = parseFloat(course.score)
                            const grade = !isNaN(score) && score >= 0 && score <= 100 ? getGrade(score) : ''
                            const gradeColor = 
                              grade === 'A' ? 'text-green-600' :
                              grade === 'B' ? 'text-blue-600' :
                              grade === 'C' ? 'text-yellow-600' :
                              grade === 'D' ? 'text-orange-600' :
                              grade === 'E' ? 'text-orange-700' :
                              grade === 'F' ? 'text-red-600' : 'text-gray-400'

                            return (
                              <div key={course.id} className="grid grid-cols-12 gap-2 items-center bg-white p-2 rounded-lg border border-gray-100 hover:border-gray-300 transition-colors">
                                <Input
                                  placeholder="CSC101"
                                  className="col-span-4 h-8 text-xs font-medium"
                                  value={course.code}
                                  onChange={(e) => updateCourse(semester.id, course.id, 'code', e.target.value)}
                                />
                                <Input
                                  type="number"
                                  placeholder="0-100"
                                  min="0"
                                  max="100"
                                  className="col-span-3 h-8 text-xs"
                                  value={course.score}
                                  onChange={(e) => updateCourse(semester.id, course.id, 'score', e.target.value)}
                                />
                                <Input
                                  type="number"
                                  placeholder="3"
                                  min="1"
                                  max="6"
                                  className="col-span-2 h-8 text-xs"
                                  value={course.creditUnits}
                                  onChange={(e) => updateCourse(semester.id, course.id, 'creditUnits', e.target.value)}
                                />
                                <div className={`col-span-2 text-center font-bold text-sm ${gradeColor}`}>
                                  {grade || '-'}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="col-span-1 h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => removeCourse(semester.id, course.id)}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            )
                          })}
                        </div>
                      )}

                      {/* Add Course Button */}
                      {semester.courses.length > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full h-8 text-xs border-dashed"
                          onClick={() => addCourse(semester.id)}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add Another Course
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Final CGPA Section */}
          <div className="pt-4 border-t-2 border-gray-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-2">
                  Your <strong>CGPA</strong> is the credit-weighted average of all your courses.
                </p>
                <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoCalculate}
                    onChange={(e) => setAutoCalculate(e.target.checked)}
                    className="rounded"
                  />
                  Auto-calculate on input change
                </label>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAll}
                  className="text-xs h-9"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  Clear all
                </Button>
                {!autoCalculate && (
                  <Button
                    size="sm"
                    onClick={calculateFinalCGPA}
                    className="bg-green-600 hover:bg-green-700 text-xs h-9"
                  >
                    <Calculator className="h-3.5 w-3.5 mr-1" />
                    Calculate CGPA
                  </Button>
                )}
              </div>
            </div>

            {/* CGPA Display */}
            <div className={`p-6 rounded-xl ${
              finalCGPA >= 4.5 ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300' :
              finalCGPA >= 3.5 ? 'bg-gradient-to-r from-blue-50 to-sky-50 border-2 border-blue-300' :
              finalCGPA >= 2.4 ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-300' :
              finalCGPA >= 1.5 ? 'bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-orange-300' :
              finalCGPA > 0 ? 'bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-300' :
              'bg-gray-50 border-2 border-gray-200'
            }`}>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">FINAL CGPA</p>
                  <p className={`text-6xl font-bold ${finalCGPA > 0 ? getGradeColor(finalCGPA) : 'text-gray-300'}`}>
                    {finalCGPA.toFixed(2)}
                  </p>
                  {finalCGPA > 0 && (
                    <div className="mt-2 space-y-1">
                      <p className="text-sm font-semibold text-gray-700">{getClassOfDegree(finalCGPA)}</p>
                      <p className="text-xs text-gray-600">{totalCourses} courses • {totalCredits} credits</p>
                    </div>
                  )}
                </div>
                {finalCGPA > 0 && (
                  <div className="text-right">
                    <Award className={`h-16 w-16 ${getGradeColor(finalCGPA)} opacity-20`} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ToolsPage() {
  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
          <Calculator className="h-8 w-8" />
          Academic Tools & Calculators
        </h1>
        <p className="text-sm text-gray-600">
          Helpful tools to plan your academic journey
        </p>
      </div>

      <Tabs defaultValue="cgpa-calculator" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-7">
          <TabsTrigger value="cgpa-calculator">CGPA Calculator</TabsTrigger>
          <TabsTrigger value="target-gpa">Target GPA</TabsTrigger>
          <TabsTrigger value="grade-needed">Grade Needed</TabsTrigger>
          <TabsTrigger value="score-converter">Score Converter</TabsTrigger>
          <TabsTrigger value="graduation">Graduation</TabsTrigger>
          <TabsTrigger value="probation">Probation Check</TabsTrigger>
          <TabsTrigger value="max-cgpa">Max CGPA</TabsTrigger>
        </TabsList>

        {/* CGPA Calculator with Semesters */}
        <TabsContent value="cgpa-calculator">
          <CGPACalculator />
        </TabsContent>

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
              <p className="text-sm text-gray-600">
                You need mostly <strong>A grades (70%+)</strong> in your remaining courses.
              </p>
            ) : result > 3.5 ? (
              <p className="text-sm text-gray-600">
                You need mostly <strong>B grades (60-69%)</strong> in your remaining courses.
              </p>
            ) : (
              <p className="text-sm text-gray-600">
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
            <p className="text-sm text-gray-600 mb-2">
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
            <p className="text-xs text-gray-500">Enter score (0-100%)</p>
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
            <p className="text-xs text-gray-500">Grade point (0.0-5.0)</p>
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
              <p className="text-sm text-gray-600">Expected Graduation Year</p>
              <p className="text-3xl font-bold">{result.expectedYear}</p>
              <p className="text-sm mt-1">{result.yearsRemaining} years remaining</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                <p className="text-sm text-gray-600">Credits Remaining</p>
                <p className="text-2xl font-bold">{result.remaining}</p>
              </div>
              <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                <p className="text-sm text-gray-600">Progress</p>
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
                result.standing.color === 'blue' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 ' :
                result.standing.color === 'yellow' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' :
                'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
              }`}>
                <p className="text-sm text-gray-600">Academic Standing</p>
                <p className="text-xl font-bold">{result.standing.standing}</p>
                <p className="text-xs">{result.standing.description}</p>
              </div>
              <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                <p className="text-sm text-gray-600">Class of Degree</p>
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
            <p className="text-sm text-gray-600 mb-2">
              Maximum Achievable CGPA
            </p>
            <p className="text-4xl font-bold">{result.toFixed(2)}</p>
            <p className="text-sm mt-2">
              Class: <strong>{getClassOfDegree(result)}</strong>
            </p>
            <p className="text-xs mt-3 text-gray-500">
              This assumes you get A grades (5.0) in all {creditsRemaining} remaining credits
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
