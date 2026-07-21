import type { Metadata } from "next"
import { getActiveWorkspace } from "@/lib/get-active-workspace"
import { listGenerationJobs } from "@/services/generation-service"
import { GenerationWorkflow } from "@/features/generation/generation-workflow"

export const metadata: Metadata = { title: "PDF / eBook — AI Creative OS" }

export default async function PdfEbookPage() {
  const { workspace } = await getActiveWorkspace()
  const [pdfJobs, blogJobs] = await Promise.all([
    listGenerationJobs(workspace.id, "pdf"),
    listGenerationJobs(workspace.id, "blog"),
  ])

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">PDF / eBook</h1>
        <p className="text-sm text-[var(--color-muted)]">Generate long-form written content — eBooks, guides, or blog posts.</p>
      </div>
      <GenerationWorkflow
        workspaceId={workspace.id}
        kind="pdf"
        providers={[{ id: "gpt-writer", label: "GPT Writer" }, { id: "claude-writer", label: "Claude Writer" }]}
        placeholder="Describe the eBook or document — topic, chapters, tone, length…"
        initialJobs={[...pdfJobs, ...blogJobs]}
      />
    </div>
  )
}
