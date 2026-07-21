"use client"

import { useMemo, useState } from "react"
import { toast } from "sonner"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Plus, Upload, Search, Pencil, Trash2 } from "lucide-react"
import { PromptFormDialog } from "./prompt-form-dialog"
import { ImportDialog } from "./import-dialog"
import { deletePrompt } from "@/services/prompt-service"
import type { Prompt, PromptStatus } from "@/types"

const STATUS_VARIANT: Record<PromptStatus, "muted" | "info" | "success" | "warning" | "danger"> = {
  pending: "muted",
  generating: "info",
  generated: "success",
  posting: "warning",
  posted: "success",
  failed: "danger",
}

export function PromptTable({ workspaceId, initialPrompts }: { workspaceId: string; initialPrompts: Prompt[] }) {
  const [prompts, setPrompts] = useState(initialPrompts)
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [formOpen, setFormOpen] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  const [editing, setEditing] = useState<Prompt | null>(null)

  const categories = useMemo(() => Array.from(new Set(prompts.map((p) => p.category))), [prompts])

  const filtered = prompts.filter((p) => {
    const matchesSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.prompt.toLowerCase().includes(search.toLowerCase()) ||
      p.hashtags.some((h) => h.toLowerCase().includes(search.toLowerCase()))
    const matchesCategory = categoryFilter === "all" || p.category === categoryFilter
    const matchesStatus = statusFilter === "all" || p.status === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

  async function handleDelete(id: string) {
    const prev = prompts
    setPrompts((p) => p.filter((x) => x.id !== id))
    try {
      await deletePrompt(id)
      toast.success("Prompt deleted")
    } catch (err) {
      setPrompts(prev)
      toast.error(err instanceof Error ? err.message : "Couldn't delete prompt")
    }
  }

  function upsert(prompt: Prompt) {
    setPrompts((prev) => {
      const exists = prev.some((p) => p.id === prompt.id)
      return exists ? prev.map((p) => (p.id === prompt.id ? prompt : p)) : [prompt, ...prev]
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]" />
          <Input placeholder="Search title, prompt, or tags…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {(["pending", "generating", "generated", "posting", "posted", "failed"] as const).map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="secondary" onClick={() => setImportOpen(true)}>
          <Upload className="h-4 w-4" /> Import
        </Button>
        <Button onClick={() => { setEditing(null); setFormOpen(true) }}>
          <Plus className="h-4 w-4" /> New prompt
        </Button>
      </div>

      <div className="glass rounded-[var(--radius-card)]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Hashtags</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-sm text-[var(--color-muted)]">
                  {prompts.length === 0 ? "No prompts yet — create or import your first one" : "No prompts match your filters"}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <p className="font-medium">{p.title}</p>
                    <p className="max-w-md truncate text-xs text-[var(--color-muted)]">{p.prompt}</p>
                  </TableCell>
                  <TableCell><Badge variant="muted">{p.category}</Badge></TableCell>
                  <TableCell>
                    <div className="flex max-w-[200px] flex-wrap gap-1">
                      {p.hashtags.slice(0, 3).map((h) => (
                        <span key={h} className="text-xs text-[var(--color-primary-muted)]">#{h}</span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell><Badge variant={STATUS_VARIANT[p.status]}>{p.status}</Badge></TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditing(p); setFormOpen(true) }}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-[var(--color-danger)]" onClick={() => handleDelete(p.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <PromptFormDialog open={formOpen} onOpenChange={setFormOpen} workspaceId={workspaceId} editing={editing} onSaved={upsert} />
      <ImportDialog open={importOpen} onOpenChange={setImportOpen} workspaceId={workspaceId} onImported={() => window.location.reload()} />
    </div>
  )
}
