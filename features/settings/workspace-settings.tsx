"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateWorkspaceName, createWorkspace } from "@/services/workspace-service"
import { Loader2, Plus } from "lucide-react"
import type { Workspace } from "@/types"

export function WorkspaceSettings({ workspace }: { workspace: Workspace }) {
  const [name, setName] = useState(workspace.name)
  const [newName, setNewName] = useState("")
  const [saving, setSaving] = useState(false)
  const [creating, setCreating] = useState(false)

  async function handleSave() {
    setSaving(true)
    try {
      await updateWorkspaceName(workspace.id, name)
      toast.success("Workspace renamed")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't save")
    } finally {
      setSaving(false)
    }
  }

  async function handleCreate() {
    if (!newName.trim()) return
    setCreating(true)
    try {
      await createWorkspace(newName.trim())
      toast.success("Workspace created")
      window.location.reload()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't create workspace")
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-col gap-4 p-6">
        <div className="flex flex-col gap-1.5 max-w-sm">
          <Label htmlFor="wsName">Workspace name</Label>
          <Input id="wsName" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <Button onClick={handleSave} disabled={saving} className="w-fit">
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          Save changes
        </Button>
      </Card>

      <Card className="flex flex-col gap-4 p-6">
        <div>
          <p className="text-sm font-medium">Create a new workspace</p>
          <p className="text-xs text-[var(--color-muted)]">Each workspace has its own prompts, analytics, assets, and publish accounts.</p>
        </div>
        <div className="flex max-w-sm gap-2">
          <Input placeholder="e.g. Kids Stories" value={newName} onChange={(e) => setNewName(e.target.value)} />
          <Button onClick={handleCreate} disabled={creating} variant="secondary">
            {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Create
          </Button>
        </div>
      </Card>
    </div>
  )
}
