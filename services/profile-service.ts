"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateProfile(input: { fullName: string }): Promise<void> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not signed in")

  const { error } = await supabase.from("profiles").update({ full_name: input.fullName }).eq("id", user.id)
  if (error) throw new Error(error.message)
  revalidatePath("/settings")
}

export async function setActiveWorkspace(workspaceId: string): Promise<void> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not signed in")

  const { error } = await supabase.from("profiles").update({ active_workspace_id: workspaceId }).eq("id", user.id)
  if (error) throw new Error(error.message)
}
