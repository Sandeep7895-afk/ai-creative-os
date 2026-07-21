import type { Metadata } from "next"
import { listSystemLogs } from "@/services/admin-service"
import { SystemLogTable } from "@/features/admin/system-log-table"

export const metadata: Metadata = { title: "System Logs — AI Creative OS" }

export default async function SystemLogsPage() {
  const logs = await listSystemLogs()

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">System Logs</h1>
        <p className="text-sm text-[var(--color-muted)]">Admin only. Platform-level events across every workspace.</p>
      </div>
      <SystemLogTable logs={logs} />
    </div>
  )
}
