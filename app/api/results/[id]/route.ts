import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import { Result, Student, Course, AcademicSession } from "@/models"
import { getGradeFromScore } from "@/lib/utils"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect()
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = await params
    const result = await Result.findById(id).lean()

    if (!result) {
      return NextResponse.json(
        { error: "Result not found" },
        { status: 404 }
      )
    }

    // Manually fetch related data
    const [course, sessionData, student] = await Promise.all([
      Course.findById(result.courseId).lean(),
      AcademicSession.findById(result.sessionId).lean(),
      Student.findById(result.studentId).lean()
    ])

    const populatedResult = {
      ...result,
      course,
      session: sessionData,
      student
    }

    // Check ownership (students can only view their own)
    if (session.user.role === "STUDENT" && student?.userId.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      )
    }

    return NextResponse.json(populatedResult)
  } catch (error) {
    console.error("Result fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect()
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = await params
    const result = await Result.findById(id).lean()

    if (!result) {
      return NextResponse.json(
        { error: "Result not found" },
        { status: 404 }
      )
    }

    // Fetch student for ownership check
    const student = await Student.findById(result.studentId).lean()

    // Check ownership
    if (session.user.role === "STUDENT" && student?.userId.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      )
    }

    const body = await request.json()

    // Recalculate grade if score is updated
    let updateData: any = { ...body }
    
    if (body.score !== undefined) {
      const { grade, gradePoint } = getGradeFromScore(body.score)
      updateData.grade = grade
      updateData.gradePoint = gradePoint
      updateData.qualityPoints = gradePoint * result.creditUnits
    }

    const updatedResult = await Result.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).lean()

    // Manually fetch relations
    const [course, sessionData] = await Promise.all([
      Course.findById(updatedResult!.courseId).lean(),
      AcademicSession.findById(updatedResult!.sessionId).lean()
    ])

    const populatedUpdatedResult = {
      ...updatedResult,
      course,
      session: sessionData
    }

    // Update student credits if grade changed
    if (updateData.grade) {
      const totalCreditsResult = await Result.aggregate([
        {
          $match: {
            studentId: result.studentId,
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

      await Student.findByIdAndUpdate(result.studentId, {
        creditsEarned: totalCredits
      })
    }

    return NextResponse.json(populatedUpdatedResult)
  } catch (error) {
    console.error("Result update error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect()
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = await params
    const result = await Result.findById(id).lean()

    if (!result) {
      return NextResponse.json(
        { error: "Result not found" },
        { status: 404 }
      )
    }

    // Fetch student for ownership check
    const student = await Student.findById(result.studentId).lean()

    // Check ownership
    if (session.user.role === "STUDENT" && student?.userId.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      )
    }

    await Result.findByIdAndDelete(id)

    // Update student credits
    const totalCreditsResult = await Result.aggregate([
      {
        $match: {
          studentId: result.studentId,
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

    await Student.findByIdAndUpdate(result.studentId, {
      creditsEarned: totalCredits
    })

    return NextResponse.json({ message: "Result deleted successfully" })
  } catch (error) {
    console.error("Result deletion error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
