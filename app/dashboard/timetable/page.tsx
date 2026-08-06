"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Calendar as CalendarIcon } from "lucide-react"
import Link from "next/link"

interface TimeSlot {
  day: string
  startTime: string
  endTime: string
  courseCode: string
  courseTitle: string
  venue: string
  lecturer?: string
  color?: string
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00', 
  '13:00', '14:00', '15:00', '16:00', '17:00'
]

export default function TimetablePage() {
  const [timetable, setTimetable] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTimetable()
  }, [])

  const fetchTimetable = async () => {
    try {
      const res = await fetch('/api/timetable')
      const data = await res.json()
      if (data.length > 0) {
        setTimetable(data[0].slots || [])
      }
    } catch (error) {
      console.error('Error fetching timetable:', error)
    } finally {
      setLoading(false)
    }
  }

  const getSlotForTime = (day: string, time: string) => {
    return timetable.find(slot => 
      slot.day === day && slot.startTime === time
    )
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            My Timetable
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage your weekly class schedule
          </p>
        </div>
        <Link href="/dashboard/timetable/create">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Class
          </Button>
        </Link>
      </div>

      {/* Timetable Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-blue-600" />
            Weekly Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Header Row */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                <div className="font-semibold text-sm text-gray-600">
                  Time
                </div>
                {DAYS.map(day => (
                  <div key={day} className="font-semibold text-sm text-center text-gray-900">
                    {day.substring(0, 3)}
                  </div>
                ))}
              </div>

              {/* Time Slots */}
              {TIME_SLOTS.map((time, idx) => (
                <div key={time} className="grid grid-cols-7 gap-2 mb-2">
                  <div className="text-xs text-gray-600 py-2">
                    {time}
                  </div>
                  {DAYS.map(day => {
                    const slot = getSlotForTime(day, time)
                    return (
                      <div
                        key={`${day}-${time}`}
                        className={`min-h-[60px] rounded-lg border-2 p-2 ${
                          slot
                            ? 'bg-blue-50 border-blue-200'
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        {slot && (
                          <div className="text-xs">
                            <div className="font-semibold text-blue-700">
                              {slot.courseCode}
                            </div>
                            <div className="text-gray-600 truncate">
                              {slot.venue}
                            </div>
                            <div className="text-gray-500 text-[10px]">
                              {slot.startTime} - {slot.endTime}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>

          {timetable.length === 0 && (
            <div className="text-center py-12">
              <CalendarIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">
                No classes scheduled yet
              </p>
              <Link href="/dashboard/timetable/create">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Timetable
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
