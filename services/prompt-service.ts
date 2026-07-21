"use server"

import { createClient } from "@/lib/supabase/server"
import { mapPrompt } from "@/lib/mappers"
import type { Prompt, PromptInsert, PromptUpdate } from "@/types"
import { revalidatePath } from "next/cache"

export async function listPrompts(workspaceId: string): Promise<Prompt[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("prompts")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []).map(mapPrompt)
}

export async function createPrompt(input: PromptInsert): Promise<Prompt> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("prompts")
    .insert({
      workspace_id: input.workspaceId,
      title: input.title,
      prompt: input.prompt,
      category: input.category,
      description: input.description,
      hashtags: input.hashtags,
      status: input.status,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  revalidatePath("/prompt-library")
  return mapPrompt(data)
}

export async function updatePrompt(id: string, input: PromptUpdate): Promise<Prompt> {
  const supabase = await createClient()
  const patch: Record<string, unknown> = {}
  if (input.title !== undefined) patch.title = input.title
  if (input.prompt !== undefined) patch.prompt = input.prompt
  if (input.category !== undefined) patch.category = input.category
  if (input.description !== undefined) patch.description = input.description
  if (input.hashtags !== undefined) patch.hashtags = input.hashtags
  if (input.status !== undefined) patch.status = input.status

  const { data, error } = await supabase.from("prompts").update(patch).eq("id", id).select().single()
  if (error) throw new Error(error.message)
  revalidatePath("/prompt-library")
  return mapPrompt(data)
}

export async function deletePrompt(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.from("prompts").delete().eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/prompt-library")
}

/** Bulk insert parsed rows from a CSV/Excel import (see features/prompt-library/import-dialog.tsx). */
export async function bulkImportPrompts(
  workspaceId: string,
  rows: Array<{ title: string; prompt: string; category?: string; description?: string; hashtags?: string[] }>
): Promise<number> {
  const supabase = await createClient()
  const payload = rows.map((row) => ({
    workspace_id: workspaceId,
    title: row.title,
    prompt: row.prompt,
    category: row.category ?? "general",
    description: row.description ?? null,
    hashtags: row.hashtags ?? [],
    status: "pending" as const,
  }))

  const { error, count } = await supabase.from("prompts").insert(payload, { count: "exact" })
  if (error) throw new Error(error.message)
  revalidatePath("/prompt-library")
  return count ?? payload.length
}
