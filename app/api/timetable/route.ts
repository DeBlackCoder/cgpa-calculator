import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import Timetable from "@/models/Timetable"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    
    const timetables = await Timetable.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json(timetables)
  } catch (error) {
    console.error("Error fetching timetables:", error)
    return NextResponse.json(
      { error: "Failed to fetch timetables" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    
    const body = await request.json()
    const { semester, slots, isPublic } = body

    const timetable = await Timetable.create({
      userId: session.user.id,
      semester,
      slots,
      isPublic: isPublic || false,
      shareLink: isPublic ? `${Math.random().toString(36).substr(2, 9)}` : undefined
    })

    return NextResponse.json(timetable, { status: 201 })
  } catch (error) {
    console.error("Error creating timetable:", error)
    return NextResponse.json(
      { error: "Failed to create timetable" },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    
    const body = await request.json()
    const { id, semester, slots, isPublic } = body

    const timetable = await Timetable.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { semester, slots, isPublic },
      { new: true }
    )

    if (!timetable) {
      return NextResponse.json({ error: "Timetable not found" }, { status: 404 })
    }

    return NextResponse.json(timetable)
  } catch (error) {
    console.error("Error updating timetable:", error)
    return NextResponse.json(
      { error: "Failed to update timetable" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 })
    }

    const timetable = await Timetable.findOneAndDelete({
      _id: id,
      userId: session.user.id
    })

    if (!timetable) {
      return NextResponse.json({ error: "Timetable not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Timetable deleted successfully" })
  } catch (error) {
    console.error("Error deleting timetable:", error)
    return NextResponse.json(
      { error: "Failed to delete timetable" },
      { status: 500 }
    )
  }
}
