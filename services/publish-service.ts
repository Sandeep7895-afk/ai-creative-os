"use server"

import { createClient } from "@/lib/supabase/server"
import { mapPublishAccount, mapPublishJob } from "@/lib/mappers"
import type { PublishAccount, PublishJob } from "@/types"
import { getPublishProvider } from "./publish/registry"
import { revalidatePath } from "next/cache"

export async function listPublishAccounts(workspaceId: string): Promise<PublishAccount[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("publish_accounts").select("*").eq("workspace_id", workspaceId)
  if (error) throw new Error(error.message)
  return (data ?? []).map(mapPublishAccount)
}

export async function listPublishJobs(workspaceId: string): Promise<PublishJob[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("publish_jobs")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []).map(mapPublishJob)
}

export async function publishToDestination(input: {
  workspaceId: string
  generationJobId: string
  platform: "youtube" | "instagram"
  accountId: string
  caption: string
  hashtags: string[]
  scheduledFor: string | null
}): Promise<PublishJob> {
  const provider = getPublishProvider(input.platform)
  const job = await provider.publish(input)
  revalidatePath("/publish")
  return job
}
