"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AddCredentialDialog } from "./add-credential-dialog"
import { revokeApiCredential, listApiCredentials } from "@/services/admin-service"
import { ShieldOff } from "lucide-react"
import type { ApiCredential } from "@/types"

const STATUS_VARIANT = { active: "success", expiring: "warning", expired: "danger", revoked: "muted" } as const

export function ApiCredentialTable({ initialCredentials }: { initialCredentials: ApiCredential[] }) {
  const [credentials, setCredentials] = useState(initialCredentials)

  async function refresh() {
    setCredentials(await listApiCredentials())
  }

  async function handleRevoke(id: string) {
    setCredentials((prev) => prev.map((c) => (c.id === id ? { ...c, status: "revoked" } : c)))
    try {
      await revokeApiCredential(id)
      toast.success("Credential revoked")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't revoke")
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <AddCredentialDialog onAdded={refresh} />
      </div>
      <div className="glass rounded-[var(--radius-card)]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Provider</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Key</TableHead>
              <TableHead>Credits</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {credentials.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-sm text-[var(--color-muted)]">
                  No API credentials configured yet
                </TableCell>
              </TableRow>
            ) : (
              credentials.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.providerName}</TableCell>
                  <TableCell className="text-[var(--color-muted)]">{c.providerKind.replace(/_/g, " ")}</TableCell>
                  <TableCell className="font-mono text-xs">{c.maskedKey}</TableCell>
                  <TableCell>{c.creditsRemaining ?? "—"}</TableCell>
                  <TableCell><Badge variant={STATUS_VARIANT[c.status]}>{c.status}</Badge></TableCell>
                  <TableCell className="text-right">
                    {c.status !== "revoked" && (
                      <Button variant="ghost" size="sm" className="text-[var(--color-danger)]" onClick={() => handleRevoke(c.id)}>
                        <ShieldOff className="h-3.5 w-3.5" /> Revoke
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
