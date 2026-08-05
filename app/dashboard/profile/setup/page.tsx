"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function ProfileSetupPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [faculties, setFaculties] = useState<any[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [programmes, setProgrammes] = useState<any[]>([])
  
  const [formData, setFormData] = useState({
    matricNumber: "",
    facultyId: "",
    departmentId: "",
    programmeId: "",
    level: "100",
    currentSession: "2023/2024",
    currentSemester: "1",
    admissionYear: new Date().getFullYear().toString(),
    targetCGPA: ""
  })

  useEffect(() => {
    fetchFaculties()
  }, [])

  useEffect(() => {
    if (formData.facultyId) {
      fetchDepartments(formData.facultyId)
    }
  }, [formData.facultyId])

  useEffect(() => {
    if (formData.departmentId) {
      fetchProgrammes(formData.departmentId)
    }
  }, [formData.departmentId])

  const fetchFaculties = async () => {
    try {
      const response = await fetch("/api/faculties")
      if (response.ok) {
        const data = await response.json()
        setFaculties(data)
      }
    } catch (error) {
      console.error("Failed to fetch faculties", error)
    }
  }

  const fetchDepartments = async (facultyId: string) => {
    try {
      const response = await fetch(`/api/departments?facultyId=${facultyId}`)
      if (response.ok) {
        const data = await response.json()
        setDepartments(data)
      }
    } catch (error) {
      console.error("Failed to fetch departments", error)
    }
  }

  const fetchProgrammes = async (departmentId: string) => {
    try {
      const response = await fetch(`/api/programmes?departmentId=${departmentId}`)
      if (response.ok) {
        const data = await response.json()
        setProgrammes(data)
      }
    } catch (error) {
      console.error("Failed to fetch programmes", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/student/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          level: parseInt(formData.level),
          currentSemester: parseInt(formData.currentSemester),
          admissionYear: parseInt(formData.admissionYear),
          targetCGPA: formData.targetCGPA ? parseFloat(formData.targetCGPA) : null
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to save profile")
      }

      toast.success("Profile created successfully")
      router.push("/dashboard")
    } catch (error: any) {
      toast.error(error.message || "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>
            Please provide your academic information to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="matricNumber">Matric Number</Label>
              <Input
                id="matricNumber"
                placeholder="e.g., 20/12345"
                value={formData.matricNumber}
                onChange={(e) => setFormData({ ...formData, matricNumber: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="facultyId">Faculty</Label>
              <Select
                value={formData.facultyId}
                onValueChange={(value) => setFormData({ ...formData, facultyId: value, departmentId: "", programmeId: "" })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Faculty" />
                </SelectTrigger>
                <SelectContent>
                  {faculties.map((faculty) => (
                    <SelectItem key={faculty._id.toString()} value={faculty._id}>
                      {faculty.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="departmentId">Department</Label>
              <Select
                value={formData.departmentId}
                onValueChange={(value) => setFormData({ ...formData, departmentId: value, programmeId: "" })}
                disabled={!formData.facultyId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept._id.toString()} value={dept._id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="programmeId">Programme</Label>
              <Select
                value={formData.programmeId}
                onValueChange={(value) => setFormData({ ...formData, programmeId: value })}
                disabled={!formData.departmentId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Programme" />
                </SelectTrigger>
                <SelectContent>
                  {programmes.map((prog) => (
                    <SelectItem key={prog._id.toString()} value={prog._id}>
                      {prog.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="level">Level</Label>
                <Select
                  value={formData.level}
                  onValueChange={(value) => setFormData({ ...formData, level: value })}
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
                <Label htmlFor="currentSemester">Current Semester</Label>
                <Select
                  value={formData.currentSemester}
                  onValueChange={(value) => setFormData({ ...formData, currentSemester: value })}
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
                onChange={(e) => setFormData({ ...formData, currentSession: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, admissionYear: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, targetCGPA: e.target.value })}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
