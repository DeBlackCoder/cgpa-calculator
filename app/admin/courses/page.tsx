"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, BookOpen, ShieldAlert } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
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

interface Department {
  _id: string
  name: string
  code: string
  facultyId: string
}

interface Course {
  _id: string
  code: string
  title: string
  creditUnits: number
  level: number
  semester: number
  departmentId: string
  description?: string
  isElective: boolean
  createdAt: string
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [authorized, setAuthorized] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  const [formData, setFormData] = useState({
    code: "",
    title: "",
    creditUnits: 3,
    level: 100,
    semester: 1,
    departmentId: "",
    description: "",
    isElective: false
  })

  useEffect(() => {
    checkAuthorization()
  }, [])

  async function checkAuthorization() {
    try {
      const res = await fetch("/api/admin/check-super-admin")
      if (res.ok) {
        const data = await res.json()
        if (data.isSuperAdmin) {
          setAuthorized(true)
          fetchData()
        } else {
          setAuthorized(false)
          setLoading(false)
        }
      } else {
        setAuthorized(false)
        setLoading(false)
      }
    } catch (error) {
      setAuthorized(false)
      setLoading(false)
    }
  }

  async function fetchData() {
    try {
      const [coursesRes, deptsRes] = await Promise.all([
        fetch("/api/courses"),
        fetch("/api/departments")
      ])

      if (coursesRes.ok) {
        const data = await coursesRes.json()
        setCourses(data)
      }

      if (deptsRes.ok) {
        const data = await deptsRes.json()
        setDepartments(data)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (!formData.departmentId) {
      toast({
        title: "Error",
        description: "Please select a department",
        variant: "destructive"
      })
      return
    }

    try {
      const url = editingId ? `/api/courses/${editingId}` : "/api/courses"
      const method = editingId ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        toast({
          title: "Success",
          description: editingId ? "Course updated successfully" : "Course created successfully"
        })
        
        setFormData({
          code: "",
          title: "",
          creditUnits: 3,
          level: 100,
          semester: 1,
          departmentId: "",
          description: "",
          isElective: false
        })
        setIsCreating(false)
        setEditingId(null)
        fetchData()
      } else {
        const data = await res.json()
        toast({
          title: "Error",
          description: data.error || "Failed to save course",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred",
        variant: "destructive"
      })
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/courses/${id}`, { method: "DELETE" })
      
      if (res.ok) {
        toast({
          title: "Success",
          description: "Course deleted successfully"
        })
        fetchData()
      } else {
        const data = await res.json()
        toast({
          title: "Error",
          description: data.error || "Failed to delete course",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred",
        variant: "destructive"
      })
    } finally {
      setDeleteDialogOpen(false)
      setSelectedCourse(null)
    }
  }

  function confirmDelete(course: Course) {
    setSelectedCourse(course)
    setDeleteDialogOpen(true)
  }

  function startEdit(course: Course) {
    setFormData({
      code: course.code,
      title: course.title,
      creditUnits: course.creditUnits,
      level: course.level,
      semester: course.semester,
      departmentId: course.departmentId,
      description: course.description || "",
      isElective: course.isElective
    })
    setEditingId(course._id)
    setIsCreating(true)
  }

  function cancelEdit() {
    setFormData({
      code: "",
      title: "",
      creditUnits: 3,
      level: 100,
      semester: 1,
      departmentId: "",
      description: "",
      isElective: false
    })
    setIsCreating(false)
    setEditingId(null)
  }

  // Group courses by level
  const coursesByLevel = [100, 200, 300, 400, 500].map(level => ({
    level,
    courses: courses.filter(course => course.level === level)
  }))

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  if (!authorized) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ShieldAlert className="h-16 w-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-gray-600 text-center mb-6">
              Only super admins can manage courses.
            </p>
            <Button onClick={() => router.push('/admin')}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Courses Management</h1>
          <p className="text-sm text-gray-600">
            Manage courses across all departments
          </p>
        </div>
        {!isCreating && (
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Course
          </Button>
        )}
      </div>

      {/* Create/Edit Form */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Course" : "Create New Course"}</CardTitle>
            <CardDescription>
              {editingId ? "Update course information" : "Add a new course to a department"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Course Code *</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="e.g., CSC 301"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Course Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Data Structures"
                    required
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="creditUnits">Credit Units *</Label>
                  <Select
                    value={formData.creditUnits.toString()}
                    onValueChange={(value) => setFormData({ ...formData, creditUnits: Number(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6].map(unit => (
                        <SelectItem key={unit} value={unit.toString()}>{unit}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="level">Level *</Label>
                  <Select
                    value={formData.level.toString()}
                    onValueChange={(value) => setFormData({ ...formData, level: Number(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[100, 200, 300, 400, 500, 600, 700, 800, 900].map(lvl => (
                        <SelectItem key={lvl} value={lvl.toString()}>{lvl}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="semester">Semester *</Label>
                  <Select
                    value={formData.semester.toString()}
                    onValueChange={(value) => setFormData({ ...formData, semester: Number(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1st</SelectItem>
                      <SelectItem value="2">2nd</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="isElective">Type *</Label>
                  <Select
                    value={formData.isElective.toString()}
                    onValueChange={(value) => setFormData({ ...formData, isElective: value === "true" })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="false">Core</SelectItem>
                      <SelectItem value="true">Elective</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Select
                  value={formData.departmentId}
                  onValueChange={(value) => setFormData({ ...formData, departmentId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept._id.toString()} value={dept._id}>
                        {dept.name} ({dept.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the course"
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  {editingId ? "Update Course" : "Create Course"}
                </Button>
                <Button type="button" variant="outline" onClick={cancelEdit}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Courses List - Grouped by Level */}
      {coursesByLevel.map(({ level, courses: levelCourses }) => (
        levelCourses.length > 0 && (
          <div key={level} className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{level} Level</h2>
                <p className="text-xs text-gray-500">{levelCourses.length} courses</p>
              </div>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {levelCourses.map((course) => (
                <Card key={course._id.toString()}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base">{course.title}</CardTitle>
                        <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded inline-block mt-1">
                          {course.code}
                        </code>
                      </div>
                      {course.isElective && (
                        <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 px-2 py-0.5 rounded">
                          Elective
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Credit Units:</span>
                      <span className="font-medium">{course.creditUnits}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Semester:</span>
                      <span className="font-medium">{course.semester}</span>
                    </div>
                    {course.description && (
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {course.description}
                      </p>
                    )}
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startEdit(course)}
                        className="flex-1"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => confirmDelete(course)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )
      ))}

      {courses.length === 0 && !isCreating && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">No courses found</p>
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Course
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Course</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{selectedCourse?.code} - {selectedCourse?.title}</strong>?
              <br /><br />
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedCourse && handleDelete(selectedCourse._id)}
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
