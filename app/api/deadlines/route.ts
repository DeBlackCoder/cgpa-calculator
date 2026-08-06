import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import Deadline from "@/models/Deadline"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    
    const deadlines = await Deadline.find({ userId: session.user.id })
      .sort({ dueDate: 1 })
      .lean()

    return NextResponse.json(deadlines)
  } catch (error) {
    console.error("Error fetching deadlines:", error)
    return NextResponse.json(
      { error: "Failed to fetch deadlines" },
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
    const { title, description, courseCode, courseTitle, type, dueDate, priority } = body

    const deadline = await Deadline.create({
      userId: session.user.id,
      title,
      description,
      courseCode,
      courseTitle,
      type,
      dueDate: new Date(dueDate),
      priority: priority || 'Medium',
      isCompleted: false
    })

    return NextResponse.json(deadline, { status: 201 })
  } catch (error) {
    console.error("Error creating deadline:", error)
    return NextResponse.json(
      { error: "Failed to create deadline" },
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
    const { id, ...updates } = body

    const deadline = await Deadline.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      updates,
      { new: true }
    )

    if (!deadline) {
      return NextResponse.json({ error: "Deadline not found" }, { status: 404 })
    }

    return NextResponse.json(deadline)
  } catch (error) {
    console.error("Error updating deadline:", error)
    return NextResponse.json(
      { error: "Failed to update deadline" },
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

    const deadline = await Deadline.findOneAndDelete({
      _id: id,
      userId: session.user.id
    })

    if (!deadline) {
      return NextResponse.json({ error: "Deadline not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Deadline deleted successfully" })
  } catch (error) {
    console.error("Error deleting deadline:", error)
    return NextResponse.json(
      { error: "Failed to delete deadline" },
      { status: 500 }
    )
  }
}
