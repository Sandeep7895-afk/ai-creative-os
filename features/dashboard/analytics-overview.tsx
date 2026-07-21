import { Card, CardHeader, CardTitle, CardValue } from "@/components/ui/card"
import { Clapperboard, ImageIcon, Send, Eye, TrendingUp } from "lucide-react"
import { formatNumber } from "@/lib/utils"
import type { AnalyticsSummary } from "@/types"

export function AnalyticsOverview({ summary }: { summary: AnalyticsSummary }) {
  const cards = [
    { label: "Generated Videos", value: summary.generatedVideos, icon: Clapperboard },
    { label: "Generated Images", value: summary.generatedImages, icon: ImageIcon },
    { label: "Published Posts", value: summary.publishedPosts, icon: Send },
    { label: "Views", value: formatNumber(summary.totalViews), icon: Eye },
    { label: "Engagement", value: `${summary.engagementRate}%`, icon: TrendingUp },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {cards.map((c) => (
        <Card key={c.label}>
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>{c.label}</CardTitle>
            <c.icon className="h-3.5 w-3.5 text-[var(--color-muted)]" />
          </CardHeader>
          <div className="px-5 pb-5">
            <CardValue>{c.value}</CardValue>
          </div>
        </Card>
      ))}
    </div>
  )
}
