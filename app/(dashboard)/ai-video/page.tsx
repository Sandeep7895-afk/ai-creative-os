import type { Metadata } from "next"
import { getActiveWorkspace } from "@/lib/get-active-workspace"
import { listGenerationJobs } from "@/services/generation-service"
import { GenerationWorkflow } from "@/features/generation/generation-workflow"

export const metadata: Metadata = { title: "AI Video — AI Creative OS" }

export default async function AiVideoPage() {
  const { workspace } = await getActiveWorkspace()
  const jobs = await listGenerationJobs(workspace.id, "video")

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">AI Video</h1>
        <p className="text-sm text-[var(--color-muted)]">Prompt → generate → preview → download → publish. Nothing goes live without your review.</p>
      </div>
      <GenerationWorkflow
        workspaceId={workspace.id}
        kind="video"
        providers={[{ id: "runway-gen4", label: "Runway Gen-4" }, { id: "luma-ray", label: "Luma Ray" }, { id: "kling", label: "Kling" }]}
        placeholder="Describe the video you want — scene, style, mood, duration…"
        initialJobs={jobs}
      />
    </div>
  )
}
