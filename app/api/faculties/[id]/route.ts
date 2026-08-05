import { NextRequest } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { canModifyAcademicData } from "@/lib/auth-helpers"
import connectDB from "@/lib/mongodb"
import Faculty from "@/models/Faculty"
import Department from "@/models/Department"

// GET /api/faculties/[id] - Get single faculty
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
    const faculty = await Faculty.findById(id).lean()

    if (!faculty) {
      return new Response(JSON.stringify({ error: "Faculty not found" }), { status: 404 })
    }

    return Response.json(faculty)
  } catch (error) {
    console.error("Error fetching faculty:", error)
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 })
  }
}

// PUT /api/faculties/[id] - Update faculty (Senior Admin or above)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const canModify = await canModifyAcademicData()
    if (!canModify) {
      return new Response(
        JSON.stringify({ error: "Only senior admins or above can modify faculties" }),
        { status: 403 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const { name, code, description } = body

    if (!name || !code) {
      return new Response(
        JSON.stringify({ error: "Name and code are required" }),
        { status: 400 }
      )
    }

    await connectDB()

    // Check if code is already used by another faculty
    const existing = await Faculty.findOne({
      code: code.toUpperCase(),
      _id: { $ne: id }
    })

    if (existing) {
      return new Response(
        JSON.stringify({ error: "Faculty code already exists" }),
        { status: 400 }
      )
    }

    const faculty = await Faculty.findByIdAndUpdate(
      id,
      {
        name,
        code: code.toUpperCase(),
        description: description || ""
      },
      { new: true, runValidators: true }
    )

    if (!faculty) {
      return new Response(JSON.stringify({ error: "Faculty not found" }), { status: 404 })
    }

    return Response.json(faculty)
  } catch (error) {
    console.error("Error updating faculty:", error)
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 })
  }
}

// DELETE /api/faculties/[id] - Delete faculty (Senior Admin or above)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const canModify = await canModifyAcademicData()
    if (!canModify) {
      return new Response(
        JSON.stringify({ error: "Only senior admins or above can delete faculties" }),
        { status: 403 }
      )
    }

    const { id } = await params
    await connectDB()

    // Check if faculty has departments
    const departmentCount = await Department.countDocuments({ facultyId: id })
    if (departmentCount > 0) {
      return new Response(
        JSON.stringify({
          error: `Cannot delete faculty. It has ${departmentCount} department(s) associated with it.`
        }),
        { status: 400 }
      )
    }

    const faculty = await Faculty.findByIdAndDelete(id)

    if (!faculty) {
      return new Response(JSON.stringify({ error: "Faculty not found" }), { status: 404 })
    }

    return Response.json({ message: "Faculty deleted successfully" })
  } catch (error) {
    console.error("Error deleting faculty:", error)
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 })
  }
}
