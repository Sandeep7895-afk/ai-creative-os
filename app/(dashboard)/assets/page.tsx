import type { Metadata } from "next"
import { getActiveWorkspace } from "@/lib/get-active-workspace"
import { listAssets } from "@/services/asset-service"
import { AssetGrid } from "@/features/assets/asset-grid"

export const metadata: Metadata = { title: "Assets — AI Creative OS" }

export default async function AssetsPage() {
  const { workspace } = await getActiveWorkspace()
  const assets = await listAssets(workspace.id)

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Assets</h1>
        <p className="text-sm text-[var(--color-muted)]">Every file this workspace has generated, in one place.</p>
      </div>
      <AssetGrid initialAssets={assets} />
    </div>
  )
}
