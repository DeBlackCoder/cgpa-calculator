import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getAdminStatus } from "@/lib/auth-helpers"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard")
  }

  const adminStatus = await getAdminStatus()

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar 
        role="ADMIN" 
        isSuperAdmin={adminStatus.isSuperAdmin}
        isSeniorAdmin={adminStatus.isSeniorAdmin}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={session.user} />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

