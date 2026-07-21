"use server"

import { createClient } from "@/lib/supabase/server"
import { mapGenerationJob } from "@/lib/mappers"
import type { GenerationJob, GenerationKind } from "@/types"
import { revalidatePath } from "next/cache"

export async function listGenerationJobs(workspaceId: string, kind?: GenerationKind): Promise<GenerationJob[]> {
  const supabase = await createClient()
  let query = supabase.from("generation_jobs").select("*").eq("workspace_id", workspaceId)
  if (kind) query = query.eq("kind", kind)
  const { data, error } = await query.order("created_at", { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []).map(mapGenerationJob)
}

/**
 * Queues a generation job. The actual model call happens in a background
 * worker (edge function / queue consumer) keyed off this row's `id` — this
 * action only enqueues; it never fabricates a result client-side.
 */
export async function createGenerationJob(input: {
  workspaceId: string
  promptId: string | null
  kind: GenerationKind
  provider: string
  inputPrompt: string
}): Promise<GenerationJob> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("generation_jobs")
    .insert({
      workspace_id: input.workspaceId,
      prompt_id: input.promptId,
      kind: input.kind,
      provider: input.provider,
      input_prompt: input.inputPrompt,
      status: "queued",
      progress: 0,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  revalidatePath(`/ai-${input.kind}`)
  return mapGenerationJob(data)
}

export async function retryGenerationJob(id: string): Promise<GenerationJob> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("generation_jobs")
    .update({ status: "queued", progress: 0, error_message: null })
    .eq("id", id)
    .select()
    .single()
  if (error) throw new Error(error.message)
  return mapGenerationJob(data)
}

export async function deleteGenerationJob(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.from("generation_jobs").delete().eq("id", id)
  if (error) throw new Error(error.message)
}
