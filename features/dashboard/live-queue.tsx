import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clapperboard, ImageIcon, Mic, FileText } from "lucide-react"
import type { GenerationJob } from "@/types"

const KIND_ICON = { video: Clapperboard, image: ImageIcon, voice: Mic, pdf: FileText, blog: FileText }
const STATUS_VARIANT = { queued: "muted", generating: "info", ready: "success", failed: "danger" } as const

export function LiveQueue({ jobs }: { jobs: GenerationJob[] }) {
  const active = jobs.filter((j) => j.status === "queued" || j.status === "generating")

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[var(--color-foreground)]">Live Queue</CardTitle>
      </CardHeader>
      <div className="space-y-3 px-5 pb-5">
        {active.length === 0 ? (
          <p className="py-6 text-center text-sm text-[var(--color-muted)]">Nothing generating right now</p>
        ) : (
          active.map((job) => {
            const Icon = KIND_ICON[job.kind]
            return (
              <div key={job.id} className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5">
                  <Icon className="h-4 w-4 text-[var(--color-muted)]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">{job.inputPrompt}</p>
                  <Progress value={job.progress} className="mt-1.5" />
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
