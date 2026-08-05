import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import { Student, Result, Course, AcademicSession } from "@/models"
import { z } from "zod"
import { getGradeFromScore } from "@/lib/utils"

const resultSchema = z.object({
  courseId: z.string().min(1, "Course is required"),
  sessionId: z.string().min(1, "Session is required"),
  semester: z.number().min(1).max(2),
  level: z.number().min(100).max(900),
  score: z.number().min(0).max(100)
})

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const student = await Student.findOne({ userId: session.user.id })

    if (!student) {
      return NextResponse.json(
        { error: "Student profile not found" },
        { status: 404 }
      )
    }

    const { searchParams } = new URL(request.url)
    const semester = searchParams.get("semester")
    const level = searchParams.get("level")
    const sessionId = searchParams.get("sessionId")

    const filter: any = { studentId: student._id }
    
    if (semester) filter.semester = parseInt(semester)
    if (level) filter.level = parseInt(level)
    if (sessionId) filter.sessionId = sessionId

    const results = await Result.find(filter)
      .sort({ level: -1, semester: -1, createdAt: -1 })
      .lean()

    // Manually fetch courses and sessions
    const courseIds = [...new Set(results.map(r => r.courseId))]
    const sessionIds = [...new Set(results.map(r => r.sessionId))]

    const [courses, sessions] = await Promise.all([
      Course.find({ _id: { $in: courseIds } }).lean(),
      AcademicSession.find({ _id: { $in: sessionIds } }).lean()
    ])

    // Create lookup maps
    const courseMap = new Map(courses.map(c => [c._id.toString(), c]))
    const sessionMap = new Map(sessions.map(s => [s._id.toString(), s]))

    // Attach related data
    const populatedResults = results.map(result => ({
      ...result,
      course: courseMap.get(result.courseId.toString()),
      session: sessionMap.get(result.sessionId.toString())
    }))

    return NextResponse.json(populatedResults)
  } catch (error) {
    console.error("Results fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const student = await Student.findOne({ userId: session.user.id })

    if (!student) {
      return NextResponse.json(
        { error: "Student profile not found" },
        { status: 404 }
      )
    }

    const body = await request.json()
    const validatedData = resultSchema.parse(body)

    // Check if result already exists
    const existingResult = await Result.findOne({
      studentId: student._id.toString(),
      courseId: validatedData.courseId,
      sessionId: validatedData.sessionId,
      semester: validatedData.semester
    })

    if (existingResult) {
      return NextResponse.json(
        { error: "Result already exists for this course in this semester" },
        { status: 400 }
      )
    }

    // Get course details
    const course = await Course.findById(validatedData.courseId)

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      )
    }

    // Calculate grade and grade point
    const { grade, gradePoint } = getGradeFromScore(validatedData.score)
    const qualityPoints = gradePoint * course.creditUnits

    // Create result
    const result = await Result.create({
      studentId: student._id.toString(),
      courseId: validatedData.courseId,
      sessionId: validatedData.sessionId,
      semester: validatedData.semester,
      level: validatedData.level,
      score: validatedData.score,
      grade: grade as 'A' | 'B' | 'C' | 'D' | 'E' | 'F',
      gradePoint,
      creditUnits: course.creditUnits,
      qualityPoints
    })

    // Manually fetch relations
    const [courseData, sessionData] = await Promise.all([
      Course.findById(result.courseId).lean(),
      AcademicSession.findById(result.sessionId).lean()
    ])

    const resultWithRelations = {
      ...result.toObject(),
      course: courseData,
      session: sessionData
    }

    // Update student credits earned
    const totalCreditsResult = await Result.aggregate([
      {
        $match: {
          studentId: student._id,
          grade: { $ne: "F" }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$creditUnits" }
        }
      }
    ])

    const totalCredits = totalCreditsResult.length > 0 ? totalCreditsResult[0].total : 0

    await Student.findByIdAndUpdate(student._id, {
      creditsEarned: totalCredits
    })

    return NextResponse.json(resultWithRelations, { status: 201 })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error("Result creation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
