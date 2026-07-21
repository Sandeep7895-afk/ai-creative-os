"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { addApiCredential } from "@/services/admin-service"
import { Loader2, Plus } from "lucide-react"
import type { ApiProviderKind } from "@/types"

const PROVIDER_KINDS: { value: ApiProviderKind; label: string }[] = [
  { value: "video_generation", label: "Video generation" },
  { value: "image_generation", label: "Image generation" },
  { value: "voice_generation", label: "Voice generation" },
  { value: "publish_youtube", label: "YouTube publishing" },
  { value: "publish_instagram", label: "Instagram publishing" },
]

export function AddCredentialDialog({ onAdded }: { onAdded: () => void }) {
  const [open, setOpen] = useState(false)
  const [providerKind, setProviderKind] = useState<ApiProviderKind>("video_generation")
  const [providerName, setProviderName] = useState("")
  const [rawKey, setRawKey] = useState("")
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    if (!providerName.trim() || !rawKey.trim()) return toast.error("Fill in provider name and key")
    setSaving(true)
    try {
      await addApiCredential({ providerKind, providerName: providerName.trim(), rawKey: rawKey.trim() })
      toast.success("Credential saved")
      setProviderName("")
      setRawKey("")
      setOpen(false)
      onAdded()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't save credential")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" /> Add credential
      </Button>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add API credential</DialogTitle>
          <DialogDescription>Keys are masked everywhere outside this panel.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Provider type</Label>
            <Select value={providerKind} onValueChange={(v) => setProviderKind(v as ApiProviderKind)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {PROVIDER_KINDS.map((p) => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Provider name</Label>
            <Input value={providerName} onChange={(e) => setProviderName(e.target.value)} placeholder="e.g. Runway Gen-4" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>API key</Label>
            <Input type="password" value={rawKey} onChange={(e) => setRawKey(e.target.value)} placeholder="sk-…" />
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Save credential
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
