"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface Faculty {
  _id: string
  name: string
  code: string
}

interface Department {
  _id: string
  name: string
  code: string
}

interface Programme {
  _id: string
  name: string
}

export default function EditProfilePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)

  const [faculties, setFaculties] = useState<Faculty[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [programmes, setProgrammes] = useState<Programme[]>([])

  const [formData, setFormData] = useState({
    name: "",
    matricNumber: "",
    facultyId: "",
    departmentId: "",
    programmeId: "",
    level: "100",
    currentSession: "",
    currentSemester: "1",
    admissionYear: "",
    targetCGPA: "",
  })

  // Load current profile data
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/student/profile")
        if (!res.ok) throw new Error("Failed to load profile")
        const data = await res.json()

        if (!data) {
          router.push("/dashboard/profile/setup")
          return
        }

        setFormData({
          name: data.user?.name ?? "",
          matricNumber: data.matricNumber ?? "",
          facultyId: data.facultyId ?? "",
          departmentId: data.departmentId ?? "",
          programmeId: data.programmeId ?? "",
          level: String(data.level ?? "100"),
          currentSession: data.currentSession ?? "",
          currentSemester: String(data.currentSemester ?? "1"),
          admissionYear: String(data.admissionYear ?? ""),
          targetCGPA: data.targetCGPA != null ? String(data.targetCGPA) : "",
        })

        // Load dependent dropdowns for whatever faculty/dept is already set
        if (data.facultyId) await fetchDepartments(data.facultyId)
        if (data.departmentId) await fetchProgrammes(data.departmentId)
      } catch (err) {
        toast.error("Could not load profile data")
      } finally {
        setIsFetching(false)
      }
    }

    fetchFaculties()
    loadProfile()
  }, [])

  // Re-fetch departments when faculty changes
  useEffect(() => {
    if (!formData.facultyId) {
      setDepartments([])
      setProgrammes([])
      return
    }
    fetchDepartments(formData.facultyId)
  }, [formData.facultyId])

  // Re-fetch programmes when department changes
  useEffect(() => {
    if (!formData.departmentId) {
      setProgrammes([])
      return
    }
    fetchProgrammes(formData.departmentId)
  }, [formData.departmentId])

  const fetchFaculties = async () => {
    try {
      const res = await fetch("/api/faculties")
      if (res.ok) setFaculties(await res.json())
    } catch {
      console.error("Failed to fetch faculties")
    }
  }

  const fetchDepartments = async (facultyId: string) => {
    try {
      const res = await fetch(`/api/departments?facultyId=${facultyId}`)
      if (res.ok) setDepartments(await res.json())
    } catch {
      console.error("Failed to fetch departments")
    }
  }

  const fetchProgrammes = async (departmentId: string) => {
    try {
      const res = await fetch(`/api/programmes?departmentId=${departmentId}`)
      if (res.ok) setProgrammes(await res.json())
    } catch {
      console.error("Failed to fetch programmes")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Update name via user profile endpoint
      const nameRes = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name }),
      })
      if (!nameRes.ok) {
        const data = await nameRes.json()
        throw new Error(data.error || "Failed to update name")
      }

      // Update student academic info
      const studentRes = await fetch("/api/student/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matricNumber: formData.matricNumber,
          facultyId: formData.facultyId,
          departmentId: formData.departmentId,
          programmeId: formData.programmeId,
          level: parseInt(formData.level),
          currentSession: formData.currentSession,
          currentSemester: parseInt(formData.currentSemester),
          admissionYear: parseInt(formData.admissionYear),
          targetCGPA: formData.targetCGPA ? parseFloat(formData.targetCGPA) : null,
        }),
      })

      if (!studentRes.ok) {
        const data = await studentRes.json()
        throw new Error(data.error || "Failed to update profile")
      }

      toast.success("Profile updated successfully")
      router.push("/dashboard/profile")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard/profile">
          <Button variant="ghost" size="icon" aria-label="Back to profile">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Edit Profile</h1>
          <p className="text-sm text-gray-500">Update your personal and academic information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Your basic account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Your full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                minLength={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="matricNumber">Matric Number</Label>
              <Input
                id="matricNumber"
                placeholder="e.g., 20/12345"
                value={formData.matricNumber}
                onChange={(e) =>
                  setFormData({ ...formData, matricNumber: e.target.value })
                }
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Academic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Academic Information</CardTitle>
            <CardDescription>Your faculty, department, and programme details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Faculty</Label>
              <Select
                value={formData.facultyId}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    facultyId: value,
                    departmentId: "",
                    programmeId: "",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Faculty" />
                </SelectTrigger>
                <SelectContent>
                  {faculties.map((f) => (
                    <SelectItem key={f._id} value={f._id}>
                      {f.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Department</Label>
              <Select
                value={formData.departmentId}
                onValueChange={(value) =>
                  setFormData({ ...formData, departmentId: value, programmeId: "" })
                }
                disabled={!formData.facultyId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((d) => (
                    <SelectItem key={d._id} value={d._id}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Programme</Label>
              <Select
                value={formData.programmeId}
                onValueChange={(value) =>
                  setFormData({ ...formData, programmeId: value })
                }
                disabled={!formData.departmentId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Programme" />
                </SelectTrigger>
                <SelectContent>
                  {programmes.map((p) => (
                    <SelectItem key={p._id} value={p._id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Level</Label>
                <Select
                  value={formData.level}
                  onValueChange={(value) => setFormData({ ...formData, level: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Level" />
                  </SelectTrigger>
                  <SelectContent>
                    {[100, 200, 300, 400, 500].map((l) => (
                      <SelectItem key={l} value={String(l)}>
                        {l} Level
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Current Semester</Label>
                <Select
                  value={formData.currentSemester}
                  onValueChange={(value) =>
                    setFormData({ ...formData, currentSemester: value })
                  }
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
              <Label htmlFor="currentSession">Current Session</Label>
              <Input
                id="currentSession"
                placeholder="e.g., 2023/2024"
                value={formData.currentSession}
                onChange={(e) =>
                  setFormData({ ...formData, currentSession: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="admissionYear">Admission Year</Label>
              <Input
                id="admissionYear"
                type="number"
                placeholder="e.g., 2020"
                value={formData.admissionYear}
                onChange={(e) =>
                  setFormData({ ...formData, admissionYear: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetCGPA">Target CGPA (Optional)</Label>
              <Input
                id="targetCGPA"
                type="number"
                step="0.01"
                min="0"
                max="5"
                placeholder="e.g., 4.5"
                value={formData.targetCGPA}
                onChange={(e) =>
                  setFormData({ ...formData, targetCGPA: e.target.value })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
          <Link href="/dashboard/profile" className="flex-1">
            <Button type="button" variant="outline" className="w-full">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
