import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { timeAgo } from "@/lib/utils"
import type { GenerationJob } from "@/types"
import { ImageIcon } from "lucide-react"

const STATUS_VARIANT = { queued: "muted", generating: "info", ready: "success", failed: "danger" } as const

export function RecentProjects({ jobs }: { jobs: GenerationJob[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[var(--color-foreground)]">Recent Projects</CardTitle>
      </CardHeader>
      <div className="space-y-2 px-5 pb-5">
        {jobs.length === 0 ? (
          <p className="py-6 text-center text-sm text-[var(--color-muted)]">No projects yet — generate your first one</p>
        ) : (
          jobs.slice(0, 6).map((job) => (
            <div key={job.id} className="flex items-center gap-3 rounded-lg p-2 hover:bg-white/5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white/5">
                {job.thumbnailUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={job.thumbnailUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <ImageIcon className="h-4 w-4 text-[var(--color-muted)]" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">{job.inputPrompt}</p>
                <p className="text-xs text-[var(--color-muted)]">{job.kind} · {timeAgo(job.createdAt)}</p>
              </div>
              <Badge variant={STATUS_VARIANT[job.status]}>{job.status}</Badge>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}
