import type { Metadata } from "next"
import { listApiCredentials } from "@/services/admin-service"
import { ApiCredentialTable } from "@/features/admin/api-credential-table"

export const metadata: Metadata = { title: "API Manager — AI Creative OS" }

export default async function ApiManagerPage() {
  const credentials = await listApiCredentials()

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">API Manager</h1>
        <p className="text-sm text-[var(--color-muted)]">Admin only. Keys are masked everywhere — never exposed to regular users.</p>
      </div>
      <ApiCredentialTable initialCredentials={credentials} />
    </div>
  )
}
