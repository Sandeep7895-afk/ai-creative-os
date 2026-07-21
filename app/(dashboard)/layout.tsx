import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { mapProfile, mapWorkspace } from "@/lib/mappers"
import { SessionProvider } from "@/providers/session-provider"
import { Sidebar } from "@/components/layout/sidebar"
import { Topbar } from "@/components/layout/topbar"
import { FloatingAssistant } from "@/components/layout/floating-assistant"
import { listNotifications } from "@/services/notification-service"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: profileRow } = await supabase.from("profiles").select("*").eq("id", user.id).single()
  if (!profileRow) redirect("/login")

  const { data: memberRows } = await supabase
    .from("workspace_members")
    .select("workspaces(*)")
    .eq("user_id", user.id)

  const workspaces = (memberRows ?? [])
    .map((row: { workspaces: unknown }) => row.workspaces)
    .filter(Boolean)
    .map(mapWorkspace)

  if (workspaces.length === 0) {
    // First login: no workspace yet. Render onboarding directly instead of
    // redirecting — every route in this group (including /settings) sits
    // behind this same check, so redirecting into one of them would loop.
    return <CreateWorkspaceOnboarding />
  }

  const cookieStore = await cookies()
  const cookieWorkspaceId = cookieStore.get("active_workspace_id")?.value
  const initialWorkspaceId =
    profileRow.active_workspace_id ?? cookieWorkspaceId ?? workspaces[0].id

  const profile = mapProfile(profileRow)
  const notifications = await listNotifications(user.id)

  return (
    <SessionProvider profile={profile} workspaces={workspaces} initialWorkspaceId={initialWorkspaceId}>
      <div className="flex h-screen overflow-hidden bg-[var(--color-background)]">
        <Sidebar className="hidden md:flex" />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Topbar initialNotifications={notifications} />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
        <FloatingAssistant />
      </div>
    </SessionProvider>
  )
}
