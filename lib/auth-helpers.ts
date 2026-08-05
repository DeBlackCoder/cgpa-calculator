import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"

/**
 * Check if the current user is a super admin
 */
export async function isSuperAdmin(): Promise<boolean> {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "ADMIN") {
      return false
    }

    await connectDB()
    const user = await User.findById(session.user.id).lean()
    
    return user?.adminRole === 'SUPER_ADMIN'
  } catch (error) {
    console.error("Error checking super admin status:", error)
    return false
  }
}

/**
 * Check if the current user is a senior admin or higher
 */
export async function isSeniorAdminOrAbove(): Promise<boolean> {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "ADMIN") {
      return false
    }

    await connectDB()
    const user = await User.findById(session.user.id).lean()
    
    return user?.adminRole === 'SUPER_ADMIN' || user?.adminRole === 'SENIOR_ADMIN'
  } catch (error) {
    console.error("Error checking senior admin status:", error)
    return false
  }
}

/**
 * Get admin role details for the current session
 */
export async function getAdminStatus() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== "ADMIN") {
    return { 
      isAdmin: false, 
      isSuperAdmin: false,
      isSeniorAdmin: false,
      isRegularAdmin: false,
      adminRole: null
    }
  }

  await connectDB()
  const user = await User.findById(session.user.id).lean()
  
  const adminRole = user?.adminRole || 'REGULAR_ADMIN'
  
  return {
    isAdmin: true,
    isSuperAdmin: adminRole === 'SUPER_ADMIN',
    isSeniorAdmin: adminRole === 'SENIOR_ADMIN',
    isRegularAdmin: adminRole === 'REGULAR_ADMIN',
    adminRole
  }
}

/**
 * Check if user can modify academic data (faculties, departments, programmes, courses)
 */
export async function canModifyAcademicData(): Promise<boolean> {
  return await isSeniorAdminOrAbove()
}

/**
 * Check if user can manage admin roles
 */
export async function canManageAdmins(): Promise<boolean> {
  return await isSuperAdmin()
}

