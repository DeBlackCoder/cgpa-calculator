import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function formatDateTime(date: Date | string): string {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function calculateGPA(results: Array<{ gradePoint: number; creditUnits: number }>): number {
  if (results.length === 0) return 0
  
  const totalQualityPoints = results.reduce((sum, result) => 
    sum + (result.gradePoint * result.creditUnits), 0)
  const totalCredits = results.reduce((sum, result) => sum + result.creditUnits, 0)
  
  return totalCredits === 0 ? 0 : totalQualityPoints / totalCredits
}

export function getGradeFromScore(score: number): {
  grade: string
  gradePoint: number
} {
  if (score >= 70) return { grade: 'A', gradePoint: 5.0 }
  if (score >= 60) return { grade: 'B', gradePoint: 4.0 }
  if (score >= 50) return { grade: 'C', gradePoint: 3.0 }
  if (score >= 45) return { grade: 'D', gradePoint: 2.0 }
  if (score >= 40) return { grade: 'E', gradePoint: 1.0 }
  return { grade: 'F', gradePoint: 0.0 }
}

export function getClassOfDegree(cgpa: number): string {
  if (cgpa >= 4.5) return 'First Class'
  if (cgpa >= 3.5) return 'Second Class Upper'
  if (cgpa >= 2.5) return 'Second Class Lower'
  if (cgpa >= 1.5) return 'Third Class'
  return 'Pass'
}

export function calculateRequiredGPA(
  currentCGPA: number,
  creditsEarned: number,
  targetCGPA: number,
  creditsRemaining: number
): number {
  const currentQualityPoints = currentCGPA * creditsEarned
  const requiredQualityPoints = targetCGPA * (creditsEarned + creditsRemaining)
  const neededQualityPoints = requiredQualityPoints - currentQualityPoints
  
  return creditsRemaining === 0 ? 0 : neededQualityPoints / creditsRemaining
}

// Calculate what grade is needed in a specific course to achieve target GPA
export function calculateRequiredCourseGrade(
  currentCGPA: number,
  creditsEarned: number,
  targetGPA: number,
  courseCredits: number
): { gradePoint: number; grade: string; possible: boolean } {
  const requiredGP = calculateRequiredGPA(currentCGPA, creditsEarned, targetGPA, courseCredits)
  const possible = requiredGP <= 5.0
  
  let grade = 'F'
  if (requiredGP >= 4.5) grade = 'A'
  else if (requiredGP >= 3.5) grade = 'B'
  else if (requiredGP >= 2.5) grade = 'C'
  else if (requiredGP >= 1.5) grade = 'D'
  else if (requiredGP >= 0.5) grade = 'E'
  
  return { gradePoint: requiredGP, grade, possible }
}

// Calculate percentage score from grade point
export function getScoreFromGradePoint(gradePoint: number): number {
  if (gradePoint >= 5.0) return 75
  if (gradePoint >= 4.0) return 65
  if (gradePoint >= 3.0) return 55
  if (gradePoint >= 2.0) return 47
  if (gradePoint >= 1.0) return 42
  return 35
}

// Calculate weighted average for specific courses
export function calculateWeightedAverage(
  courses: Array<{ score: number; weight: number }>
): number {
  const totalWeight = courses.reduce((sum, c) => sum + c.weight, 0)
  if (totalWeight === 0) return 0
  
  const weightedSum = courses.reduce((sum, c) => sum + (c.score * c.weight), 0)
  return weightedSum / totalWeight
}

// Calculate semester GPA (not cumulative)
export function calculateSemesterGPA(
  results: Array<{ gradePoint: number; creditUnits: number }>
): number {
  return calculateGPA(results)
}

// Calculate credit units needed for graduation
export function calculateCreditsToGraduation(
  creditsEarned: number,
  totalCreditsRequired: number
): { remaining: number; percentage: number; semesters: number } {
  const remaining = Math.max(0, totalCreditsRequired - creditsEarned)
  const percentage = totalCreditsRequired > 0 ? (creditsEarned / totalCreditsRequired) * 100 : 0
  const semesters = Math.ceil(remaining / 20) // Assuming 20 credits per semester
  
  return { remaining, percentage, semesters }
}

// Calculate if student is on probation
export function isOnProbation(cgpa: number, threshold: number = 1.5): {
  onProbation: boolean
  pointsNeeded: number
} {
  const onProbation = cgpa < threshold
  const pointsNeeded = onProbation ? threshold - cgpa : 0
  
  return { onProbation, pointsNeeded }
}

// Calculate GPA trend (improving, declining, stable)
export function calculateGPATrend(
  semesterGPAs: number[]
): { trend: 'improving' | 'declining' | 'stable'; change: number } {
  if (semesterGPAs.length < 2) {
    return { trend: 'stable', change: 0 }
  }
  
  const recent = semesterGPAs.slice(-3) // Last 3 semesters
  const avg = recent.reduce((sum, gpa) => sum + gpa, 0) / recent.length
  const firstHalf = recent.slice(0, Math.ceil(recent.length / 2))
  const secondHalf = recent.slice(Math.ceil(recent.length / 2))
  
  const firstAvg = firstHalf.reduce((sum, gpa) => sum + gpa, 0) / firstHalf.length
  const secondAvg = secondHalf.reduce((sum, gpa) => sum + gpa, 0) / secondHalf.length
  
  const change = secondAvg - firstAvg
  
  let trend: 'improving' | 'declining' | 'stable' = 'stable'
  if (change > 0.1) trend = 'improving'
  else if (change < -0.1) trend = 'declining'
  
  return { trend, change }
}

// Calculate max achievable CGPA
export function calculateMaxCGPA(
  currentCGPA: number,
  creditsEarned: number,
  creditsRemaining: number
): number {
  if (creditsRemaining === 0) return currentCGPA
  
  const currentQualityPoints = currentCGPA * creditsEarned
  const maxQualityPoints = 5.0 * creditsRemaining // All A's
  const totalQualityPoints = currentQualityPoints + maxQualityPoints
  const totalCredits = creditsEarned + creditsRemaining
  
  return totalQualityPoints / totalCredits
}

// Calculate expected graduation year
export function calculateGraduationYear(
  admissionYear: number,
  programmeDuration: number,
  level: number
): { expectedYear: number; yearsRemaining: number } {
  const expectedYear = admissionYear + programmeDuration
  const currentYear = new Date().getFullYear()
  const yearsRemaining = Math.max(0, expectedYear - currentYear)
  
  return { expectedYear, yearsRemaining }
}

// Convert percentage to grade point
export function percentageToGradePoint(percentage: number): number {
  if (percentage >= 70) return 5.0
  if (percentage >= 60) return 4.0
  if (percentage >= 50) return 3.0
  if (percentage >= 45) return 2.0
  if (percentage >= 40) return 1.0
  return 0.0
}

// Calculate academic standing
export function getAcademicStanding(cgpa: number): {
  standing: string
  description: string
  color: 'green' | 'blue' | 'yellow' | 'red'
} {
  if (cgpa >= 4.5) {
    return {
      standing: 'Excellent',
      description: 'First Class Honours',
      color: 'green'
    }
  } else if (cgpa >= 3.5) {
    return {
      standing: 'Very Good',
      description: 'Second Class Upper',
      color: 'green'
    }
  } else if (cgpa >= 2.5) {
    return {
      standing: 'Good',
      description: 'Second Class Lower',
      color: 'blue'
    }
  } else if (cgpa >= 1.5) {
    return {
      standing: 'Fair',
      description: 'Third Class',
      color: 'yellow'
    }
  } else {
    return {
      standing: 'Poor',
      description: 'Academic Probation',
      color: 'red'
    }
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
