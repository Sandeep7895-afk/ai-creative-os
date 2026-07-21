"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Sparkles, Loader2 } from "lucide-react"
import { createGenerationJob, retryGenerationJob, deleteGenerationJob } from "@/services/generation-service"
import { JobCard } from "./job-card"
import { PreviewDialog } from "./preview-dialog"
import type { GenerationJob, GenerationKind } from "@/types"

export function GenerationWorkflow({
  workspaceId,
  kind,
  providers,
  placeholder,
  initialJobs,
}: {
  workspaceId: string
  kind: GenerationKind
  providers: { id: string; label: string }[]
  placeholder: string
  initialJobs: GenerationJob[]
}) {
  const [jobs, setJobs] = useState(initialJobs)
  const [prompt, setPrompt] = useState("")
  const [provider, setProvider] = useState(providers[0]?.id ?? "")
  const [submitting, setSubmitting] = useState(false)
  const [previewJob, setPreviewJob] = useState<GenerationJob | null>(null)

  async function handleGenerate() {
    if (!prompt.trim()) return toast.error("Write a prompt first")
    setSubmitting(true)
    try {
      const job = await createGenerationJob({ workspaceId, promptId: null, kind, provider, inputPrompt: prompt.trim() })
      setJobs((prev) => [job, ...prev])
      setPrompt("")
      toast.success("Queued — this'll show up in Live Queue on your dashboard too")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't queue generation")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleRetry(job: GenerationJob) {
    const updated = await retryGenerationJob(job.id)
    setJobs((prev) => prev.map((j) => (j.id === job.id ? updated : j)))
  }

  async function handleDelete(job: GenerationJob) {
    setJobs((prev) => prev.filter((j) => j.id !== job.id))
    await deleteGenerationJob(job.id)
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="p-5">
        <div className="flex flex-col gap-3">
          <Textarea
            placeholder={placeholder}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
          />
          <div className="flex flex-wrap items-center gap-2">
            <Select value={provider} onValueChange={setProvider}>
              <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                {providers.map((p) => <SelectItem key={p.id} value={p.id}>{p.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button onClick={handleGenerate} disabled={submitting} className="ml-auto">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Generate
            </Button>
          </div>
        </div>
      </Card>

      {jobs.length === 0 ? (
        <Card className="flex flex-col items-center gap-2 p-12 text-center">
          <Sparkles className="h-8 w-8 text-[var(--color-muted)]" />
          <p className="text-sm text-[var(--color-muted)]">Nothing generated yet — write a prompt above to get started</p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} onPreview={setPreviewJob} onRetry={handleRetry} onDelete={handleDelete} />
          ))}
        </div>
      )}

      <PreviewDialog job={previewJob} open={!!previewJob} onOpenChange={(o) => !o && setPreviewJob(null)} />
    </div>
  )
}
