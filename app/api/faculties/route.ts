import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { canModifyAcademicData } from "@/lib/auth-helpers"
import connectDB from "@/lib/mongodb"
import Faculty from "@/models/Faculty"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    
    const faculties = await Faculty.find({})
      .sort({ name: 1 })
      .lean()

    return NextResponse.json(faculties)
  } catch (error) {
    console.error("Faculties fetch error:", error)
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
        { error: "Only senior admins and super admins can create faculties" },
        { status: 403 }
      )
    }

    await connectDB()
    const body = await request.json()
    
    const { name, code, description } = body

    if (!name || !code) {
      return NextResponse.json(
        { error: "Name and code are required" },
        { status: 400 }
      )
    }

    // Check if code already exists
    const existing = await Faculty.findOne({ code: code.toUpperCase() })
    if (existing) {
      return NextResponse.json(
        { error: "Faculty code already exists" },
        { status: 400 }
      )
    }

    const faculty = await Faculty.create({
      name,
      code: code.toUpperCase(),
      description: description || ""
    })

    return NextResponse.json(faculty, { status: 201 })
  } catch (error) {
    console.error("Faculty creation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

