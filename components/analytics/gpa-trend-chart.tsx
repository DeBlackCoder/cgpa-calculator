"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface GPATrendChartProps {
  data: Array<{
    name: string
    gpa: number
    courses: number
  }>
}

export default function GPATrendChart({ data }: GPATrendChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>GPA Trend</CardTitle>
        <CardDescription>Your GPA progression over semesters</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-800" />
            <XAxis
              dataKey="name"
              className="text-xs"
              tick={{ fill: "currentColor" }}
            />
            <YAxis
              domain={[0, 5]}
              className="text-xs"
              tick={{ fill: "currentColor" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="gpa"
              stroke="hsl(217, 91%, 60%)"
              strokeWidth={3}
              dot={{ fill: "hsl(217, 91%, 60%)", r: 5 }}
              activeDot={{ r: 7 }}
              name="GPA"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
