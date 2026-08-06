"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/alert"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { TrendingUp } from "lucide-react"

interface SemesterData {
  name: string
  level: number
  semester: number
  gpa: number
  courses: number
}

interface CGPATrendChartProps {
  data: SemesterData[]
}

export default function CGPATrendChart({ data }: CGPATrendChartProps) {
  const maxGPA = Math.max(...data.map(d => d.gpa), 4.5)
  
  return (
    <Card className="border-2 border-primary-200 dark:border-primary-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary-700 dark:text-primary-400">
          <TrendingUp className="h-5 w-5" />
          CGPA Trend Over Time
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-gray-500">
            <p>No data available yet. Add results to see your CGPA trend.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                domain={[0, 5.0]}
                ticks={[0, 1.0, 2.0, 3.0, 4.0, 5.0]}
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '8px'
                }}
                formatter={(value: number) => value.toFixed(2)}
                labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
              />
              
              {/* Reference lines for classifications */}
              <ReferenceLine 
                y={4.5} 
                stroke="#10b981" 
                strokeDasharray="3 3" 
                label={{ value: 'First Class', position: 'right', fill: '#10b981', fontSize: 11 }}
              />
              <ReferenceLine 
                y={3.5} 
                stroke="#3b82f6" 
                strokeDasharray="3 3"
                label={{ value: '2:1', position: 'right', fill: '#3b82f6', fontSize: 11 }}
              />
              <ReferenceLine 
                y={2.4} 
                stroke="#f59e0b" 
                strokeDasharray="3 3"
                label={{ value: '2:2', position: 'right', fill: '#f59e0b', fontSize: 11 }}
              />
              
              <Line 
                type="monotone" 
                dataKey="gpa" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
        
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-gray-600 dark:text-gray-400">First Class (4.5+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-gray-600 dark:text-gray-400">2:1 (3.5-4.49)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span className="text-gray-600 dark:text-gray-400">2:2 (2.4-3.49)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-gray-600 dark:text-gray-400">Below 2.4</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
