"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit, Trash2, GraduationCap, ShieldAlert } from "lucide-react"
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

interface Faculty {
  _id: string
  name: string
  code: string
  description?: string
  createdAt: string
}

export default function FacultiesPage() {
  const [faculties, setFaculties] = useState<Faculty[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [authorized, setAuthorized] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: "",
    code: "",
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
          fetchFaculties()
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

  async function fetchFaculties() {
    try {
      const res = await fetch("/api/faculties")
      if (res.ok) {
        const data = await res.json()
        setFaculties(data)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load faculties",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    try {
      const url = editingId ? `/api/faculties/${editingId}` : "/api/faculties"
      const method = editingId ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        toast({
          title: "Success",
          description: editingId ? "Faculty updated successfully" : "Faculty created successfully"
        })
        
        setFormData({ name: "", code: "", description: "" })
        setIsCreating(false)
        setEditingId(null)
        fetchFaculties()
      } else {
        const data = await res.json()
        toast({
          title: "Error",
          description: data.error || "Failed to save faculty",
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
      const res = await fetch(`/api/faculties/${id}`, { method: "DELETE" })
      
      if (res.ok) {
        toast({
          title: "Success",
          description: "Faculty deleted successfully"
        })
        fetchFaculties()
      } else {
        const data = await res.json()
        toast({
          title: "Error",
          description: data.error || "Failed to delete faculty",
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
      setSelectedFaculty(null)
    }
  }

  function confirmDelete(faculty: Faculty) {
    setSelectedFaculty(faculty)
    setDeleteDialogOpen(true)
  }

  function startEdit(faculty: Faculty) {
    setFormData({
      name: faculty.name,
      code: faculty.code,
      description: faculty.description || ""
    })
    setEditingId(faculty._id)
    setIsCreating(true)
  }

  function cancelEdit() {
    setFormData({ name: "", code: "", description: "" })
    setIsCreating(false)
    setEditingId(null)
  }

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
              Only super admins can manage faculties. This ensures site-wide settings are controlled by authorized personnel only.
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
          <h1 className="text-2xl sm:text-3xl font-bold">Faculties Management</h1>
          <p className="text-sm text-gray-600">
            Manage university faculties
          </p>
        </div>
        {!isCreating && (
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Faculty
          </Button>
        )}
      </div>

      {/* Create/Edit Form */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Faculty" : "Create New Faculty"}</CardTitle>
            <CardDescription>
              {editingId ? "Update faculty information" : "Add a new faculty to the system"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Faculty Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Faculty of Science"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Faculty Code *</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="e.g., SCI"
                    maxLength={10}
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
                  placeholder="Brief description of the faculty"
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">
                  {editingId ? "Update Faculty" : "Create Faculty"}
                </Button>
                <Button type="button" variant="outline" onClick={cancelEdit}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Faculties List */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {faculties.map((faculty) => (
          <Card key={faculty._id.toString()}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                    <GraduationCap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{faculty.name}</CardTitle>
                    <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                      {faculty.code}
                    </code>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {faculty.description && (
                <p className="text-sm text-gray-600 mb-4">
                  {faculty.description}
                </p>
              )}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => startEdit(faculty)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => confirmDelete(faculty)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {faculties.length === 0 && !isCreating && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <GraduationCap className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">No faculties found</p>
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Faculty
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Faculty</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{selectedFaculty?.name}</strong>?
              <br /><br />
              This action cannot be undone. This will also affect all departments under this faculty.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedFaculty && handleDelete(selectedFaculty._id)}
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
