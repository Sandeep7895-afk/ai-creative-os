"use server"

import { createClient } from "@/lib/supabase/server"
import { mapWorkspace } from "@/lib/mappers"
import type { Workspace } from "@/types"
import { revalidatePath } from "next/cache"

function slugify(name: string): string {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "workspace"
}

export async function createWorkspace(name: string): Promise<Workspace> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not signed in")

  const slug = `${slugify(name)}-${Math.random().toString(36).slice(2, 6)}`

  const { data: workspace, error } = await supabase
    .from("workspaces")
    .insert({ name, slug, owner_id: user.id })
    .select()
    .single()
  if (error) throw new Error(error.message)

  const { error: memberError } = await supabase
    .from("workspace_members")
    .insert({ workspace_id: workspace.id, user_id: user.id, role: "ADMIN" })
  if (memberError) throw new Error(memberError.message)

  await supabase.from("profiles").update({ active_workspace_id: workspace.id }).eq("id", user.id)

  revalidatePath("/", "layout")
  return mapWorkspace(workspace)
}

export async function updateWorkspaceName(id: string, name: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.from("workspaces").update({ name }).eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/settings")
}
