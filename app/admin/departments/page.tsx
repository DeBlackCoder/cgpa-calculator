"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { Plus, Edit, Trash2, Building2, ShieldAlert, MoveRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Faculty {
  _id: string
  name: string
  code: string
}

interface Department {
  _id: string
  name: string
  code: string
  description?: string
  facultyId: string
  faculty?: Faculty
  createdAt: string
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [faculties, setFaculties] = useState<Faculty[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [authorized, setAuthorized] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [moveDialogOpen, setMoveDialogOpen] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null)
  const [newFacultyId, setNewFacultyId] = useState("")
  const { toast } = useToast()
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    facultyId: "",
    description: ""
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
      const [deptsRes, facultiesRes] = await Promise.all([
        fetch("/api/departments"),
        fetch("/api/faculties")
      ])

      if (deptsRes.ok) {
        const data = await deptsRes.json()
        setDepartments(data)
      }

      if (facultiesRes.ok) {
        const data = await facultiesRes.json()
        setFaculties(data)
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
    
    if (!formData.facultyId) {
      toast({
        title: "Error",
        description: "Please select a faculty",
        variant: "destructive"
      })
      return
    }

    try {
      const url = editingId ? `/api/departments/${editingId}` : "/api/departments"
      const method = editingId ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        toast({
          title: "Success",
          description: editingId ? "Department updated successfully" : "Department created successfully"
        })
        
        setFormData({ name: "", code: "", facultyId: "", description: "" })
        setIsCreating(false)
        setEditingId(null)
        fetchData()
      } else {
        const data = await res.json()
        toast({
          title: "Error",
          description: data.error || "Failed to save department",
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
      const res = await fetch(`/api/departments/${id}`, { method: "DELETE" })
      
      if (res.ok) {
        toast({
          title: "Success",
          description: "Department deleted successfully"
        })
        fetchData()
      } else {
        const data = await res.json()
        toast({
          title: "Error",
          description: data.error || "Failed to delete department",
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
      setSelectedDepartment(null)
    }
  }

  function confirmDelete(department: Department) {
    setSelectedDepartment(department)
    setDeleteDialogOpen(true)
  }

  function startEdit(department: Department) {
    setFormData({
      name: department.name,
      code: department.code,
      facultyId: department.facultyId,
      description: department.description || ""
    })
    setEditingId(department._id)
    setIsCreating(true)
  }

  function cancelEdit() {
    setFormData({ name: "", code: "", facultyId: "", description: "" })
    setIsCreating(false)
    setEditingId(null)
  }

  async function handleMoveFaculty(departmentId: string, newFacultyId: string) {
    try {
      const res = await fetch(`/api/departments/${departmentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ facultyId: newFacultyId })
      })

      if (res.ok) {
        toast({
          title: "Success",
          description: "Department moved to new faculty successfully"
        })
        fetchData()
      } else {
        const data = await res.json()
        toast({
          title: "Error",
          description: data.error || "Failed to move department",
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
      setMoveDialogOpen(false)
      setSelectedDepartment(null)
      setNewFacultyId("")
    }
  }

  function confirmMove(department: Department, facultyId: string) {
    setSelectedDepartment(department)
    setNewFacultyId(facultyId)
    setMoveDialogOpen(true)
  }

  // Group departments by faculty
  const departmentsByFaculty = faculties.map(faculty => ({
    faculty,
    departments: departments.filter(dept => dept.facultyId === faculty._id)
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
            <p className="text-zinc-600 dark:text-zinc-400 text-center mb-6">
              Only super admins can manage departments. This ensures site-wide settings are controlled by authorized personnel only.
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
    <div className="p-4 sm:p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Departments Management</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Manage departments under each faculty
          </p>
        </div>
        {!isCreating && (
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Department
          </Button>
        )}
      </div>

      {faculties.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-zinc-400 mb-4" />
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">
              No faculties found. Please create faculties first.
            </p>
            <Button onClick={() => window.location.href = '/admin/faculties'}>
              Go to Faculties
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Form */}
      {isCreating && faculties.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Department" : "Create New Department"}</CardTitle>
            <CardDescription>
              {editingId ? "Update department information" : "Add a new department to a faculty"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Department Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Computer Science"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Department Code *</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="e.g., CSC"
                    maxLength={10}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="faculty">Faculty *</Label>
                <Select
                  value={formData.facultyId}
                  onValueChange={(value) => setFormData({ ...formData, facultyId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a faculty" />
                  </SelectTrigger>
                  <SelectContent>
                    {faculties.map((faculty) => (
                      <SelectItem key={faculty._id} value={faculty._id}>
                        {faculty.name} ({faculty.code})
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
                  placeholder="Brief description of the department"
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">
                  {editingId ? "Update Department" : "Create Department"}
                </Button>
                <Button type="button" variant="outline" onClick={cancelEdit}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Departments List - Grouped by Faculty */}
      {departmentsByFaculty.map(({ faculty, departments }) => (
        departments.length > 0 && (
          <div key={faculty._id} className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{faculty.name}</h2>
                <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                  {faculty.code}
                </code>
              </div>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {departments.map((department) => (
                <Card key={department._id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{department.name}</CardTitle>
                    <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded inline-block w-fit">
                      {department.code}
                    </code>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {department.description && (
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {department.description}
                      </p>
                    )}
                    
                    {/* Quick Move to Faculty */}
                    <div className="space-y-2">
                      <Label className="text-xs font-medium flex items-center gap-1">
                        <MoveRight className="h-3 w-3" />
                        Move to Faculty
                      </Label>
                      <Select
                        value={department.facultyId}
                        onValueChange={(value) => confirmMove(department, value)}
                      >
                        <SelectTrigger className="h-9 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {faculties.map((fac) => (
                            <SelectItem key={fac._id} value={fac._id}>
                              {fac.name} ({fac.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startEdit(department)}
                        className="flex-1"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => confirmDelete(department)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )
      ))}

      {departments.length === 0 && !isCreating && faculties.length > 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-zinc-400 mb-4" />
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">No departments found</p>
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Department
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Department</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{selectedDepartment?.name}</strong>?
              <br /><br />
              This action cannot be undone. This will also affect all programmes under this department.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedDepartment && handleDelete(selectedDepartment._id)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Move Confirmation Dialog */}
      <AlertDialog open={moveDialogOpen} onOpenChange={setMoveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Move Department</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to move <strong>{selectedDepartment?.name}</strong> to{" "}
              <strong>{faculties.find(f => f._id === newFacultyId)?.name}</strong>?
              <br /><br />
              All programmes under this department will remain associated with it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedDepartment && handleMoveFaculty(selectedDepartment._id, newFacultyId)}
            >
              Move Department
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
