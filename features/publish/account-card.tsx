"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Link2 } from "lucide-react"
import { YoutubeIcon, InstagramIcon } from "@/components/ui/brand-icons"
import type { PublishAccount, PublishPlatform } from "@/types"

const PLATFORM_META: Record<PublishPlatform, { label: string; icon: typeof YoutubeIcon; color: string }> = {
  youtube: { label: "YouTube", icon: YoutubeIcon, color: "#FF0000" },
  instagram: { label: "Instagram", icon: InstagramIcon, color: "#E1306C" },
}

export function AccountCard({ platform, account }: { platform: PublishPlatform; account: PublishAccount | undefined }) {
  const meta = PLATFORM_META[platform]
  const Icon = meta.icon

  return (
    <Card className="flex items-center justify-between gap-3 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
          <Icon className="h-5 w-5" style={{ color: meta.color }} />
        </div>
        <div>
          <p className="text-sm font-medium">{meta.label}</p>
          <p className="text-xs text-[var(--color-muted)]">{account?.accountName ?? "Not connected"}</p>
        </div>
      </div>
      {account?.connected ? (
        <Badge variant="success">Connected</Badge>
      ) : (
        <Button size="sm" variant="secondary">
          <Link2 className="h-3.5 w-3.5" /> Connect
        </Button>
      )}
    </Card>
  )
}
