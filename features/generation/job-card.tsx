"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { timeAgo } from "@/lib/utils"
import { Eye, RotateCw, Trash2, ImageIcon, Clapperboard, Mic, FileText } from "lucide-react"
import type { GenerationJob } from "@/types"

const STATUS_VARIANT = { queued: "muted", generating: "info", ready: "success", failed: "danger" } as const
const KIND_ICON = { video: Clapperboard, image: ImageIcon, voice: Mic, pdf: FileText, blog: FileText }

export function JobCard({
  job,
  onPreview,
  onRetry,
  onDelete,
}: {
  job: GenerationJob
  onPreview: (job: GenerationJob) => void
  onRetry: (job: GenerationJob) => void
  onDelete: (job: GenerationJob) => void
}) {
  const Icon = KIND_ICON[job.kind]

  return (
    <Card className="flex flex-col overflow-hidden">
      <button
        onClick={() => onPreview(job)}
        className="flex aspect-video items-center justify-center bg-black/30 transition-opacity hover:opacity-90"
      >
        {job.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={job.thumbnailUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <Icon className="h-8 w-8 text-[var(--color-muted)]" />
        )}
      </button>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="line-clamp-2 text-sm">{job.inputPrompt}</p>
          <Badge variant={STATUS_VARIANT[job.status]} className="shrink-0">{job.status}</Badge>
        </div>
        {job.status === "generating" && <Progress value={job.progress} />}
        {job.status === "failed" && job.errorMessage && (
          <p className="text-xs text-[var(--color-danger)]">{job.errorMessage}</p>
        )}
        <p className="text-xs text-[var(--color-muted)]">{job.provider} · {timeAgo(job.createdAt)}</p>

        <div className="mt-auto flex gap-1.5 pt-2">
          <Button size="sm" variant="secondary" className="flex-1" onClick={() => onPreview(job)}>
            <Eye className="h-3.5 w-3.5" /> Preview
          </Button>
          {job.status === "failed" && (
            <Button size="sm" variant="outline" onClick={() => onRetry(job)}>
              <RotateCw className="h-3.5 w-3.5" />
            </Button>
          )}
          <Button size="sm" variant="ghost" className="text-[var(--color-danger)]" onClick={() => onDelete(job)}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
