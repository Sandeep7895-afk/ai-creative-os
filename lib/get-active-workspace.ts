/* eslint-disable @typescript-eslint/no-explicit-any -- raw Supabase rows are untyped at the client boundary; mapped to domain types immediately after */
import "server-only"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { mapWorkspace } from "@/lib/mappers"
import type { Workspace } from "@/types"

/** Resolves the current user + their active workspace for a Server Component page. */
export async function getActiveWorkspace(): Promise<{ userId: string; workspace: Workspace }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profileRow } = await supabase.from("profiles").select("active_workspace_id").eq("id", user.id).single()
  const cookieStore = await cookies()
  const cookieWorkspaceId = cookieStore.get("active_workspace_id")?.value
  const workspaceId = profileRow?.active_workspace_id ?? cookieWorkspaceId

  let workspaceRow
  if (workspaceId) {
    const { data } = await supabase.from("workspaces").select("*").eq("id", workspaceId).single()
    workspaceRow = data
  }
  if (!workspaceRow) {
    const { data } = await supabase
      .from("workspace_members")
      .select("workspaces(*)")
      .eq("user_id", user.id)
      .limit(1)
      .single()
    workspaceRow = (data as any)?.workspaces
  }
  if (!workspaceRow) redirect("/dashboard")

  return { userId: user.id, workspace: mapWorkspace(workspaceRow) }
}
