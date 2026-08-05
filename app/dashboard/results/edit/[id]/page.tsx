"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Save, Loader2, Trash2 } from "lucide-react"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Course {
  _id: string
  code: string
  title: string
  creditUnits: number
}

interface Result {
  _id: string
  courseId: string
  score: number
  grade: string
  gradePoint: number
  creditUnits: number
  semester: number
  level: number
  course: Course
}

export default function EditResultPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  // Form state
  const [courseCode, setCourseCode] = useState("")
  const [courseTitle, setCourseTitle] = useState("")
  const [creditUnits, setCreditUnits] = useState(0)
  const [score, setScore] = useState(0)

  useEffect(() => {
    fetchResult()
  }, [params.id])

  const fetchResult = async () => {
    try {
      const res = await fetch(`/api/results/${params.id}`)
      if (!res.ok) {
        throw new Error("Failed to fetch result")
      }
      const data: Result = await res.json()
      
      setCourseCode(data.course.code)
      setCourseTitle(data.course.title)
      setCreditUnits(data.creditUnits)
      setScore(data.score)
      
      setLoading(false)
    } catch (err: any) {
      setError(err.message || "Failed to load result")
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    setSuccess("")

    try {
      // Validate
      if (!courseCode || !courseTitle) {
        throw new Error("Course code and title are required")
      }
      if (creditUnits < 1 || creditUnits > 6) {
        throw new Error("Credit units must be between 1 and 6")
      }
      if (score < 0 || score > 100) {
        throw new Error("Score must be between 0 and 100")
      }

      // Update result (score will auto-calculate grade)
      const resultRes = await fetch(`/api/results/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          score,
          creditUnits
        })
      })

      if (!resultRes.ok) {
        const data = await resultRes.json()
        throw new Error(data.error || "Failed to update result")
      }

      const result = await resultRes.json()

      // Update course details
      const courseRes = await fetch(`/api/courses/${result.courseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: courseCode.toUpperCase(),
          title: courseTitle,
          creditUnits
        })
      })

      if (!courseRes.ok) {
        // Course update failed but result succeeded
        console.warn("Course update failed")
      }

      setSuccess("Result updated successfully!")
      setTimeout(() => {
        router.push("/dashboard/results")
      }, 1500)
    } catch (err: any) {
      setError(err.message || "Failed to update result")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    setError("")

    try {
      const res = await fetch(`/api/results/${params.id}`, {
        method: "DELETE"
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to delete result")
      }

      router.push("/dashboard/results")
    } catch (err: any) {
      setError(err.message || "Failed to delete result")
      setDeleting(false)
      setDeleteDialogOpen(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link href="/dashboard/results">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Results
          </Button>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold">Edit Result</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Update course details and score
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-4 bg-green-50 text-green-900 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Course Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="courseCode">Course Code</Label>
              <Input
                id="courseCode"
                type="text"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                placeholder="e.g., CSC 301"
                required
                className="uppercase"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="courseTitle">Course Title</Label>
              <Input
                id="courseTitle"
                type="text"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                placeholder="e.g., Data Structures and Algorithms"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="creditUnits">Credit Units</Label>
                <Input
                  id="creditUnits"
                  type="number"
                  min="1"
                  max="6"
                  value={creditUnits}
                  onChange={(e) => setCreditUnits(Number(e.target.value))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="score">Score (%)</Label>
                <Input
                  id="score"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={score}
                  onChange={(e) => setScore(Number(e.target.value))}
                  required
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                className="flex-1"
                disabled={saving || deleting}
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="destructive"
                onClick={() => setDeleteDialogOpen(true)}
                disabled={saving || deleting}
              >
                {deleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="mt-4">
        <CardContent className="p-4">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            <strong>Note:</strong> Changing the score will automatically recalculate the grade and grade point. 
            Your CGPA and semester GPA will be updated accordingly.
          </p>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Result</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this result for <strong>{courseCode} - {courseTitle}</strong>?
              <br /><br />
              This action cannot be undone. Your CGPA will be recalculated automatically.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
