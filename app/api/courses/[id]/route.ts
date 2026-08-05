import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import Course from "@/models/Course"

/**
 * GET /api/courses/[id]
 * Fetch a specific course
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect()
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const course = await Course.findById(id).lean()

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    return NextResponse.json(course)
  } catch (error) {
    console.error("Course fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/courses/[id]
 * Update course details (only code, title, creditUnits can be updated by students for their results)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect()
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const course = await Course.findById(id)

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    const body = await request.json()

    // Allow updating specific fields
    const allowedUpdates = ['code', 'title', 'creditUnits']
    const updates: any = {}

    allowedUpdates.forEach(field => {
      if (body[field] !== undefined) {
        updates[field] = body[field]
      }
    })

    // Validate
    if (updates.creditUnits !== undefined) {
      if (updates.creditUnits < 1 || updates.creditUnits > 6) {
        return NextResponse.json(
          { error: "Credit units must be between 1 and 6" },
          { status: 400 }
        )
      }
    }

    if (updates.code !== undefined) {
      updates.code = updates.code.toUpperCase().trim()
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).lean()

    return NextResponse.json(updatedCourse)
  } catch (error: any) {
    console.error("Course update error:", error)
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Course code already exists" },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/courses/[id]
 * Delete a course (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect()
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { id } = await params
    const course = await Course.findById(id)

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    await Course.findByIdAndDelete(id)

    return NextResponse.json({ message: "Course deleted successfully" })
  } catch (error) {
    console.error("Course deletion error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
