import { NextRequest } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { canModifyAcademicData } from "@/lib/auth-helpers"
import connectDB from "@/lib/mongodb"
import Department from "@/models/Department"
import Programme from "@/models/Programme"

// GET /api/departments/[id] - Get single department
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
    const department = await Department.findById(id).lean()

    if (!department) {
      return new Response(JSON.stringify({ error: "Department not found" }), { status: 404 })
    }

    return Response.json(department)
  } catch (error) {
    console.error("Error fetching department:", error)
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 })
  }
}

// PUT /api/departments/[id] - Update department (Senior Admin or above)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const canModify = await canModifyAcademicData()
    if (!canModify) {
      return new Response(
        JSON.stringify({ error: "Only senior admins or above can modify departments" }),
        { status: 403 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const { name, code, facultyId, description } = body

    if (!name || !code || !facultyId) {
      return new Response(
        JSON.stringify({ error: "Name, code, and faculty are required" }),
        { status: 400 }
      )
    }

    await connectDB()

    // Check if code is already used by another department
    const existing = await Department.findOne({
      code: code.toUpperCase(),
      _id: { $ne: id }
    })

    if (existing) {
      return new Response(
        JSON.stringify({ error: "Department code already exists" }),
        { status: 400 }
      )
    }

    const department = await Department.findByIdAndUpdate(
      id,
      {
        name,
        code: code.toUpperCase(),
        facultyId,
        description: description || ""
      },
      { new: true, runValidators: true }
    )

    if (!department) {
      return new Response(JSON.stringify({ error: "Department not found" }), { status: 404 })
    }

    return Response.json(department)
  } catch (error) {
    console.error("Error updating department:", error)
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 })
  }
}

// DELETE /api/departments/[id] - Delete department (SUPER ADMIN ONLY)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const canModify = await canModifyAcademicData()
    if (!canModify) {
      return new Response(
        JSON.stringify({ error: "Only senior admins and super admins can delete departments" }),
        { status: 403 }
      )
    }

    const { id } = await params
    await connectDB()

    // Check if department has programmes
    const programmeCount = await Programme.countDocuments({ departmentId: id })
    if (programmeCount > 0) {
      return new Response(
        JSON.stringify({
          error: `Cannot delete department. It has ${programmeCount} programme(s) associated with it.`
        }),
        { status: 400 }
      )
    }

    const department = await Department.findByIdAndDelete(id)

    if (!department) {
      return new Response(JSON.stringify({ error: "Department not found" }), { status: 404 })
    }

    return Response.json({ message: "Department deleted successfully" })
  } catch (error) {
    console.error("Error deleting department:", error)
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 })
  }
}
