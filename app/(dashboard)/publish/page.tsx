import type { Metadata } from "next"
import { getActiveWorkspace } from "@/lib/get-active-workspace"
import { listGenerationJobs } from "@/services/generation-service"
import { listPublishAccounts, listPublishJobs } from "@/services/publish-service"
import { listPublishProviders } from "@/services/publish/registry"
import { AccountCard } from "@/features/publish/account-card"
import { PublishComposer } from "@/features/publish/publish-composer"
import { PublishHistory } from "@/features/publish/publish-history"

export const metadata: Metadata = { title: "Publish — AI Creative OS" }

export default async function PublishPage({
  searchParams,
}: {
  searchParams: Promise<{ job?: string }>
}) {
  const { workspace } = await getActiveWorkspace()
  const { job: preselectedJobId } = await searchParams

  const [videoJobs, imageJobs, accounts, publishJobs] = await Promise.all([
    listGenerationJobs(workspace.id, "video"),
    listGenerationJobs(workspace.id, "image"),
    listPublishAccounts(workspace.id),
    listPublishJobs(workspace.id),
  ])

  const readyJobs = [...videoJobs, ...imageJobs].filter((j) => j.status === "ready")
  const providers = listPublishProviders()

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Publish</h1>
        <p className="text-sm text-[var(--color-muted)]">Send finished content to your connected destinations.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {providers.map((p) => (
          <AccountCard key={p.id} platform={p.id} account={accounts.find((a) => a.platform === p.id)} />
        ))}
      </div>

      <PublishComposer
        workspaceId={workspace.id}
        readyJobs={readyJobs}
        accounts={accounts}
        preselectedJobId={preselectedJobId}
      />

      <PublishHistory jobs={publishJobs} />
    </div>
  )
}
