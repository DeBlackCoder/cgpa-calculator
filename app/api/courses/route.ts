import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import { Course } from "@/models"

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    const { searchParams } = new URL(request.url)
    const departmentId = searchParams.get("departmentId")
    const level = searchParams.get("level")
    const semester = searchParams.get("semester")

    const filter: any = {}
    
    if (departmentId) filter.departmentId = departmentId
    if (level) filter.level = parseInt(level)
    if (semester) filter.semester = parseInt(semester)

    const courses = await Course.find(filter)
      .sort({ level: 1, semester: 1, code: 1 })
      .lean()

    return NextResponse.json(courses)
  } catch (error) {
    console.error("Courses fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Allow any authenticated admin to create courses
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      )
    }

    await dbConnect()
    const body = await request.json()
    
    const course = await Course.create({
      code: body.code,
      title: body.title,
      creditUnits: body.creditUnits,
      level: body.level,
      semester: body.semester,
      departmentId: body.departmentId,
      description: body.description,
      isElective: body.isElective || false,
      isCarryOver: body.isCarryOver || false
    })

    return NextResponse.json(course, { status: 201 })
  } catch (error) {
    console.error("Course creation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
