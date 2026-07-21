"use server"

import { createClient } from "@/lib/supabase/server"
import { mapApiCredential, mapSystemLog } from "@/lib/mappers"
import type { ApiCredential, SystemLogEntry, ApiProviderKind } from "@/types"
import { revalidatePath } from "next/cache"

/** ADMIN only — enforced both by RLS policy and by the /admin route guard in middleware. */
export async function listApiCredentials(): Promise<ApiCredential[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("api_credentials").select("*").order("updated_at", { ascending: false })
  if (error) throw new Error(error.message)
  // encrypted_key is never returned to the client unmasked.
  return (data ?? []).map((row) => mapApiCredential(row, `${"*".repeat(12)}${row.id.slice(-4).toUpperCase()}`))
}

export async function addApiCredential(input: {
  providerKind: ApiProviderKind
  providerName: string
  rawKey: string
}): Promise<void> {
  const supabase = await createClient()
  // In production this should go through a KMS/secret-manager envelope
  // rather than app-level encryption; wire the encrypt() call to your
  // provider's SDK here before storing.
  const { error } = await supabase.from("api_credentials").insert({
    provider_kind: input.providerKind,
    provider_name: input.providerName,
    encrypted_key: input.rawKey,
    status: "active",
  })
  if (error) throw new Error(error.message)
  revalidatePath("/admin/api-manager")
}

export async function revokeApiCredential(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.from("api_credentials").update({ status: "revoked" }).eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/admin/api-manager")
}

export async function listSystemLogs(limit = 100): Promise<SystemLogEntry[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("system_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit)
  if (error) throw new Error(error.message)
  return (data ?? []).map(mapSystemLog)
}
