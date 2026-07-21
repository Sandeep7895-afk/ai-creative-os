import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { timeAgo } from "@/lib/utils"
import type { PublishJob } from "@/types"
import { YoutubeIcon, InstagramIcon } from "@/components/ui/brand-icons"

const PLATFORM_ICON = { youtube: YoutubeIcon, instagram: InstagramIcon }
const STATUS_VARIANT = { draft: "muted", scheduled: "info", publishing: "warning", published: "success", failed: "danger" } as const

export function PublishStatus({ jobs }: { jobs: PublishJob[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[var(--color-foreground)]">Publish Status</CardTitle>
      </CardHeader>
      <div className="space-y-2 px-5 pb-5">
        {jobs.length === 0 ? (
          <p className="py-6 text-center text-sm text-[var(--color-muted)]">Nothing published yet</p>
        ) : (
          jobs.slice(0, 6).map((job) => {
            const Icon = PLATFORM_ICON[job.platform]
            return (
              <div key={job.id} className="flex items-center gap-3 rounded-lg p-2 hover:bg-white/5">
                <Icon className="h-4 w-4 shrink-0 text-[var(--color-muted)]" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">{job.caption || "Untitled post"}</p>
                  <p className="text-xs text-[var(--color-muted)]">{timeAgo(job.createdAt)}</p>
                </div>
                <Badge variant={STATUS_VARIANT[job.status]}>{job.status}</Badge>
              </div>
            )
          })
        )}
      </div>
    </Card>
  )
}
