"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/alert"
import { Award, TrendingUp } from "lucide-react"

interface ClassificationGuideProps {
  currentCGPA: number
}

const classifications = [
  { name: 'First Class', min: 4.5, max: 5.0, color: 'bg-green-500', bgColor: 'bg-green-50 dark:bg-green-900/20', textColor: 'text-green-700 dark:text-green-400' },
  { name: 'Second Class Upper', min: 3.5, max: 4.49, color: 'bg-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-900/20', textColor: 'text-blue-700 dark:text-blue-400' },
  { name: 'Second Class Lower', min: 2.4, max: 3.49, color: 'bg-amber-500', bgColor: 'bg-amber-50 dark:bg-amber-900/20', textColor: 'text-amber-700 dark:text-amber-400' },
  { name: 'Third Class', min: 1.5, max: 2.39, color: 'bg-orange-500', bgColor: 'bg-orange-50 dark:bg-orange-900/20', textColor: 'text-orange-700 dark:text-orange-400' },
  { name: 'Pass', min: 1.0, max: 1.49, color: 'bg-red-500', bgColor: 'bg-red-50 dark:bg-red-900/20', textColor: 'text-red-700 dark:text-red-400' },
]

export default function ClassificationGuide({ currentCGPA }: ClassificationGuideProps) {
  const getCurrentClass = () => {
    return classifications.find(c => currentCGPA >= c.min && currentCGPA <= c.max)
  }

  const getNextClass = () => {
    const current = getCurrentClass()
    if (!current) return null
    const currentIndex = classifications.indexOf(current)
    return currentIndex > 0 ? classifications[currentIndex - 1] : null
  }

  const currentClass = getCurrentClass()
  const nextClass = getNextClass()
  const distanceToNext = nextClass ? (nextClass.min - currentCGPA).toFixed(2) : null

  return (
    <Card className="border-2 border-primary-200 dark:border-primary-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary-700 dark:text-primary-400">
          <Award className="h-5 w-5" />
          Classification Guide
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Status */}
        {currentClass && (
          <div className={`p-4 rounded-lg border-2 ${currentClass.bgColor}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-700 dark:text-gray-300">Your Current Class:</span>
              <Award className={`h-5 w-5 ${currentClass.textColor}`} />
            </div>
            <div className={`text-2xl font-bold ${currentClass.textColor}`}>
              {currentClass.name}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              CGPA: {currentCGPA.toFixed(2)} ({currentClass.min.toFixed(2)} - {currentClass.max.toFixed(2)})
            </div>
          </div>
        )}

        {/* Next Target */}
        {nextClass && distanceToNext && parseFloat(distanceToNext) > 0 && (
          <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border-2 border-primary-200 dark:border-primary-800">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-primary-600 dark:text-primary-400" />
              <span className="font-semibold text-gray-700 dark:text-gray-300">Next Target:</span>
            </div>
            <div className="text-lg font-bold text-primary-700 dark:text-primary-300">
              {nextClass.name}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              You need +{distanceToNext} points to reach {nextClass.name}
            </div>
          </div>
        )}

        {/* All Classifications */}
        <div className="space-y-2">
          <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            All Classifications:
          </div>
          {classifications.map((classification) => {
            const isActive = currentClass?.name === classification.name
            const percentage = currentCGPA >= classification.min 
              ? 100 
              : currentCGPA <= classification.min
              ? 0
              : ((currentCGPA - classification.min) / (classification.max - classification.min)) * 100

            return (
              <div 
                key={classification.name}
                className={`p-3 rounded-lg border-2 transition-all ${
                  isActive 
                    ? `${classification.bgColor} border-current`
                    : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${classification.color}`}></div>
                    <span className={`text-sm font-medium ${isActive ? classification.textColor : 'text-gray-700 dark:text-gray-300'}`}>
                      {classification.name}
                    </span>
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {classification.min.toFixed(2)} - {classification.max.toFixed(2)}
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full ${classification.color} transition-all duration-500`}
                    style={{ width: `${isActive ? percentage : 0}%` }}
                  ></div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Motivation Message */}
        {currentClass && (
          <div className="text-center p-3 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-lg">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {currentCGPA >= 4.5 
                ? "🌟 Excellent! You're in First Class territory. Keep up the outstanding work!"
                : currentCGPA >= 3.5
                ? "🎯 Great job! You're performing well. Push for First Class!"
                : currentCGPA >= 2.4
                ? "📚 You're doing okay. Focus on improvement to reach 2:1!"
                : "💪 Stay motivated! Every course is an opportunity to improve."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
