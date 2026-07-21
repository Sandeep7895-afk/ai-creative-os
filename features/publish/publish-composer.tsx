"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Send, Calendar, Loader2 } from "lucide-react"
import { publishToDestination } from "@/services/publish-service"
import type { GenerationJob, PublishAccount, PublishPlatform } from "@/types"

export function PublishComposer({
  workspaceId,
  readyJobs,
  accounts,
  preselectedJobId,
}: {
  workspaceId: string
  readyJobs: GenerationJob[]
  accounts: PublishAccount[]
  preselectedJobId?: string
}) {
  const [jobId, setJobId] = useState(preselectedJobId ?? readyJobs[0]?.id ?? "")
  const [accountId, setAccountId] = useState(accounts[0]?.id ?? "")
  const [caption, setCaption] = useState("")
  const [hashtags, setHashtags] = useState("")
  const [scheduledFor, setScheduledFor] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const selectedAccount = accounts.find((a) => a.id === accountId)

  async function handlePublish() {
    if (!jobId) return toast.error("Pick a piece of content to publish")
    if (!accountId || !selectedAccount) return toast.error("Connect and select an account first")
    if (!selectedAccount.connected) return toast.error(`Connect your ${selectedAccount.platform} account first`)

    setSubmitting(true)
    try {
      await publishToDestination({
        workspaceId,
        generationJobId: jobId,
        platform: selectedAccount.platform as PublishPlatform,
        accountId,
        caption,
        hashtags: hashtags.split(",").map((h) => h.trim().replace(/^#/, "")).filter(Boolean),
        scheduledFor: scheduledFor || null,
      })
      toast.success(scheduledFor ? "Scheduled" : "Publishing started")
      setCaption("")
      setHashtags("")
      setScheduledFor("")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't publish")
    } finally {
      setSubmitting(false)
    }
  }

  if (readyJobs.length === 0) {
    return (
      <Card className="p-8 text-center text-sm text-[var(--color-muted)]">
        Nothing ready to publish yet — generate and preview content first.
      </Card>
    )
  }

  return (
    <Card className="flex flex-col gap-4 p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Content</label>
          <Select value={jobId} onValueChange={setJobId}>
            <SelectTrigger><SelectValue placeholder="Choose generated content" /></SelectTrigger>
            <SelectContent>
              {readyJobs.map((j) => (
                <SelectItem key={j.id} value={j.id}>{j.inputPrompt.slice(0, 50)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Account</label>
          <Select value={accountId} onValueChange={setAccountId}>
            <SelectTrigger><SelectValue placeholder="Choose destination" /></SelectTrigger>
            <SelectContent>
              {accounts.map((a) => (
                <SelectItem key={a.id} value={a.id}>{a.platform} — {a.accountName}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Caption</label>
        <Textarea rows={3} value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Write a caption…" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Hashtags</label>
          <Input value={hashtags} onChange={(e) => setHashtags(e.target.value)} placeholder="motivation, shorts" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Schedule (optional)</label>
          <Input type="datetime-local" value={scheduledFor} onChange={(e) => setScheduledFor(e.target.value)} />
        </div>
      </div>

      <Button onClick={handlePublish} disabled={submitting} className="self-end">
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : scheduledFor ? <Calendar className="h-4 w-4" /> : <Send className="h-4 w-4" />}
        {scheduledFor ? "Schedule" : "Publish now"}
      </Button>
    </Card>
  )
}
