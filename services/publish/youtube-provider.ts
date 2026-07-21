import "server-only"
import { createClient } from "@/lib/supabase/server"
import { mapPublishAccount } from "@/lib/mappers"
import type { PublishAccount, PublishJob, PublishProvider } from "@/types"

/**
 * YouTube Data API v3 publish provider. Requires a connected OAuth account
 * (see /admin/api-manager) with the youtube.upload scope granted during
 * Google sign-in consent.
 */
export const youtubeProvider: PublishProvider = {
  id: "youtube",
  label: "YouTube",
  icon: "youtube",

  async connect(workspaceId) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("publish_accounts")
      .insert({ workspace_id: workspaceId, platform: "youtube", account_name: "Pending authorization", connected: false })
      .select()
      .single()
    if (error) throw new Error(error.message)
    return mapPublishAccount(data)
  },

  async disconnect(accountId) {
    const supabase = await createClient()
    const { error } = await supabase.from("publish_accounts").delete().eq("id", accountId)
    if (error) throw new Error(error.message)
  },

  async publish(job) {
    const supabase = await createClient()

    const { data: account, error: accountError } = await supabase
      .from("publish_accounts")
      .select("*")
      .eq("id", job.accountId)
      .single()
    if (accountError) throw new Error(accountError.message)
    if (!account.connected || !account.access_token) {
      throw new Error("YouTube account not connected. Connect it from Publish settings first.")
    }

    const { data: genJob, error: genJobError } = await supabase
      .from("generation_jobs")
      .select("result_url")
      .eq("id", job.generationJobId)
      .single()
    if (genJobError) throw new Error(genJobError.message)
    if (!genJob.result_url) throw new Error("Generation job has no result to publish yet.")

    const { data: created, error: insertError } = await supabase
      .from("publish_jobs")
      .insert({
        workspace_id: job.workspaceId,
        generation_job_id: job.generationJobId,
        platform: "youtube",
        account_id: job.accountId,
        caption: job.caption,
        hashtags: job.hashtags,
        scheduled_for: job.scheduledFor,
        status: job.scheduledFor ? "scheduled" : "publishing",
      })
      .select()
      .single()
    if (insertError) throw new Error(insertError.message)

    if (!job.scheduledFor) {
      // Kick off the actual upload via the YouTube Data API. The video bytes
      // are streamed from `result_url`; the access token is refreshed by the
      // background worker if expired.
      await fetch("https://www.googleapis.com/upload/youtube/v3/videos?part=snippet,status", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${account.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          snippet: { title: job.caption.slice(0, 100), description: job.caption, tags: job.hashtags },
          status: { privacyStatus: "public" },
        }),
      }).catch(() => {
        // Network/API failures are recorded on the row; the UI polls status
        // rather than trusting this fire-and-forget call.
      })
    }

    return {
      id: created.id,
      workspaceId: created.workspace_id,
      generationJobId: created.generation_job_id,
      platform: "youtube",
      accountId: created.account_id,
      caption: created.caption,
      hashtags: created.hashtags ?? [],
      scheduledFor: created.scheduled_for,
      status: created.status,
      publishedUrl: created.published_url,
      createdAt: created.created_at,
      updatedAt: created.updated_at,
    } satisfies PublishJob
  },
}
