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
import { Plus, Edit, Trash2, BookOpen, ShieldAlert, GraduationCap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Department {
  _id: string
  name: string
  code: string
  facultyId: string
}

interface Programme {
  _id: string
  name: string
  code: string
  departmentId: string
  duration: number
  totalCredits: number
  description?: string
  createdAt: string
  department?: Department
}

export default function ProgrammesPage() {
  const [programmes, setProgrammes] = useState<Programme[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [authorized, setAuthorized] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedProgramme, setSelectedProgramme] = useState<Programme | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    departmentId: "",
    duration: "4",
    totalCredits: "120",
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
      const [progsRes, deptsRes] = await Promise.all([
        fetch("/api/programmes"),
        fetch("/api/departments")
      ])

      if (progsRes.ok) {
        const data = await progsRes.json()
        setProgrammes(data)
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
      const url = editingId ? `/api/programmes/${editingId}` : "/api/programmes"
      const method = editingId ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          duration: parseInt(formData.duration),
          totalCredits: parseInt(formData.totalCredits)
        })
      })

      if (res.ok) {
        toast({
          title: "Success",
          description: editingId ? "Programme updated successfully" : "Programme created successfully"
        })
        
        setFormData({
          name: "",
          code: "",
          departmentId: "",
          duration: "4",
          totalCredits: "120",
          description: ""
        })
        setIsCreating(false)
        setEditingId(null)
        fetchData()
      } else {
        const data = await res.json()
        toast({
          title: "Error",
          description: data.error || "Failed to save programme",
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
      const res = await fetch(`/api/programmes/${id}`, { method: "DELETE" })
      
      if (res.ok) {
        toast({
          title: "Success",
          description: "Programme deleted successfully"
        })
        fetchData()
      } else {
        const data = await res.json()
        toast({
          title: "Error",
          description: data.error || "Failed to delete programme",
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
      setSelectedProgramme(null)
    }
  }

  function confirmDelete(programme: Programme) {
    setSelectedProgramme(programme)
    setDeleteDialogOpen(true)
  }

  function startEdit(programme: Programme) {
    setFormData({
      name: programme.name,
      code: programme.code,
      departmentId: programme.departmentId,
      duration: programme.duration.toString(),
      totalCredits: programme.totalCredits.toString(),
      description: programme.description || ""
    })
    setEditingId(programme._id)
    setIsCreating(true)
  }

  function cancelEdit() {
    setFormData({
      name: "",
      code: "",
      departmentId: "",
      duration: "4",
      totalCredits: "120",
      description: ""
    })
    setIsCreating(false)
    setEditingId(null)
  }

  // Group programmes by department
  const programmesByDepartment = departments.map(dept => ({
    department: dept,
    programmes: programmes.filter(prog => prog.departmentId === dept._id)
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
              Only super admins can manage programmes.
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
          <h1 className="text-2xl sm:text-3xl font-bold">Programmes Management</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Manage academic programmes across departments
          </p>
        </div>
        {!isCreating && (
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Programme
          </Button>
        )}
      </div>

      {departments.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <GraduationCap className="h-12 w-12 text-zinc-400 mb-4" />
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">
              No departments found. Please create departments first.
            </p>
            <Button onClick={() => window.location.href = '/admin/departments'}>
              Go to Departments
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Form */}
      {isCreating && departments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Programme" : "Create New Programme"}</CardTitle>
            <CardDescription>
              {editingId ? "Update programme information" : "Add a new programme to a department"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Programme Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Computer Science"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Programme Code *</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="e.g., B.SC-CS"
                    maxLength={20}
                    required
                  />
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
                      <SelectItem key={dept._id} value={dept._id}>
                        {dept.name} ({dept.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (Years) *</Label>
                  <Select
                    value={formData.duration}
                    onValueChange={(value) => setFormData({ ...formData, duration: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 Years</SelectItem>
                      <SelectItem value="4">4 Years</SelectItem>
                      <SelectItem value="5">5 Years</SelectItem>
                      <SelectItem value="6">6 Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="totalCredits">Total Credits *</Label>
                  <Input
                    id="totalCredits"
                    type="number"
                    min="60"
                    max="250"
                    value={formData.totalCredits}
                    onChange={(e) => setFormData({ ...formData, totalCredits: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the programme"
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  {editingId ? "Update Programme" : "Create Programme"}
                </Button>
                <Button type="button" variant="outline" onClick={cancelEdit}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Programmes List - Grouped by Department */}
      {programmesByDepartment.map(({ department, programmes: deptProgs }) => (
        deptProgs.length > 0 && (
          <div key={department._id} className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                <GraduationCap className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{department.name}</h2>
                <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                  {department.code}
                </code>
              </div>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {deptProgs.map((programme) => (
                <Card key={programme._id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{programme.name}</CardTitle>
                    <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded inline-block w-fit">
                      {programme.code}
                    </code>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-zinc-600 dark:text-zinc-400">Duration:</span>
                        <p className="font-medium">{programme.duration} Years</p>
                      </div>
                      <div>
                        <span className="text-zinc-600 dark:text-zinc-400">Credits:</span>
                        <p className="font-medium">{programme.totalCredits}</p>
                      </div>
                    </div>
                    {programme.description && (
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                        {programme.description}
                      </p>
                    )}
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startEdit(programme)}
                        className="flex-1"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => confirmDelete(programme)}
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

      {programmes.length === 0 && !isCreating && departments.length > 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <GraduationCap className="h-12 w-12 text-zinc-400 mb-4" />
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">No programmes found</p>
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Programme
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Programme</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{selectedProgramme?.name}</strong>?
              <br /><br />
              This action cannot be undone. This will affect all students enrolled in this programme.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedProgramme && handleDelete(selectedProgramme._id)}
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
