"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/alert"
import { ChevronDown, ChevronUp, BookOpen } from "lucide-react"
import { useState } from "react"

interface Course {
  courseCode: string
  courseTitle: string
  creditUnits: number
  grade: string
  gradePoint: number
}

interface SemesterData {
  level: number
  semester: number
  courses: Course[]
  gpa: number
  totalCredits: number
  qualityPoints: number
}

interface SemesterBreakdownProps {
  semesters: SemesterData[]
}

export default function SemesterBreakdown({ semesters }: SemesterBreakdownProps) {
  const [expandedSemester, setExpandedSemester] = useState<string | null>(
    semesters.length > 0 ? `${semesters[semesters.length - 1].level}-${semesters[semesters.length - 1].semester}` : null
  )

  const toggleSemester = (key: string) => {
    setExpandedSemester(expandedSemester === key ? null : key)
  }

  const getGradeColor = (gradePoint: number) => {
    if (gradePoint >= 5.0) return 'text-green-600 dark:text-green-400'
    if (gradePoint >= 4.0) return 'text-blue-600 dark:text-blue-400'
    if (gradePoint >= 3.0) return 'text-amber-600 dark:text-amber-400'
    if (gradePoint >= 2.0) return 'text-orange-600 dark:text-orange-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getGPABadgeColor = (gpa: number) => {
    if (gpa >= 4.5) return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
    if (gpa >= 3.5) return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
    if (gpa >= 2.4) return 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
    if (gpa >= 2.0) return 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400'
    return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
  }

  if (semesters.length === 0) {
    return (
      <Card className="border-2 border-primary-200 dark:border-primary-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary-700 dark:text-primary-400">
            <BookOpen className="h-5 w-5" />
            Semester Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-8">
            No semester data available. Add results to see detailed breakdown.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-2 border-primary-200 dark:border-primary-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary-700 dark:text-primary-400">
          <BookOpen className="h-5 w-5" />
          Semester Breakdown
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Detailed GPA calculation for each semester
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {semesters.map((sem) => {
          const key = `${sem.level}-${sem.semester}`
          const isExpanded = expandedSemester === key

          return (
            <div
              key={key}
              className="border-2 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
            >
              {/* Semester Header */}
              <button
                onClick={() => toggleSemester(key)}
                className="w-full p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="text-left">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {sem.level} Level - Semester {sem.semester}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {sem.courses.length} courses • {sem.totalCredits} credits
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getGPABadgeColor(sem.gpa)}`}>
                    GPA: {sem.gpa.toFixed(2)}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  )}
                </div>
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="p-4 bg-white dark:bg-gray-900 space-y-4">
                  {/* Courses Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                          <th className="text-left py-2 px-2 font-semibold text-gray-700 dark:text-gray-300">
                            Course
                          </th>
                          <th className="text-center py-2 px-2 font-semibold text-gray-700 dark:text-gray-300">
                            Credits
                          </th>
                          <th className="text-center py-2 px-2 font-semibold text-gray-700 dark:text-gray-300">
                            Grade
                          </th>
                          <th className="text-center py-2 px-2 font-semibold text-gray-700 dark:text-gray-300">
                            Points
                          </th>
                          <th className="text-right py-2 px-2 font-semibold text-gray-700 dark:text-gray-300">
                            Quality Points
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {sem.courses.map((course, idx) => {
                          const qualityPoints = course.gradePoint * course.creditUnits
                          return (
                            <tr
                              key={idx}
                              className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                              <td className="py-3 px-2">
                                <div className="font-medium text-gray-900 dark:text-white">
                                  {course.courseCode}
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                  {course.courseTitle}
                                </div>
                              </td>
                              <td className="text-center py-3 px-2 text-gray-700 dark:text-gray-300">
                                {course.creditUnits}
                              </td>
                              <td className="text-center py-3 px-2">
                                <span className="font-semibold text-gray-900 dark:text-white">
                                  {course.grade}
                                </span>
                              </td>
                              <td className={`text-center py-3 px-2 font-semibold ${getGradeColor(course.gradePoint)}`}>
                                {course.gradePoint.toFixed(1)}
                              </td>
                              <td className="text-right py-3 px-2">
                                <span className="font-mono text-gray-700 dark:text-gray-300">
                                  {course.gradePoint.toFixed(1)} × {course.creditUnits} = {qualityPoints.toFixed(1)}
                                </span>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Calculation Box */}
                  <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4 border-2 border-primary-200 dark:border-primary-800">
                    <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      GPA Calculation:
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Total Quality Points:</span>
                        <span className="font-mono font-semibold text-primary-700 dark:text-primary-300">
                          {sem.qualityPoints.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Total Credit Units:</span>
                        <span className="font-mono font-semibold text-primary-700 dark:text-primary-300">
                          {sem.totalCredits}
                        </span>
                      </div>
                      <div className="border-t-2 border-primary-200 dark:border-primary-700 pt-2 mt-2">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-700 dark:text-gray-300">
                            Semester GPA:
                          </span>
                          <span className="font-mono text-lg font-bold text-primary-600 dark:text-primary-400">
                            {sem.qualityPoints.toFixed(2)} ÷ {sem.totalCredits} = {sem.gpa.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Info Note */}
                  <div className="text-xs text-gray-500 dark:text-gray-500 italic">
                    💡 Quality Points = Grade Point × Credit Units. GPA = Total Quality Points ÷ Total Credit Units
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
