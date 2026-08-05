import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import { AcademicSession } from "@/models"

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const sessions = await AcademicSession.find({})
      .sort({ startDate: -1 })
      .lean()

    return NextResponse.json(sessions)
  } catch (error) {
    console.error("Sessions fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const body = await request.json()
    
    // If marking as current, set others to false
    if (body.isCurrent) {
      await AcademicSession.updateMany({}, { isCurrent: false })
    }
    
    const session = await AcademicSession.create({
      name: body.name,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      isCurrent: body.isCurrent || false
    })

    return NextResponse.json(session, { status: 201 })
  } catch (error) {
    console.error("Session creation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
