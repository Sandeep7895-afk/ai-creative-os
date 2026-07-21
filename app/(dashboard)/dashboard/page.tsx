import type { Metadata } from "next"
import { getActiveWorkspace } from "@/lib/get-active-workspace"
import { listPrompts } from "@/services/prompt-service"
import { listGenerationJobs } from "@/services/generation-service"
import { listPublishJobs } from "@/services/publish-service"
import { getAnalyticsSummary } from "@/services/analytics-service"
import { TodaysMission } from "@/features/dashboard/todays-mission"
import { QuickActions } from "@/features/dashboard/quick-actions"
import { AnalyticsOverview } from "@/features/dashboard/analytics-overview"
import { LiveQueue } from "@/features/dashboard/live-queue"
import { RecentProjects } from "@/features/dashboard/recent-projects"
import { RecentActivity } from "@/features/dashboard/recent-activity"
import { PublishStatus } from "@/features/dashboard/publish-status"

export const metadata: Metadata = { title: "Dashboard — AI Creative OS" }

export default async function DashboardPage() {
  const { workspace } = await getActiveWorkspace()

  const [prompts, jobs, publishJobs, summary] = await Promise.all([
    listPrompts(workspace.id),
    listGenerationJobs(workspace.id),
    listPublishJobs(workspace.id),
    getAnalyticsSummary(workspace.id),
  ])

  const pendingPrompts = prompts.filter((p) => p.status === "pending").length
  const queuedJobs = jobs.filter((j) => j.status === "queued" || j.status === "generating").length

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">{workspace.name}</h1>
        <p className="text-sm text-[var(--color-muted)]">Here&apos;s where things stand today.</p>
      </div>

      <TodaysMission pendingPrompts={pendingPrompts} queuedJobs={queuedJobs} />
      <QuickActions />
      <AnalyticsOverview summary={summary} />

      <div className="grid gap-6 lg:grid-cols-3">
        <LiveQueue jobs={jobs} />
        <RecentProjects jobs={jobs} />
        <PublishStatus jobs={publishJobs} />
      </div>

      <RecentActivity prompts={prompts} />
    </div>
  )
}
