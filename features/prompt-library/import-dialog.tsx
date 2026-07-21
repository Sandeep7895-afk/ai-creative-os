/* eslint-disable @typescript-eslint/no-explicit-any -- raw Supabase rows are untyped at the client boundary; mapped to domain types immediately after */
"use client"

import { useState } from "react"
import Papa from "papaparse"
import * as XLSX from "xlsx"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Upload, Loader2, FileSpreadsheet } from "lucide-react"
import { bulkImportPrompts } from "@/services/prompt-service"

interface ParsedRow {
  title: string
  prompt: string
  category?: string
  description?: string
  hashtags?: string[]
}

function normalizeRows(raw: Record<string, any>[]): ParsedRow[] {
  const mapped: (ParsedRow | null)[] = raw.map((r) => {
    const get = (key: string) => r[key] ?? r[key.toLowerCase()] ?? r[key.toUpperCase()]
    const title = get("title") ?? get("Title")
    const prompt = get("prompt") ?? get("Prompt")
    if (!title || !prompt) return null
    const hashtagsRaw = get("hashtags") ?? get("Hashtags")
    const row: ParsedRow = {
      title: String(title),
      prompt: String(prompt),
      category: get("category") ? String(get("category")) : undefined,
      description: get("description") ? String(get("description")) : undefined,
      hashtags: hashtagsRaw
        ? String(hashtagsRaw).split(",").map((h: string) => h.trim().replace(/^#/, "")).filter(Boolean)
        : undefined,
    }
    return row
  })
  return mapped.filter((r): r is ParsedRow => r !== null)
}

export function ImportDialog({
  open,
  onOpenChange,
  workspaceId,
  onImported,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  workspaceId: string
  onImported: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<ParsedRow[]>([])

  async function handleFile(file: File) {
    setLoading(true)
    try {
      let rows: ParsedRow[] = []
      if (file.name.endsWith(".csv")) {
        const text = await file.text()
        const parsed = Papa.parse<Record<string, any>>(text, { header: true, skipEmptyLines: true })
        rows = normalizeRows(parsed.data)
      } else {
        const buffer = await file.arrayBuffer()
        const workbook = XLSX.read(buffer, { type: "array" })
        const sheet = workbook.Sheets[workbook.SheetNames[0]]
        const json = XLSX.utils.sheet_to_json<Record<string, any>>(sheet)
        rows = normalizeRows(json)
      }
      if (rows.length === 0) {
        toast.error("No valid rows found — need at least Title and Prompt columns")
      }
      setPreview(rows)
    } catch {
      toast.error("Couldn't read that file")
    } finally {
      setLoading(false)
    }
  }

  async function handleConfirm() {
    setLoading(true)
    try {
      const count = await bulkImportPrompts(workspaceId, preview)
      toast.success(`Imported ${count} prompt${count === 1 ? "" : "s"}`)
      setPreview([])
      onImported()
      onOpenChange(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Import failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) setPreview([]) }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Import prompts</DialogTitle>
          <DialogDescription>Upload a CSV or Excel file with Title and Prompt columns</DialogDescription>
        </DialogHeader>

        {preview.length === 0 ? (
          <label className="flex cursor-pointer flex-col items-center gap-2 rounded-[var(--radius-control)] border border-dashed border-[var(--color-border)] p-10 text-center hover:border-[var(--color-primary)]/50">
            <Upload className="h-6 w-6 text-[var(--color-muted)]" />
            <span className="text-sm">Click to choose a .csv or .xlsx file</span>
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
          </label>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
              <FileSpreadsheet className="h-4 w-4" /> {preview.length} row{preview.length === 1 ? "" : "s"} ready to import
            </div>
            <div className="max-h-56 overflow-y-auto rounded-lg border border-[var(--color-border)]">
              {preview.slice(0, 8).map((r, i) => (
                <div key={i} className="border-b border-[var(--color-border)] px-3 py-2 last:border-0">
                  <p className="truncate text-sm font-medium">{r.title}</p>
                  <p className="truncate text-xs text-[var(--color-muted)]">{r.prompt}</p>
                </div>
              ))}
              {preview.length > 8 && (
                <p className="px-3 py-2 text-xs text-[var(--color-muted)]">+{preview.length - 8} more</p>
              )}
            </div>
            <Button onClick={handleConfirm} disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Import {preview.length} prompt{preview.length === 1 ? "" : "s"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
