"use client"

import { useRouter } from "next/navigation"
import {
  Bell, Video, ImageIcon, Upload, CheckCircle2, XCircle,
  Sparkles, TrendingUp, AlertTriangle, Clock, Trash2, Eye, Send, RotateCw,
} from "lucide-react"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useNotifications } from "@/hooks/use-notifications"
import { useSession } from "@/providers/session-provider"
import { timeAgo, cn } from "@/lib/utils"
import type { AppNotification, NotificationType } from "@/types"
import { retryGenerationJob } from "@/services/generation-service"

const ICONS: Record<NotificationType, typeof Bell> = {
  video_generated: Video,
  video_failed: XCircle,
  image_ready: ImageIcon,
  upload_started: Upload,
  upload_complete: CheckCircle2,
  upload_failed: XCircle,
  prompt_completed: Sparkles,
  analytics_milestone: TrendingUp,
  api_credits_low: AlertTriangle,
  api_expiring: AlertTriangle,
  schedule_reminder: Clock,
}

function ActionButton({ n, action, onRemove }: { n: AppNotification; action: string; onRemove: () => void }) {
  const router = useRouter()
  const iconMap = { Preview: Eye, Post: Send, Retry: RotateCw, Delete: Trash2, View: Eye } as const
  const Icon = iconMap[action as keyof typeof iconMap] ?? Eye

  async function handleClick() {
    if (action === "Delete") return onRemove()
    if (action === "Retry" && n.relatedJobId) return retryGenerationJob(n.relatedJobId)
    if (action === "Preview" && n.relatedJobId) return router.push(`/assets?job=${n.relatedJobId}`)
    if (action === "Post") return router.push("/publish")
  }

  return (
    <Button variant="outline" size="sm" onClick={handleClick} className="h-7 gap-1 px-2 text-xs">
      <Icon className="h-3 w-3" /> {action}
    </Button>
  )
}

export function NotificationCenter({
  userId,
  initialNotifications,
}: {
  userId: string
  initialNotifications: AppNotification[]
}) {
  const { notifications, unreadCount, markRead, markAllRead, remove } = useNotifications(userId, initialNotifications)

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-[var(--color-muted)] hover:bg-white/5 hover:text-[var(--color-foreground)]">
          <Bell className="h-4.5 w-4.5" />
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-[var(--color-primary)]" />
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="flex flex-col p-0">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] p-4">
          <h2 className="font-semibold">Notifications</h2>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="text-xs text-[var(--color-primary-muted)] hover:underline">
              Mark all read
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center">
              <Bell className="h-8 w-8 text-[var(--color-muted)]" />
              <p className="text-sm text-[var(--color-muted)]">You&apos;re all caught up</p>
            </div>
          ) : (
            <ul className="divide-y divide-[var(--color-border)]">
              {notifications.map((n) => {
                const Icon = ICONS[n.type] ?? Bell
                return (
                  <li
                    key={n.id}
                    onClick={() => !n.read && markRead(n.id)}
                    className={cn("flex gap-3 p-4 transition-colors", !n.read && "bg-[var(--color-primary)]/5")}
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5">
                      <Icon className="h-4 w-4 text-[var(--color-muted)]" />
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <p className="text-sm font-medium leading-snug">{n.title}</p>
                      <p className="text-xs text-[var(--color-muted)]">{n.message}</p>
                      <p className="text-[11px] text-[var(--color-muted)]">{timeAgo(n.createdAt)}</p>
                      {n.actions.length > 0 && (
                        <div className="flex gap-1.5 pt-1">
                          {n.actions.map((a) => (
                            <ActionButton key={a.label} n={n} action={a.label} onRemove={() => remove(n.id)} />
                          ))}
                        </div>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
