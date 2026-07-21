import "server-only"
import { createClient } from "@/lib/supabase/server"
import { mapPublishAccount } from "@/lib/mappers"
import type { PublishJob, PublishProvider } from "@/types"

/**
 * Instagram Graph API publish provider (Reels/Feed via a connected
 * Instagram Business account). Requires Facebook Login for Business
 * with instagram_content_publish scope.
 */
export const instagramProvider: PublishProvider = {
  id: "instagram",
  label: "Instagram",
  icon: "instagram",

  async connect(workspaceId) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("publish_accounts")
      .insert({ workspace_id: workspaceId, platform: "instagram", account_name: "Pending authorization", connected: false })
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
      throw new Error("Instagram account not connected. Connect it from Publish settings first.")
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
        platform: "instagram",
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
      // Two-step Graph API flow: create a media container, then publish it.
      const containerRes = await fetch(
        `https://graph.facebook.com/v19.0/${account.account_name}/media`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            video_url: genJob.result_url,
            caption: `${job.caption} ${job.hashtags.map((h) => `#${h}`).join(" ")}`.trim(),
            access_token: account.access_token,
          }),
        }
      ).catch(() => null)

      if (containerRes?.ok) {
        const { id: creationId } = await containerRes.json()
        await fetch(`https://graph.facebook.com/v19.0/${account.account_name}/media_publish`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ creation_id: creationId, access_token: account.access_token }),
        }).catch(() => {})
      }
    }

    return {
      id: created.id,
      workspaceId: created.workspace_id,
      generationJobId: created.generation_job_id,
      platform: "instagram",
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
