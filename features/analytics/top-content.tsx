import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatNumber } from "@/lib/utils"
import type { TopContentItem } from "@/types"
import { Play } from "lucide-react"
import { YoutubeIcon, InstagramIcon } from "@/components/ui/brand-icons"

const PLATFORM_ICON = { youtube: YoutubeIcon, instagram: InstagramIcon }

export function TopContent({ items }: { items: TopContentItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[var(--color-foreground)]">Top Performing Content</CardTitle>
      </CardHeader>
      <div className="space-y-2 px-5 pb-5">
        {items.length === 0 ? (
          <p className="py-6 text-center text-sm text-[var(--color-muted)]">Publish something to see performance here</p>
        ) : (
          items.map((item, i) => {
            const Icon = PLATFORM_ICON[item.platform]
            return (
              <div key={item.id} className="flex items-center gap-3 rounded-lg p-2 hover:bg-white/5">
                <span className="w-5 text-sm font-medium text-[var(--color-muted)]">{i + 1}</span>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white/5">
                  {item.thumbnailUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.thumbnailUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <Play className="h-4 w-4 text-[var(--color-muted)]" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">{item.title}</p>
                  <div className="flex items-center gap-1 text-xs text-[var(--color-muted)]">
                    <Icon className="h-3 w-3" /> {formatNumber(item.views)} views
                  </div>
                </div>
                <Badge variant="muted">{item.engagementRate}%</Badge>
              </div>
            )
          })
        )}
      </div>
    </Card>
  )
}
