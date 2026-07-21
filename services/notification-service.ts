"use server"

import { createClient } from "@/lib/supabase/server"
import { mapNotification } from "@/lib/mappers"
import type { AppNotification } from "@/types"
import { revalidatePath } from "next/cache"

export async function listNotifications(userId: string): Promise<AppNotification[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50)
  if (error) throw new Error(error.message)
  return (data ?? []).map(mapNotification)
}

export async function markNotificationRead(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.from("notifications").update({ read: true }).eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/dashboard")
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.from("notifications").update({ read: true }).eq("user_id", userId).eq("read", false)
  if (error) throw new Error(error.message)
  revalidatePath("/dashboard")
}

export async function deleteNotification(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.from("notifications").delete().eq("id", id)
  if (error) throw new Error(error.message)
}
