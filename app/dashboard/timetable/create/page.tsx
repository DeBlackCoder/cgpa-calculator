"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"
import Link from "next/link"

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

interface TimeSlot {
  day: string
  startTime: string
  endTime: string
  courseCode: string
  courseTitle: string
  venue: string
  lecturer?: string
}

export default function CreateTimetablePage() {
  const router = useRouter()
  const [semester, setSemester] = useState("2024/2025 - First Semester")
  const [slots, setSlots] = useState<TimeSlot[]>([{
    day: 'Monday',
    startTime: '08:00',
    endTime: '10:00',
    courseCode: '',
    courseTitle: '',
    venue: '',
    lecturer: ''
  }])
  const [loading, setLoading] = useState(false)

  const addSlot = () => {
    setSlots([...slots, {
      day: 'Monday',
      startTime: '08:00',
      endTime: '10:00',
      courseCode: '',
      courseTitle: '',
      venue: '',
      lecturer: ''
    }])
  }

  const removeSlot = (index: number) => {
    setSlots(slots.filter((_, i) => i !== index))
  }

  const updateSlot = (index: number, field: keyof TimeSlot, value: string) => {
    const newSlots = [...slots]
    newSlots[index] = { ...newSlots[index], [field]: value }
    setSlots(newSlots)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/timetable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          semester,
          slots: slots.filter(s => s.courseCode && s.courseTitle && s.venue),
          isPublic: false
        })
      })

      if (res.ok) {
        router.push('/dashboard/timetable')
      } else {
        alert('Failed to create timetable')
      }
    } catch (error) {
      console.error('Error creating timetable:', error)
      alert('Failed to create timetable')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/timetable">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Create Timetable
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Add your class schedule for the semester
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Semester Input */}
        <Card>
          <CardHeader>
            <CardTitle>Semester Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="semester">Semester</Label>
              <Input
                id="semester"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                placeholder="e.g., 2024/2025 - First Semester"
                className="mt-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Time Slots */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Class Schedule</CardTitle>
            <Button type="button" onClick={addSlot} size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Class
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {slots.map((slot, index) => (
              <div key={index} className="p-4 border-2 border-gray-200 rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-900">Class {index + 1}</h3>
                  {slots.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSlot(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`courseCode-${index}`}>Course Code *</Label>
                    <Input
                      id={`courseCode-${index}`}
                      value={slot.courseCode}
                      onChange={(e) => updateSlot(index, 'courseCode', e.target.value)}
                      placeholder="e.g., CSC301"
                      required
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`courseTitle-${index}`}>Course Title *</Label>
                    <Input
                      id={`courseTitle-${index}`}
                      value={slot.courseTitle}
                      onChange={(e) => updateSlot(index, 'courseTitle', e.target.value)}
                      placeholder="e.g., Algorithm Analysis"
                      required
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`day-${index}`}>Day *</Label>
                    <select
                      id={`day-${index}`}
                      value={slot.day}
                      onChange={(e) => updateSlot(index, 'day', e.target.value)}
                      className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      required
                    >
                      {DAYS.map(day => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor={`venue-${index}`}>Venue *</Label>
                    <Input
                      id={`venue-${index}`}
                      value={slot.venue}
                      onChange={(e) => updateSlot(index, 'venue', e.target.value)}
                      placeholder="e.g., LT1, Lab 3"
                      required
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`startTime-${index}`}>Start Time *</Label>
                    <Input
                      id={`startTime-${index}`}
                      type="time"
                      value={slot.startTime}
                      onChange={(e) => updateSlot(index, 'startTime', e.target.value)}
                      required
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`endTime-${index}`}>End Time *</Label>
                    <Input
                      id={`endTime-${index}`}
                      type="time"
                      value={slot.endTime}
                      onChange={(e) => updateSlot(index, 'endTime', e.target.value)}
                      required
                      className="mt-2"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor={`lecturer-${index}`}>Lecturer (Optional)</Label>
                    <Input
                      id={`lecturer-${index}`}
                      value={slot.lecturer}
                      onChange={(e) => updateSlot(index, 'lecturer', e.target.value)}
                      placeholder="e.g., Dr. Smith"
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? 'Creating...' : 'Create Timetable'}
          </Button>
          <Link href="/dashboard/timetable">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
