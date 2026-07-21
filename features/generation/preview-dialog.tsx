"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, Send } from "lucide-react"
import Link from "next/link"
import type { GenerationJob } from "@/types"

export function PreviewDialog({
  job,
  open,
  onOpenChange,
}: {
  job: GenerationJob | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  if (!job) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Preview</DialogTitle>
          <DialogDescription>{job.inputPrompt}</DialogDescription>
        </DialogHeader>

        <div className="flex aspect-video items-center justify-center overflow-hidden rounded-[var(--radius-control)] bg-black/40">
          {job.status !== "ready" || !job.resultUrl ? (
            <p className="text-sm text-[var(--color-muted)]">
              {job.status === "failed" ? job.errorMessage ?? "Generation failed" : "Still generating…"}
            </p>
          ) : job.kind === "video" ? (
            <video src={job.resultUrl} controls className="h-full w-full" />
          ) : job.kind === "voice" ? (
            <audio src={job.resultUrl} controls className="w-full px-6" />
          ) : job.kind === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={job.resultUrl} alt={job.inputPrompt} className="h-full w-full object-contain" />
          ) : (
            <a href={job.resultUrl} target="_blank" rel="noreferrer" className="text-sm text-[var(--color-primary-muted)] underline">
              Open document
            </a>
          )}
        </div>

        {job.status === "ready" && job.resultUrl && (
          <div className="flex gap-2 pt-2">
            <Button asChild variant="secondary" className="flex-1">
              <a href={job.resultUrl} download>
                <Download className="h-4 w-4" /> Download
              </a>
            </Button>
            <Button asChild className="flex-1">
              <Link href={`/publish?job=${job.id}`}>
                <Send className="h-4 w-4" /> Publish
              </Link>
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
