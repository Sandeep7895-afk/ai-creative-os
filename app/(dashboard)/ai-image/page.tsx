import type { Metadata } from "next"
import { getActiveWorkspace } from "@/lib/get-active-workspace"
import { listGenerationJobs } from "@/services/generation-service"
import { GenerationWorkflow } from "@/features/generation/generation-workflow"

export const metadata: Metadata = { title: "AI Image — AI Creative OS" }

export default async function AiImagePage() {
  const { workspace } = await getActiveWorkspace()
  const jobs = await listGenerationJobs(workspace.id, "image")

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">AI Image</h1>
        <p className="text-sm text-[var(--color-muted)]">Prompt → generate → preview → download.</p>
      </div>
      <GenerationWorkflow
        workspaceId={workspace.id}
        kind="image"
        providers={[{ id: "flux-1.1-pro", label: "Flux 1.1 Pro" }, { id: "midjourney", label: "Midjourney" }, { id: "ideogram", label: "Ideogram" }]}
        placeholder="Describe the image — subject, style, lighting, aspect ratio…"
        initialJobs={jobs}
      />
    </div>
  )
}
