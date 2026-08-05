import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { isSuperAdmin } from '@/lib/auth-helpers'

// GET all admins with their roles
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Only super admins can view admin roles
    const isSuper = await isSuperAdmin()
    if (!isSuper) {
      return NextResponse.json(
        { error: 'Only super admins can view admin roles' },
        { status: 403 }
      )
    }

    await connectDB()

    // Get all admin users
    const admins = await User.find({ role: 'ADMIN' })
      .select('_id name email adminRole createdAt')
      .lean()

    return NextResponse.json({ admins })
  } catch (error) {
    console.error('Error fetching admins:', error)
    return NextResponse.json(
      { error: 'Failed to fetch admins' },
      { status: 500 }
    )
  }
}

// PUT update admin role
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Only super admins can modify admin roles
    const isSuper = await isSuperAdmin()
    if (!isSuper) {
      return NextResponse.json(
        { error: 'Only super admins can modify admin roles' },
        { status: 403 }
      )
    }

    const { userId, adminRole } = await req.json()

    if (!userId || !adminRole) {
      return NextResponse.json(
        { error: 'User ID and admin role are required' },
        { status: 400 }
      )
    }

    // Validate admin role
    const validRoles = ['SUPER_ADMIN', 'SENIOR_ADMIN', 'REGULAR_ADMIN']
    if (!validRoles.includes(adminRole)) {
      return NextResponse.json(
        { error: 'Invalid admin role' },
        { status: 400 }
      )
    }

    await connectDB()

    // Check if user exists and is an admin
    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'User is not an admin' },
        { status: 400 }
      )
    }

    // Don't allow super admin to demote themselves
    if (userId === session.user.id && adminRole !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Cannot demote yourself from super admin' },
        { status: 400 }
      )
    }

    // Update admin role
    user.adminRole = adminRole
    await user.save()

    return NextResponse.json({
      message: 'Admin role updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        adminRole: user.adminRole
      }
    })
  } catch (error) {
    console.error('Error updating admin role:', error)
    return NextResponse.json(
      { error: 'Failed to update admin role' },
      { status: 500 }
    )
  }
}
