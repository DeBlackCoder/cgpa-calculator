import { NextRequest } from "next/server"
import { getAdminStatus } from "@/lib/auth-helpers"

export async function GET(request: NextRequest) {
  try {
    const adminStatus = await getAdminStatus()
    
    return Response.json({
      isAdmin: adminStatus.isAdmin,
      isSuperAdmin: adminStatus.isSuperAdmin,
      isSeniorAdmin: adminStatus.isSeniorAdmin,
      isRegularAdmin: adminStatus.isRegularAdmin,
      adminRole: adminStatus.adminRole
    })
  } catch (error) {
    console.error("Error checking super admin status:", error)
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
