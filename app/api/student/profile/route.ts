import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import Student from "@/models/Student"
import User from "@/models/User"
import Faculty from "@/models/Faculty"
import Department from "@/models/Department"
import Programme from "@/models/Programme"
import { z } from "zod"

const profileSchema = z.object({
  matricNumber: z.string().min(1, "Matric number is required"),
  facultyId: z.string().min(1, "Faculty is required"),
  departmentId: z.string().min(1, "Department is required"),
  programmeId: z.string().min(1, "Programme is required"),
  level: z.number().min(100).max(900),
  currentSession: z.string().min(1, "Session is required"),
  currentSemester: z.number().min(1).max(2),
  admissionYear: z.number(),
  targetCGPA: z.number().min(0).max(5).optional().nullable()
})

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "STUDENT") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = profileSchema.parse(body)

    // Check if matric number already exists
    const existingStudent = await Student.findOne({ 
      matricNumber: validatedData.matricNumber.toUpperCase() 
    })

    if (existingStudent) {
      return NextResponse.json(
        { error: "Matric number already exists" },
        { status: 400 }
      )
    }

    // Create student profile
    const student = await Student.create({
      userId: session.user.id,
      matricNumber: validatedData.matricNumber.toUpperCase(),
      facultyId: validatedData.facultyId,
      departmentId: validatedData.departmentId,
      programmeId: validatedData.programmeId,
      level: validatedData.level,
      currentSession: validatedData.currentSession,
      currentSemester: validatedData.currentSemester,
      admissionYear: validatedData.admissionYear,
      targetCGPA: validatedData.targetCGPA || undefined
    })

    return NextResponse.json(student, { status: 201 })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Matric number already exists" },
        { status: 400 }
      )
    }

    console.error("Profile creation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "STUDENT") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const student = await Student.findOne({ userId: session.user.id })
      .lean()

    if (!student) {
      return NextResponse.json(null)
    }

    // Manually populate related data and fetch user name
    const [faculty, department, programme, user] = await Promise.all([
      Faculty.findById(student.facultyId).lean(),
      Department.findById(student.departmentId).lean(),
      Programme.findById(student.programmeId).lean(),
      User.findById(session.user.id).select("name email").lean()
    ])

    return NextResponse.json({
      ...student,
      faculty,
      department,
      programme,
      user
    })
  } catch (error) {
    console.error("Profile fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

const updateProfileSchema = z.object({
  matricNumber: z.string().min(1, "Matric number is required").optional(),
  facultyId: z.string().min(1, "Faculty is required").optional(),
  departmentId: z.string().min(1, "Department is required").optional(),
  programmeId: z.string().min(1, "Programme is required").optional(),
  level: z.number().min(100).max(900).optional(),
  currentSession: z.string().min(1, "Session is required").optional(),
  currentSemester: z.number().min(1).max(2).optional(),
  admissionYear: z.number().optional(),
  targetCGPA: z.number().min(0).max(5).optional().nullable()
})

export async function PATCH(request: NextRequest) {
  try {
    await connectDB()
    
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "STUDENT") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = updateProfileSchema.parse(body)

    // If matricNumber is being changed, check it's not taken by another student
    if (validatedData.matricNumber) {
      const existing = await Student.findOne({
        matricNumber: validatedData.matricNumber.toUpperCase(),
        userId: { $ne: session.user.id }
      })
      if (existing) {
        return NextResponse.json(
          { error: "Matric number already in use" },
          { status: 400 }
        )
      }
      validatedData.matricNumber = validatedData.matricNumber.toUpperCase()
    }

    const student = await Student.findOneAndUpdate(
      { userId: session.user.id },
      { $set: validatedData },
      { new: true, runValidators: true }
    )

    if (!student) {
      return NextResponse.json(
        { error: "Student profile not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(student)
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Matric number already in use" },
        { status: 400 }
      )
    }

    console.error("Profile update error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
