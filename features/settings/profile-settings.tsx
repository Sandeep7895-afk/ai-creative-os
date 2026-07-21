"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { updateProfile } from "@/services/profile-service"
import { Loader2 } from "lucide-react"
import type { Profile } from "@/types"

export function ProfileSettings({ profile }: { profile: Profile }) {
  const [fullName, setFullName] = useState(profile.fullName ?? "")
  const [saving, setSaving] = useState(false)
  const initials = (profile.fullName ?? profile.email).slice(0, 2).toUpperCase()

  async function handleSave() {
    setSaving(true)
    try {
      await updateProfile({ fullName })
      toast.success("Profile updated")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't save")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="flex flex-col gap-5 p-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={profile.avatarUrl ?? undefined} />
          <AvatarFallback className="text-lg">{initials}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{profile.email}</p>
          <p className="text-xs text-[var(--color-muted)] capitalize">{profile.role.toLowerCase()} account</p>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 max-w-sm">
        <Label htmlFor="fullName">Full name</Label>
        <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} />
      </div>

      <Button onClick={handleSave} disabled={saving} className="w-fit">
        {saving && <Loader2 className="h-4 w-4 animate-spin" />}
        Save changes
      </Button>
    </Card>
  )
}
