import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import AIPredictionHistory from "@/models/AIPredictionHistory"
import Student from "@/models/Student"

/**
 * GET /api/predictions
 * Fetch prediction history for current student
 */
export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get student
    const student = await Student.findOne({ userId: session.user.id }).lean()
    if (!student) {
      return NextResponse.json({ error: "Student profile not found" }, { status: 404 })
    }

    // Get prediction history
    const predictions = await AIPredictionHistory.find({
      studentId: student._id.toString()
    })
      .sort({ timestamp: -1 })
      .limit(10)
      .lean()

    return NextResponse.json({ predictions })
  } catch (error) {
    console.error("Predictions fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/predictions
 * Save new prediction snapshot
 */
export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get student
    const student = await Student.findOne({ userId: session.user.id }).lean()
    if (!student) {
      return NextResponse.json({ error: "Student profile not found" }, { status: 404 })
    }

    const body = await request.json()

    // Validate required fields
    const {
      currentCGPA,
      creditsEarned,
      predictedFinalCGPA,
      riskLevel,
      confidenceLevel,
      projections,
      riskFactors,
      recommendations,
      milestones,
      metadata
    } = body

    if (
      currentCGPA === undefined ||
      creditsEarned === undefined ||
      !predictedFinalCGPA ||
      !riskLevel ||
      !confidenceLevel
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Create prediction record
    const prediction = await AIPredictionHistory.create({
      studentId: student._id.toString(),
      currentCGPA,
      creditsEarned,
      predictedFinalCGPA,
      riskLevel,
      confidenceLevel,
      projections: projections || { optimistic: 0, realistic: 0, pessimistic: 0 },
      riskFactors: riskFactors || [],
      recommendations: recommendations || [],
      milestones: milestones || [],
      metadata: metadata || {}
    })

    return NextResponse.json({
      success: true,
      prediction
    })
  } catch (error) {
    console.error("Predictions save error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/predictions
 * Clear prediction history (optional - for testing/privacy)
 */
export async function DELETE(request: NextRequest) {
  try {
    await dbConnect()
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get student
    const student = await Student.findOne({ userId: session.user.id }).lean()
    if (!student) {
      return NextResponse.json({ error: "Student profile not found" }, { status: 404 })
    }

    await AIPredictionHistory.deleteMany({
      studentId: student._id.toString()
    })

    return NextResponse.json({
      success: true,
      message: "Prediction history cleared"
    })
  } catch (error) {
    console.error("Predictions delete error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
