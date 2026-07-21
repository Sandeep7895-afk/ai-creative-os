import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { timeAgo } from "@/lib/utils"
import type { Prompt } from "@/types"

export function RecentActivity({ prompts }: { prompts: Prompt[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[var(--color-foreground)]">Recent Activity</CardTitle>
      </CardHeader>
      <div className="space-y-3 px-5 pb-5">
        {prompts.length === 0 ? (
          <p className="py-6 text-center text-sm text-[var(--color-muted)]">Activity shows up here as you work</p>
        ) : (
          prompts.slice(0, 6).map((p) => (
            <div key={p.id} className="flex items-start gap-3 text-sm">
              <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary)]" />
              <div>
                <p>
                  <span className="font-medium">{p.title}</span>{" "}
                  <span className="text-[var(--color-muted)]">marked as {p.status}</span>
                </p>
                <p className="text-xs text-[var(--color-muted)]">{timeAgo(p.updatedAt)}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}
