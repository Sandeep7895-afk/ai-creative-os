import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Target, ArrowRight } from "lucide-react"
import Link from "next/link"

export function TodaysMission({ pendingPrompts, queuedJobs }: { pendingPrompts: number; queuedJobs: number }) {
  const hasWork = pendingPrompts > 0 || queuedJobs > 0

  return (
    <Card className="flex items-center justify-between gap-4 p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary)]/15">
          <Target className="h-5 w-5 text-[var(--color-primary-muted)]" />
        </div>
        <div>
          <p className="text-sm font-medium">Today&apos;s mission</p>
          <p className="text-xs text-[var(--color-muted)]">
            {hasWork
              ? `${pendingPrompts} prompt${pendingPrompts === 1 ? "" : "s"} waiting, ${queuedJobs} job${queuedJobs === 1 ? "" : "s"} in queue`
              : "Nothing queued — start something new"}
          </p>
        </div>
      </div>
      <Button asChild size="sm" variant="secondary">
        <Link href="/prompt-library">
          {hasWork ? "Review queue" : "Add a prompt"} <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </Button>
    </Card>
  )
}
