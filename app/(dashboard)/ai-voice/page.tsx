import type { Metadata } from "next"
import { getActiveWorkspace } from "@/lib/get-active-workspace"
import { listGenerationJobs } from "@/services/generation-service"
import { GenerationWorkflow } from "@/features/generation/generation-workflow"

export const metadata: Metadata = { title: "AI Voice — AI Creative OS" }

export default async function AiVoicePage() {
  const { workspace } = await getActiveWorkspace()
  const jobs = await listGenerationJobs(workspace.id, "voice")

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">AI Voice</h1>
        <p className="text-sm text-[var(--color-muted)]">Turn a script into narration — preview before you use it anywhere.</p>
      </div>
      <GenerationWorkflow
        workspaceId={workspace.id}
        kind="voice"
        providers={[{ id: "elevenlabs", label: "ElevenLabs" }, { id: "playht", label: "PlayHT" }]}
        placeholder="Paste the script to narrate…"
        initialJobs={jobs}
      />
    </div>
  )
}
