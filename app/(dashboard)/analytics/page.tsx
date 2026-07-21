import type { Metadata } from "next"
import { getActiveWorkspace } from "@/lib/get-active-workspace"
import { getAnalyticsSummary, getAnalyticsTimeseries, getTopContent } from "@/services/analytics-service"
import { AnalyticsOverview } from "@/features/dashboard/analytics-overview"
import { ViewsChart } from "@/features/analytics/views-chart"
import { TopContent } from "@/features/analytics/top-content"

export const metadata: Metadata = { title: "Analytics — AI Creative OS" }

export default async function AnalyticsPage() {
  const { workspace } = await getActiveWorkspace()
  const [summary, timeseries, topContent] = await Promise.all([
    getAnalyticsSummary(workspace.id),
    getAnalyticsTimeseries(workspace.id),
    getTopContent(workspace.id),
  ])

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <p className="text-sm text-[var(--color-muted)]">How your content is performing across every platform.</p>
      </div>
      <AnalyticsOverview summary={summary} />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2"><ViewsChart data={timeseries} /></div>
        <TopContent items={topContent} />
      </div>
    </div>
  )
}
