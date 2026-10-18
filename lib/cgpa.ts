/**
 * Calculates the cumulative GPA from a list of results, deduplicating by courseId.
 * When a course appears more than once (e.g., a carryover retake), only the entry
 * with the highest gradePoint is counted.
 */
export function calculateCGPA(
  results: Array<{ courseId: string; gradePoint: number; creditUnits: number }>
): number {
  // Deduplicate by courseId, keeping the highest gradePoint entry
  const best = new Map<string, { gradePoint: number; creditUnits: number }>()

  for (const result of results) {
    const existing = best.get(result.courseId)
    if (!existing || result.gradePoint > existing.gradePoint) {
      best.set(result.courseId, {
        gradePoint: result.gradePoint,
        creditUnits: result.creditUnits
      })
    }
  }

  let totalQualityPoints = 0
  let totalCredits = 0

  for (const entry of best.values()) {
    totalQualityPoints += entry.gradePoint * entry.creditUnits
    totalCredits += entry.creditUnits
  }

  return totalCredits === 0 ? 0 : totalQualityPoints / totalCredits
}
