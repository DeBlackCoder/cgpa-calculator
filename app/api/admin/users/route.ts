import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import { User, Admin } from "@/models"
import bcrypt from "bcryptjs"
import { z } from "zod"

const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["STUDENT", "ADMIN"]),
  isSuperAdmin: z.boolean().optional()
})

// Only admins can create new users
export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const session = await getServerSession(authOptions)

    // Check if user is authenticated
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 }
      )
    }

    // Check if user is an admin
    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      )
    }

    // Verify admin exists and get permissions
    const admin = await Admin.findOne({ userId: session.user.id })

    if (!admin) {
      return NextResponse.json(
        { error: "Admin profile not found" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = createUserSchema.parse(body)

    // Only super admins can create other admins
    if (validatedData.role === "ADMIN" && !admin.isSuperAdmin) {
      return NextResponse.json(
        { error: "Only super admins can create admin accounts" },
        { status: 403 }
      )
    }

    // Only super admins can create super admins
    if (validatedData.isSuperAdmin && !admin.isSuperAdmin) {
      return NextResponse.json(
        { error: "Only super admins can create other super admins" },
        { status: 403 }
      )
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: validatedData.email })

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10)

    // Create user
    const user = await User.create({
      name: validatedData.name,
      email: validatedData.email,
      password: hashedPassword,
      role: validatedData.role
    })

    // Create admin profile if role is ADMIN
    if (validatedData.role === "ADMIN") {
      await Admin.create({
        userId: user._id.toString(),
        isSuperAdmin: validatedData.isSuperAdmin || false
      })
    }

    return NextResponse.json(
      {
        message: `${validatedData.role} account created successfully`,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      },
      { status: 201 }
    )
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error("User creation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Get all users (admin only)
export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const users = await User.find({})
      .select('name email role createdAt')
      .sort({ createdAt: -1 })
      .lean()

    // Get admin info for each user
    const usersWithAdmin = await Promise.all(
      users.map(async (user) => {
        if (user.role === 'ADMIN') {
          const admin = await Admin.findOne({ userId: user._id.toString() }).select('isSuperAdmin').lean()
          return {
            ...user,
            admin: admin ? { isSuperAdmin: admin.isSuperAdmin } : null
          }
        }
        return {
          ...user,
          admin: null
        }
      })
    )

    return NextResponse.json(usersWithAdmin)
  } catch (error) {
    console.error("Users fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
