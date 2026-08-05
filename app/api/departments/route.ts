import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { canModifyAcademicData } from "@/lib/auth-helpers"
import connectDB from "@/lib/mongodb"
import Department from "@/models/Department"
import Faculty from "@/models/Faculty"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const { searchParams } = new URL(request.url)
    const facultyId = searchParams.get("facultyId")

    const filter = facultyId ? { facultyId } : {}

    const departments = await Department.find(filter).sort({ name: 1 }).lean()
    
    // Manually populate faculty data
    const departmentsWithFaculty = await Promise.all(
      departments.map(async (dept) => {
        const faculty = await Faculty.findById(dept.facultyId).lean()
        return {
          ...dept,
          faculty
        }
      })
    )

    return NextResponse.json(departmentsWithFaculty)
  } catch (error) {
    console.error("Departments fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const canModify = await canModifyAcademicData()
    if (!canModify) {
      return NextResponse.json(
        { error: "Only senior admins and super admins can create departments" },
        { status: 403 }
      )
    }

    await connectDB()
    const body = await request.json()
    
    const { name, code, facultyId, description } = body

    if (!name || !code || !facultyId) {
      return NextResponse.json(
        { error: "Name, code, and faculty are required" },
        { status: 400 }
      )
    }

    // Check if code already exists
    const existing = await Department.findOne({ code: code.toUpperCase() })
    if (existing) {
      return NextResponse.json(
        { error: "Department code already exists" },
        { status: 400 }
      )
    }

    const department = await Department.create({
      name,
      code: code.toUpperCase(),
      facultyId,
      description: description || ""
    })

    return NextResponse.json(department, { status: 201 })
  } catch (error) {
    console.error("Department creation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

