/**
 * AI Predictions and Risk Analysis
 * Provides future CGPA predictions, risk classification, and personalized recommendations
 */

import { calculateGPA, calculateGPATrend, calculateMaxCGPA, isOnProbation } from './utils'

export interface StudentPerformanceData {
  currentCGPA: number
  creditsEarned: number
  totalCreditsRequired: number
  semesterGPAs: number[]
  failedCourses: number
  level: number
  targetCGPA?: number
  results: Array<{
    gradePoint: number
    creditUnits: number
    semester: number
    level: number
  }>
}

export interface AIPrediction {
  predictedFinalCGPA: number
  confidenceLevel: 'high' | 'medium' | 'low'
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  riskFactors: string[]
  projections: {
    optimistic: number  // If student performs well
    realistic: number   // Based on current trend
    pessimistic: number // If performance declines
  }
  recommendations: Recommendation[]
  milestones: Milestone[]
}

export interface Recommendation {
  priority: 'urgent' | 'high' | 'medium' | 'low'
  category: 'academic' | 'study_habits' | 'time_management' | 'support' | 'goal_setting'
  title: string
  description: string
  actionItems: string[]
}

export interface Milestone {
  semester: number
  targetGPA: number
  description: string
  achievable: boolean
}

/**
 * Predict future CGPA and provide risk analysis
 */
export function generateAIPredictions(data: StudentPerformanceData): AIPrediction {
  const {
    currentCGPA,
    creditsEarned,
    totalCreditsRequired,
    semesterGPAs,
    failedCourses,
    level,
    targetCGPA,
    results
  } = data

  // Calculate trend
  const trend = calculateGPATrend(semesterGPAs)
  const creditsRemaining = Math.max(0, totalCreditsRequired - creditsEarned)
  const progressPercentage = (creditsEarned / totalCreditsRequired) * 100

  // Calculate projections
  const maxCGPA = calculateMaxCGPA(currentCGPA, creditsEarned, creditsRemaining)
  
  // Optimistic: Assumes student gets 4.5+ in all remaining courses
  const optimistic = creditsRemaining > 0
    ? ((currentCGPA * creditsEarned) + (4.5 * creditsRemaining)) / totalCreditsRequired
    : currentCGPA

  // Realistic: Based on current trend
  let trendAdjustment = 0
  if (trend.trend === 'improving') {
    trendAdjustment = Math.min(trend.change * 2, 0.3)
  } else if (trend.trend === 'declining') {
    trendAdjustment = Math.max(trend.change * 2, -0.3)
  }
  
  const recentAvg = semesterGPAs.length > 0
    ? semesterGPAs.slice(-3).reduce((sum, gpa) => sum + gpa, 0) / Math.min(3, semesterGPAs.length)
    : currentCGPA

  const realistic = creditsRemaining > 0
    ? ((currentCGPA * creditsEarned) + ((recentAvg + trendAdjustment) * creditsRemaining)) / totalCreditsRequired
    : currentCGPA

  // Pessimistic: Assumes slight decline
  const pessimisticGPA = Math.max(recentAvg - 0.5, 2.0)
  const pessimistic = creditsRemaining > 0
    ? ((currentCGPA * creditsEarned) + (pessimisticGPA * creditsRemaining)) / totalCreditsRequired
    : currentCGPA

  // Predicted final CGPA (weighted average favoring realistic)
  const predictedFinalCGPA = (realistic * 0.6) + (optimistic * 0.25) + (pessimistic * 0.15)

  // Determine confidence level
  const confidenceLevel = getConfidenceLevel(semesterGPAs.length, progressPercentage, trend)

  // Assess risk level
  const { riskLevel, riskFactors } = assessRisk(data, trend, predictedFinalCGPA)

  // Generate personalized recommendations
  const recommendations = generateRecommendations(data, trend, riskLevel, predictedFinalCGPA)

  // Create milestones
  const milestones = generateMilestones(currentCGPA, creditsEarned, totalCreditsRequired, targetCGPA || 3.5)

  return {
    predictedFinalCGPA,
    confidenceLevel,
    riskLevel,
    riskFactors,
    projections: {
      optimistic: Math.min(optimistic, 5.0),
      realistic: Math.min(realistic, 5.0),
      pessimistic: Math.max(pessimistic, 0)
    },
    recommendations,
    milestones
  }
}

/**
 * Determine confidence level based on data quality
 */
function getConfidenceLevel(
  dataPoints: number,
  progressPercentage: number,
  trend: { trend: string; change: number }
): 'high' | 'medium' | 'low' {
  if (dataPoints >= 4 && progressPercentage >= 40) {
    return 'high'
  } else if (dataPoints >= 2 && progressPercentage >= 20) {
    return 'medium'
  }
  return 'low'
}

/**
 * Assess academic risk level
 */
function assessRisk(
  data: StudentPerformanceData,
  trend: { trend: string; change: number },
  predictedCGPA: number
): { riskLevel: 'low' | 'medium' | 'high' | 'critical'; riskFactors: string[] } {
  const riskFactors: string[] = []
  let riskScore = 0

  // Check current CGPA
  if (data.currentCGPA < 2.0) {
    riskScore += 40
    riskFactors.push('Currently on academic probation (CGPA < 2.0)')
  } else if (data.currentCGPA < 2.5) {
    riskScore += 25
    riskFactors.push('CGPA below Second Class Lower threshold')
  }

  // Check trend
  if (trend.trend === 'declining') {
    riskScore += 20
    riskFactors.push(`Performance declining (${trend.change.toFixed(2)} points)`)
  }

  // Check failed courses
  if (data.failedCourses > 3) {
    riskScore += 30
    riskFactors.push(`High number of failed courses (${data.failedCourses})`)
  } else if (data.failedCourses > 0) {
    riskScore += 15
    riskFactors.push(`${data.failedCourses} failed course(s)`)
  }

  // Check if predicted CGPA is concerning
  if (predictedCGPA < 2.0) {
    riskScore += 35
    riskFactors.push('Predicted final CGPA below 2.0')
  } else if (predictedCGPA < 2.5) {
    riskScore += 15
    riskFactors.push('Predicted final CGPA may not reach Second Class')
  }

  // Check progress vs level
  const expectedProgress = (data.level / 4) * 100
  const actualProgress = (data.creditsEarned / data.totalCreditsRequired) * 100
  if (actualProgress < expectedProgress - 15) {
    riskScore += 20
    riskFactors.push('Behind expected progress for current level')
  }

  // Determine risk level
  let riskLevel: 'low' | 'medium' | 'high' | 'critical'
  if (riskScore >= 70) {
    riskLevel = 'critical'
  } else if (riskScore >= 45) {
    riskLevel = 'high'
  } else if (riskScore >= 25) {
    riskLevel = 'medium'
  } else {
    riskLevel = 'low'
  }

  if (riskFactors.length === 0) {
    riskFactors.push('No significant risk factors identified')
  }

  return { riskLevel, riskFactors }
}

/**
 * Generate personalized recommendations
 */
function generateRecommendations(
  data: StudentPerformanceData,
  trend: { trend: string; change: number },
  riskLevel: string,
  predictedCGPA: number
): Recommendation[] {
  const recommendations: Recommendation[] = []

  // Critical/High Risk Recommendations
  if (riskLevel === 'critical' || riskLevel === 'high') {
    recommendations.push({
      priority: 'urgent',
      category: 'support',
      title: 'Seek Academic Support Immediately',
      description: 'Your academic standing requires immediate intervention. Connect with academic advisors and support services.',
      actionItems: [
        'Schedule meeting with academic advisor this week',
        'Join peer tutoring sessions for struggling courses',
        'Consider reducing course load next semester',
        'Explore academic counseling services'
      ]
    })
  }

  // Probation recommendations
  if (data.currentCGPA < 2.0) {
    recommendations.push({
      priority: 'urgent',
      category: 'academic',
      title: 'Clear Academic Probation',
      description: 'You need to raise your CGPA above 2.0 to clear probation status.',
      actionItems: [
        `Aim for GPA of ${(2.5).toFixed(2)} or higher this semester`,
        'Focus on fundamental courses to build strong foundation',
        'Retake failed courses to improve grade',
        'Attend all classes and participate actively'
      ]
    })
  }

  // Failed courses
  if (data.failedCourses > 0) {
    recommendations.push({
      priority: data.failedCourses > 2 ? 'urgent' : 'high',
      category: 'academic',
      title: 'Address Failed Courses',
      description: 'Failed courses significantly impact your CGPA. Strategic retakes can improve your standing.',
      actionItems: [
        'Prioritize retaking failed courses in next semester',
        'Identify why you failed (attendance, understanding, exam preparation)',
        'Form study groups for difficult subjects',
        'Use office hours to clarify difficult concepts'
      ]
    })
  }

  // Declining trend
  if (trend.trend === 'declining') {
    recommendations.push({
      priority: 'high',
      category: 'study_habits',
      title: 'Reverse Declining Performance',
      description: 'Your grades have been declining. It\'s time to reassess your study strategies.',
      actionItems: [
        'Conduct honest assessment of current study habits',
        'Create structured daily study schedule',
        'Eliminate distractions during study time',
        'Try active learning techniques (practice problems, teach others)'
      ]
    })
  }

  // Target CGPA recommendations
  if (data.targetCGPA && predictedCGPA < data.targetCGPA) {
    const gap = data.targetCGPA - data.currentCGPA
    recommendations.push({
      priority: 'high',
      category: 'goal_setting',
      title: `Bridge Gap to Target CGPA (${data.targetCGPA.toFixed(2)})`,
      description: `You need to improve by ${gap.toFixed(2)} points to reach your target.`,
      actionItems: [
        `Aim for semester GPAs of ${(data.targetCGPA + 0.3).toFixed(2)} or higher`,
        'Focus on high-credit courses for maximum impact',
        'Excel in elective courses to boost overall CGPA',
        'Consider summer courses to improve grades'
      ]
    })
  }

  // Time management (for all)
  if (data.level <= 200) {
    recommendations.push({
      priority: 'medium',
      category: 'time_management',
      title: 'Build Strong Study Habits Early',
      description: 'Early years set the foundation. Develop effective habits now.',
      actionItems: [
        'Use Pomodoro Technique (25 min study, 5 min break)',
        'Create weekly schedule balancing study and rest',
        'Start assignments early, avoid last-minute cramming',
        'Review notes within 24 hours of each class'
      ]
    })
  }

  // Positive reinforcement for good performance
  if (data.currentCGPA >= 4.0 && trend.trend === 'improving') {
    recommendations.push({
      priority: 'low',
      category: 'academic',
      title: 'Maintain Excellence',
      description: 'You\'re performing excellently! Keep up the momentum.',
      actionItems: [
        'Continue current study strategies',
        'Consider mentoring struggling classmates',
        'Explore research opportunities or internships',
        'Challenge yourself with advanced electives'
      ]
    })
  }

  return recommendations.sort((a, b) => {
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })
}

/**
 * Generate semester-by-semester milestones
 */
function generateMilestones(
  currentCGPA: number,
  creditsEarned: number,
  totalCreditsRequired: number,
  targetCGPA: number
): Milestone[] {
  const creditsRemaining = totalCreditsRequired - creditsEarned
  const semesters = Math.ceil(creditsRemaining / 20) // Assuming 20 credits per semester
  const milestones: Milestone[] = []

  const gap = targetCGPA - currentCGPA
  const incrementPerSemester = gap / semesters

  for (let i = 1; i <= Math.min(semesters, 6); i++) {
    const semesterTarget = currentCGPA + (incrementPerSemester * i)
    const requiredSemesterGPA = semesterTarget + (incrementPerSemester * 1.2) // Slightly higher to ensure progress
    
    const achievable = requiredSemesterGPA <= 5.0

    milestones.push({
      semester: i,
      targetGPA: Math.min(requiredSemesterGPA, 5.0),
      description: achievable
        ? `Maintain ${requiredSemesterGPA.toFixed(2)} GPA to reach ${semesterTarget.toFixed(2)} CGPA`
        : `Target may require maximum effort - aim for highest possible GPA`,
      achievable
    })
  }

  return milestones
}
