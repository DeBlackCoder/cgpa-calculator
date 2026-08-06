"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Clock, CheckCircle2, Circle, AlertCircle } from "lucide-react"
import { format, formatDistanceToNow, isPast, isFuture } from "date-fns"
import DeadlineDialog from "@/components/deadlines/deadline-dialog"

interface Deadline {
  _id: string
  title: string
  description?: string
  courseCode?: string
  type: string
  dueDate: string
  isCompleted: boolean
  priority: 'Low' | 'Medium' | 'High'
}

export default function DeadlinesPage() {
  const [deadlines, setDeadlines] = useState<Deadline[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all')

  useEffect(() => {
    fetchDeadlines()
  }, [])

  const fetchDeadlines = async () => {
    try {
      const res = await fetch('/api/deadlines')
      const data = await res.json()
      setDeadlines(data)
    } catch (error) {
      console.error('Error fetching deadlines:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleComplete = async (id: string, currentStatus: boolean) => {
    try {
      await fetch('/api/deadlines', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isCompleted: !currentStatus })
      })
      fetchDeadlines()
    } catch (error) {
      console.error('Error updating deadline:', error)
    }
  }

  const filteredDeadlines = deadlines.filter(d => {
    if (filter === 'pending') return !d.isCompleted
    if (filter === 'completed') return d.isCompleted
    return true
  })

  const upcomingDeadlines = filteredDeadlines.filter(d => !d.isCompleted && isFuture(new Date(d.dueDate)))
  const overdueDeadlines = filteredDeadlines.filter(d => !d.isCompleted && isPast(new Date(d.dueDate)))
  const completedDeadlines = filteredDeadlines.filter(d => d.isCompleted)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
      case 'Medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'Low': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'Assignment': 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
      'Exam': 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
      'Project': 'bg-pink-100 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400',
      'Quiz': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-400',
    }
    return colors[type] || 'bg-gray-100 text-gray-700'
  }

  const DeadlineCard = ({ deadline }: { deadline: Deadline }) => {
    const dueDate = new Date(deadline.dueDate)
    const isOverdue = isPast(dueDate) && !deadline.isCompleted
    
    return (
      <div className={`p-4 rounded-lg border-2 ${
        deadline.isCompleted 
          ? 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700' 
          : isOverdue
          ? 'bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-800'
          : 'bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700'
      }`}>
        <div className="flex items-start gap-3">
          <button
            onClick={() => toggleComplete(deadline._id, deadline.isCompleted)}
            className="mt-1 flex-shrink-0"
          >
            {deadline.isCompleted ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <Circle className="h-5 w-5 text-gray-400 hover:text-primary-500" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className={`font-semibold ${deadline.isCompleted ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                {deadline.title}
              </h3>
              {isOverdue && !deadline.isCompleted && (
                <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
              )}
            </div>

            {deadline.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {deadline.description}
              </p>
            )}

            {deadline.courseCode && (
              <p className="text-sm text-primary-600 dark:text-primary-400 mb-2">
                {deadline.courseCode}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2">
              <Badge className={getTypeColor(deadline.type)}>
                {deadline.type}
              </Badge>
              <Badge className={getPriorityColor(deadline.priority)}>
                {deadline.priority}
              </Badge>
              <span className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {format(dueDate, 'MMM d, yyyy')} • {formatDistanceToNow(dueDate, { addSuffix: true })}
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Deadlines
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Track your assignments and exams
          </p>
        </div>
        <DeadlineDialog />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{upcomingDeadlines.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Upcoming</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{overdueDeadlines.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Overdue</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{completedDeadlines.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
          size="sm"
        >
          All
        </Button>
        <Button
          variant={filter === 'pending' ? 'default' : 'outline'}
          onClick={() => setFilter('pending')}
          size="sm"
        >
          Pending
        </Button>
        <Button
          variant={filter === 'completed' ? 'default' : 'outline'}
          onClick={() => setFilter('completed')}
          size="sm"
        >
          Completed
        </Button>
      </div>

      {/* Overdue Section */}
      {overdueDeadlines.length > 0 && filter !== 'completed' && (
        <div>
          <h2 className="text-lg font-semibold text-red-600 mb-3 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Overdue
          </h2>
          <div className="space-y-3">
            {overdueDeadlines.map(deadline => (
              <DeadlineCard key={deadline._id} deadline={deadline} />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Section */}
      {upcomingDeadlines.length > 0 && filter !== 'completed' && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Upcoming
          </h2>
          <div className="space-y-3">
            {upcomingDeadlines.map(deadline => (
              <DeadlineCard key={deadline._id} deadline={deadline} />
            ))}
          </div>
        </div>
      )}

      {/* Completed Section */}
      {completedDeadlines.length > 0 && filter !== 'pending' && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Completed
          </h2>
          <div className="space-y-3">
            {completedDeadlines.map(deadline => (
              <DeadlineCard key={deadline._id} deadline={deadline} />
            ))}
          </div>
        </div>
      )}

      {filteredDeadlines.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Clock className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No deadlines yet
            </p>
            <DeadlineDialog />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
