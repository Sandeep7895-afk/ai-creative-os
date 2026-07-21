"use server"

import { createClient } from "@/lib/supabase/server"
import { mapAsset } from "@/lib/mappers"
import type { Asset } from "@/types"
import { revalidatePath } from "next/cache"

export async function listAssets(workspaceId: string): Promise<Asset[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("assets")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []).map(mapAsset)
}

export async function deleteAsset(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.from("assets").delete().eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/assets")
}
