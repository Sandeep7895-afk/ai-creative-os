import type { Metadata } from "next"
import { getActiveWorkspace } from "@/lib/get-active-workspace"
import { createClient } from "@/lib/supabase/server"
import { mapProfile } from "@/lib/mappers"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ProfileSettings } from "@/features/settings/profile-settings"
import { WorkspaceSettings } from "@/features/settings/workspace-settings"

export const metadata: Metadata = { title: "Settings — AI Creative OS" }

export default async function SettingsPage() {
  const { userId, workspace } = await getActiveWorkspace()
  const supabase = await createClient()
  const { data: profileRow } = await supabase.from("profiles").select("*").eq("id", userId).single()
  const profile = mapProfile(profileRow)

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-[var(--color-muted)]">Manage your account and workspace.</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="workspace">Workspace</TabsTrigger>
        </TabsList>
        <TabsContent value="profile"><ProfileSettings profile={profile} /></TabsContent>
        <TabsContent value="workspace"><WorkspaceSettings workspace={workspace} /></TabsContent>
      </Tabs>
    </div>
  )
}
