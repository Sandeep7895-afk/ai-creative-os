import type { Metadata } from "next"
import { getActiveWorkspace } from "@/lib/get-active-workspace"
import { listPrompts } from "@/services/prompt-service"
import { PromptTable } from "@/features/prompt-library/prompt-table"

export const metadata: Metadata = { title: "Prompt Library — AI Creative OS" }

export default async function PromptLibraryPage() {
  const { workspace } = await getActiveWorkspace()
  const prompts = await listPrompts(workspace.id)

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Prompt Library</h1>
        <p className="text-sm text-[var(--color-muted)]">Organize, tag, and queue the prompts that feed every generator.</p>
      </div>
      <PromptTable workspaceId={workspace.id} initialPrompts={prompts} />
    </div>
  )
}
