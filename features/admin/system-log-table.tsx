"use client"

import { useState } from "react"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { timeAgo } from "@/lib/utils"
import type { SystemLogEntry } from "@/types"

const LEVEL_VARIANT = { info: "info", warning: "warning", error: "danger" } as const

export function SystemLogTable({ logs }: { logs: SystemLogEntry[] }) {
  const [levelFilter, setLevelFilter] = useState<string>("all")
  const filtered = levelFilter === "all" ? logs : logs.filter((l) => l.level === levelFilter)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Select value={levelFilter} onValueChange={setLevelFilter}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All levels</SelectItem>
            <SelectItem value="info">Info</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="error">Error</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="glass rounded-[var(--radius-card)]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Level</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>When</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-10 text-center text-sm text-[var(--color-muted)]">
                  No log entries
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((log) => (
                <TableRow key={log.id}>
                  <TableCell><Badge variant={LEVEL_VARIANT[log.level]}>{log.level}</Badge></TableCell>
                  <TableCell className="font-mono text-xs">{log.source}</TableCell>
                  <TableCell className="max-w-md truncate">{log.message}</TableCell>
                  <TableCell className="text-[var(--color-muted)]">{timeAgo(log.createdAt)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
