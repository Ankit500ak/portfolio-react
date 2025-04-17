import type React from "react"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { SessionProvider } from "@/components/session-provider"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  // Only redirect from dashboard, not from login page
  if (!session && !children.toString().includes("login")) {
    redirect("/admin/login")
  }

  return <SessionProvider>{children}</SessionProvider>
}
