import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"
import { z } from "zod"

const updateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100).trim()
})

export async function PATCH(request: NextRequest) {
  try {
    await connectDB()

    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name } = updateUserSchema.parse(body)

    const user = await User.findByIdAndUpdate(
      session.user.id,
      { $set: { name } },
      { new: true, runValidators: true }
    ).select("-password")

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ name: user.name, email: user.email })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    console.error("User profile update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
