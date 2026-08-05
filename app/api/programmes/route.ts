import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { canModifyAcademicData } from "@/lib/auth-helpers"
import dbConnect from "@/lib/mongodb"
import { Programme } from "@/models"

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    const { searchParams } = new URL(request.url)
    const departmentId = searchParams.get("departmentId")

    const filter = departmentId ? { departmentId } : {}

    const programmes = await Programme.find(filter)
      .sort({ name: 1 })
      .lean()

    return NextResponse.json(programmes)
  } catch (error) {
    console.error("Programmes fetch error:", error)
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
        { error: "Only senior admins and super admins can create programmes" },
        { status: 403 }
      )
    }

    await dbConnect()
    const body = await request.json()
    
    // Validate required fields
    if (!body.name || !body.code || !body.departmentId || !body.duration || !body.totalCredits) {
      return NextResponse.json(
        { error: "Name, code, department, duration, and total credits are required" },
        { status: 400 }
      )
    }

    // Check if code already exists
    const existing = await Programme.findOne({ code: body.code.toUpperCase() })
    if (existing) {
      return NextResponse.json(
        { error: "Programme code already exists" },
        { status: 400 }
      )
    }
    
    const programme = await Programme.create({
      name: body.name,
      code: body.code.toUpperCase(),
      description: body.description || "",
      duration: body.duration,
      totalCredits: body.totalCredits,
      departmentId: body.departmentId
    })

    return NextResponse.json(programme, { status: 201 })
  } catch (error: any) {
    console.error("Programme creation error:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}
