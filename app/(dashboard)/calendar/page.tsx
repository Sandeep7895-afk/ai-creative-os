import type { Metadata } from "next"
import { getActiveWorkspace } from "@/lib/get-active-workspace"
import { listPublishJobs } from "@/services/publish-service"
import { MonthCalendar } from "@/features/calendar/month-calendar"

export const metadata: Metadata = { title: "Calendar — AI Creative OS" }

export default async function CalendarPage() {
  const { workspace } = await getActiveWorkspace()
  const jobs = await listPublishJobs(workspace.id)

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Calendar</h1>
        <p className="text-sm text-[var(--color-muted)]">Scheduled and published posts across your destinations.</p>
      </div>
      <MonthCalendar jobs={jobs} />
    </div>
  )
}
