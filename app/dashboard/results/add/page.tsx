"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function AddResultPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [courses, setCourses] = useState<any[]>([])
  const [sessions, setSessions] = useState<any[]>([])
  const [profile, setProfile] = useState<any>(null)

  const [formData, setFormData] = useState({
    courseId: "",
    sessionId: "",
    semester: "",
    level: "",
    score: ""
  })

  useEffect(() => {
    fetchProfile()
    fetchSessions()
  }, [])

  useEffect(() => {
    if (formData.level && formData.semester && profile) {
      fetchCourses(profile.departmentId, formData.level, formData.semester)
    }
  }, [formData.level, formData.semester, profile])

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/student/profile")
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
        setFormData(prev => ({
          ...prev,
          level: data.level.toString(),
          semester: data.currentSemester.toString()
        }))
      }
    } catch (error) {
      console.error("Failed to fetch profile", error)
    }
  }

  const fetchSessions = async () => {
    try {
      const response = await fetch("/api/sessions")
      if (response.ok) {
        const data = await response.json()
        setSessions(data)
        // Set current session as default
        const current = data.find((s: any) => s.isCurrent)
        if (current) {
          setFormData(prev => ({ ...prev, sessionId: current._id }))
        }
      }
    } catch (error) {
      console.error("Failed to fetch sessions", error)
    }
  }

  const fetchCourses = async (departmentId: string, level: string, semester: string) => {
    try {
      const response = await fetch(
        `/api/courses?departmentId=${departmentId}&level=${level}&semester=${semester}`
      )
      if (response.ok) {
        const data = await response.json()
        setCourses(data)
      }
    } catch (error) {
      console.error("Failed to fetch courses", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.courseId || !formData.sessionId || !formData.score) {
      toast.error("Please fill all required fields")
      return
    }

    const score = parseFloat(formData.score)
    if (score < 0 || score > 100) {
      toast.error("Score must be between 0 and 100")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: formData.courseId,
          sessionId: formData.sessionId,
          semester: parseInt(formData.semester),
          level: parseInt(formData.level),
          score
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to add result")
      }

      toast.success("Result added successfully")
      router.push("/dashboard/results")
    } catch (error: any) {
      toast.error(error.message || "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const selectedCourse = courses.find(c => c.id === formData.courseId)
  const score = parseFloat(formData.score)
  const previewGrade = !isNaN(score) ? (
    score >= 70 ? "A (5.0)" :
    score >= 60 ? "B (4.0)" :
    score >= 50 ? "C (3.0)" :
    score >= 45 ? "D (2.0)" :
    score >= 40 ? "E (1.0)" :
    "F (0.0)"
  ) : null

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/dashboard/results">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Results
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Result</CardTitle>
          <CardDescription>
            Enter your course result details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="level">Level</Label>
                <Select
                  value={formData.level}
                  onValueChange={(value) => setFormData({ ...formData, level: value, courseId: "" })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="100">100 Level</SelectItem>
                    <SelectItem value="200">200 Level</SelectItem>
                    <SelectItem value="300">300 Level</SelectItem>
                    <SelectItem value="400">400 Level</SelectItem>
                    <SelectItem value="500">500 Level</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="semester">Semester</Label>
                <Select
                  value={formData.semester}
                  onValueChange={(value) => setFormData({ ...formData, semester: value, courseId: "" })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">First Semester</SelectItem>
                    <SelectItem value="2">Second Semester</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sessionId">Academic Session</Label>
              <Select
                value={formData.sessionId}
                onValueChange={(value) => setFormData({ ...formData, sessionId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Session" />
                </SelectTrigger>
                <SelectContent>
                  {sessions.map((session) => (
                    <SelectItem key={session._id.toString()} value={session._id}>
                      {session.name} {session.isCurrent && "(Current)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="courseId">Course</Label>
              <Select
                value={formData.courseId}
                onValueChange={(value) => setFormData({ ...formData, courseId: value })}
                disabled={!formData.level || !formData.semester}
              >
                <SelectTrigger>
                  <SelectValue placeholder={
                    !formData.level || !formData.semester 
                      ? "Select level and semester first" 
                      : "Select Course"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course._id.toString()} value={course._id}>
                      {course.code} - {course.title} ({course.creditUnits} units)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {courses.length === 0 && formData.level && formData.semester && (
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  No courses found. Contact admin to add courses for this level.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="score">Score (%)</Label>
              <Input
                id="score"
                type="number"
                min="0"
                max="100"
                step="0.01"
                placeholder="e.g., 75.5"
                value={formData.score}
                onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                required
              />
            </div>

            {/* Preview */}
            {selectedCourse && previewGrade && (
              <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg space-y-2">
                <h4 className="font-medium text-sm">Preview</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-zinc-600 dark:text-zinc-400">Course</p>
                    <p className="font-medium">{selectedCourse.title}</p>
                  </div>
                  <div>
                    <p className="text-zinc-600 dark:text-zinc-400">Credit Units</p>
                    <p className="font-medium">{selectedCourse.creditUnits}</p>
                  </div>
                  <div>
                    <p className="text-zinc-600 dark:text-zinc-400">Score</p>
                    <p className="font-medium">{formData.score}%</p>
                  </div>
                  <div>
                    <p className="text-zinc-600 dark:text-zinc-400">Grade</p>
                    <p className="font-medium">{previewGrade}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? "Adding Result..." : "Add Result"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
