"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Trash2, FileImage, FileVideo, FileAudio, FileText } from "lucide-react"
import { deleteAsset } from "@/services/asset-service"
import type { Asset } from "@/types"

const KIND_ICON = { video: FileVideo, image: FileImage, audio: FileAudio, pdf: FileText }

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1024 ** 2).toFixed(1)} MB`
}

export function AssetGrid({ initialAssets }: { initialAssets: Asset[] }) {
  const [assets, setAssets] = useState(initialAssets)

  async function handleDelete(id: string) {
    const prev = assets
    setAssets((a) => a.filter((x) => x.id !== id))
    try {
      await deleteAsset(id)
    } catch (err) {
      setAssets(prev)
      toast.error(err instanceof Error ? err.message : "Couldn't delete asset")
    }
  }

  if (assets.length === 0) {
    return (
      <Card className="flex flex-col items-center gap-2 p-12 text-center">
        <FileImage className="h-8 w-8 text-[var(--color-muted)]" />
        <p className="text-sm text-[var(--color-muted)]">Generated files show up here once they&apos;re ready</p>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {assets.map((asset) => {
        const Icon = KIND_ICON[asset.kind]
        return (
          <Card key={asset.id} className="flex flex-col overflow-hidden">
            <div className="flex aspect-square items-center justify-center bg-black/30">
              {asset.thumbnailUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={asset.thumbnailUrl} alt={asset.name} className="h-full w-full object-cover" />
              ) : (
                <Icon className="h-8 w-8 text-[var(--color-muted)]" />
              )}
            </div>
            <div className="flex flex-col gap-1.5 p-3">
              <p className="truncate text-sm font-medium">{asset.name}</p>
              <div className="flex items-center justify-between">
                <Badge variant="muted">{formatBytes(asset.sizeBytes)}</Badge>
                <div className="flex gap-1">
                  <Button asChild variant="ghost" size="icon" className="h-7 w-7">
                    <a href={asset.url} download><Download className="h-3.5 w-3.5" /></a>
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-[var(--color-danger)]" onClick={() => handleDelete(asset.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
