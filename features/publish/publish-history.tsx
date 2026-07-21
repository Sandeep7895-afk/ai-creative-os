import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { timeAgo } from "@/lib/utils"
import type { PublishJob } from "@/types"

const STATUS_VARIANT = { draft: "muted", scheduled: "info", publishing: "warning", published: "success", failed: "danger" } as const

export function PublishHistory({ jobs }: { jobs: PublishJob[] }) {
  return (
    <Card>
      <div className="p-5 pb-0">
        <h2 className="font-semibold">History</h2>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Caption</TableHead>
            <TableHead>Platform</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>When</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="py-10 text-center text-sm text-[var(--color-muted)]">
                Nothing published yet
              </TableCell>
            </TableRow>
          ) : (
            jobs.map((j) => (
              <TableRow key={j.id}>
                <TableCell className="max-w-xs truncate">{j.caption || "Untitled"}</TableCell>
                <TableCell className="capitalize">{j.platform}</TableCell>
                <TableCell><Badge variant={STATUS_VARIANT[j.status]}>{j.status}</Badge></TableCell>
                <TableCell className="text-[var(--color-muted)]">{timeAgo(j.createdAt)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  )
}
