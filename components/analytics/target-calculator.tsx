"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Target, TrendingUp } from "lucide-react"

interface TargetCalculatorProps {
  currentCGPA: number
  creditsEarned: number
  totalCredits: number
}

export default function TargetCalculator({ currentCGPA, creditsEarned, totalCredits }: TargetCalculatorProps) {
  const [targetCGPA, setTargetCGPA] = useState<string>("4.50")
  const [result, setResult] = useState<{
    requiredGPA: number
    isAchievable: boolean
    message: string
  } | null>(null)

  const calculateRequired = () => {
    const target = parseFloat(targetCGPA)
    const remainingCredits = totalCredits - creditsEarned
    
    if (remainingCredits <= 0) {
      setResult({
        requiredGPA: 0,
        isAchievable: false,
        message: "You've completed all credits. Your CGPA is final."
      })
      return
    }

    // Formula: (Target × Total CUs) - (Current CGPA × Earned CUs) / Remaining CUs
    const currentQualityPoints = currentCGPA * creditsEarned
    const targetQualityPoints = target * totalCredits
    const requiredQualityPoints = targetQualityPoints - currentQualityPoints
    const requiredGPA = requiredQualityPoints / remainingCredits

    const isAchievable = requiredGPA <= 5.0 && requiredGPA >= 0

    let message = ""
    if (requiredGPA > 5.0) {
      message = `Target CGPA of ${target.toFixed(2)} is no longer achievable. The maximum CGPA you can reach is ${((currentQualityPoints + (remainingCredits * 5.0)) / totalCredits).toFixed(2)}`
    } else if (requiredGPA < 0) {
      message = `Great news! You've already exceeded your target CGPA of ${target.toFixed(2)}!`
    } else if (requiredGPA >= 4.5) {
      message = `You need to maintain First Class grades (4.5+ GPA) across all remaining ${remainingCredits} credits.`
    } else if (requiredGPA >= 3.5) {
      message = `You need to maintain Second Class Upper grades (3.5+ GPA) across remaining semesters.`
    } else {
      message = `This target is achievable with consistent performance in your remaining courses.`
    }

    setResult({
      requiredGPA: Math.max(0, requiredGPA),
      isAchievable,
      message
    })
  }

  return (
    <Card className="border-2 border-primary-200 dark:border-primary-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary-700 dark:text-primary-400">
          <Target className="h-5 w-5" />
          Target CGPA Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Current CGPA:</span>
            <span className="font-bold text-primary-700 dark:text-primary-300">{currentCGPA.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Credits Earned:</span>
            <span className="font-semibold">{creditsEarned} / {totalCredits}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Remaining:</span>
            <span className="font-semibold">{totalCredits - creditsEarned} credits</span>
          </div>
        </div>

        <div>
          <Label htmlFor="targetCGPA">What's your target CGPA?</Label>
          <Input
            id="targetCGPA"
            type="number"
            step="0.01"
            min="0"
            max="5.0"
            value={targetCGPA}
            onChange={(e) => setTargetCGPA(e.target.value)}
            placeholder="e.g., 4.50"
            className="mt-2"
          />
        </div>

        <Button 
          onClick={calculateRequired}
          className="w-full bg-primary-500 hover:bg-primary-600 text-white"
        >
          <TrendingUp className="h-4 w-4 mr-2" />
          Calculate Required GPA
        </Button>

        {result && (
          <div className={`p-4 rounded-lg border-2 ${
            result.isAchievable 
              ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
              : 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800'
          }`}>
            <div className="space-y-3">
              {result.requiredGPA > 0 && result.requiredGPA <= 5.0 && (
                <div className="text-center">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Required Average GPA
                  </div>
                  <div className={`text-4xl font-bold ${
                    result.isAchievable 
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-amber-600 dark:text-amber-400'
                  }`}>
                    {result.requiredGPA.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    across remaining {totalCredits - creditsEarned} credits
                  </div>
                </div>
              )}
              
              <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
                {result.message}
              </p>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
          <p><strong>How it works:</strong></p>
          <p>Formula: (Target CGPA × Total Credits) - (Current Quality Points) ÷ Remaining Credits</p>
          <p>This shows the average GPA you need across all remaining courses.</p>
        </div>
      </CardContent>
    </Card>
  )
}
