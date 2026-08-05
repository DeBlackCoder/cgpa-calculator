import { NextRequest } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { canModifyAcademicData } from "@/lib/auth-helpers"
import connectDB from "@/lib/mongodb"
import Programme from "@/models/Programme"
import Student from "@/models/Student"

// GET /api/programmes/[id] - Get single programme
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
    }

    const { id } = await params
    await connectDB()
    const programme = await Programme.findById(id).lean()

    if (!programme) {
      return new Response(JSON.stringify({ error: "Programme not found" }), { status: 404 })
    }

    return Response.json(programme)
  } catch (error) {
    console.error("Error fetching programme:", error)
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 })
  }
}

// PUT /api/programmes/[id] - Update programme (Senior Admin or above)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const canModify = await canModifyAcademicData()
    if (!canModify) {
      return new Response(
        JSON.stringify({ error: "Only senior admins or above can modify programmes" }),
        { status: 403 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const { name, code, departmentId, duration, totalCredits, description } = body

    if (!name || !code || !departmentId || !duration || !totalCredits) {
      return new Response(
        JSON.stringify({ error: "Name, code, department, duration, and total credits are required" }),
        { status: 400 }
      )
    }

    await connectDB()

    // Check if code is already used by another programme
    const existing = await Programme.findOne({
      code: code.toUpperCase(),
      _id: { $ne: id }
    })

    if (existing) {
      return new Response(
        JSON.stringify({ error: "Programme code already exists" }),
        { status: 400 }
      )
    }

    const programme = await Programme.findByIdAndUpdate(
      id,
      {
        name,
        code: code.toUpperCase(),
        departmentId,
        duration,
        totalCredits,
        description: description || ""
      },
      { new: true, runValidators: true }
    )

    if (!programme) {
      return new Response(JSON.stringify({ error: "Programme not found" }), { status: 404 })
    }

    return Response.json(programme)
  } catch (error) {
    console.error("Error updating programme:", error)
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 })
  }
}

// DELETE /api/programmes/[id] - Delete programme (Senior Admin or above)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const canModify = await canModifyAcademicData()
    if (!canModify) {
      return new Response(
        JSON.stringify({ error: "Only senior admins or above can delete programmes" }),
        { status: 403 }
      )
    }

    const { id } = await params
    await connectDB()

    // Check if programme has students
    const studentCount = await Student.countDocuments({ programmeId: id })
    if (studentCount > 0) {
      return new Response(
        JSON.stringify({
          error: `Cannot delete programme. It has ${studentCount} student(s) enrolled.`
        }),
        { status: 400 }
      )
    }

    const programme = await Programme.findByIdAndDelete(id)

    if (!programme) {
      return new Response(JSON.stringify({ error: "Programme not found" }), { status: 404 })
    }

    return Response.json({ message: "Programme deleted successfully" })
  } catch (error) {
    console.error("Error deleting programme:", error)
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 })
  }
}
