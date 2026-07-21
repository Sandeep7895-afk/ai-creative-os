/* eslint-disable @typescript-eslint/no-explicit-any -- raw Supabase rows are untyped at the client boundary; mapped to domain types immediately after */
"use server"

import { createClient } from "@/lib/supabase/server"
import type { AnalyticsSummary, AnalyticsDailyPoint, TopContentItem } from "@/types"

export async function getAnalyticsSummary(workspaceId: string): Promise<AnalyticsSummary> {
  const supabase = await createClient()

  const [{ count: videos }, { count: images }, { count: published }, { data: daily }] = await Promise.all([
    supabase.from("generation_jobs").select("*", { count: "exact", head: true }).eq("workspace_id", workspaceId).eq("kind", "video"),
    supabase.from("generation_jobs").select("*", { count: "exact", head: true }).eq("workspace_id", workspaceId).eq("kind", "image"),
    supabase.from("publish_jobs").select("*", { count: "exact", head: true }).eq("workspace_id", workspaceId).eq("status", "published"),
    supabase.from("analytics_daily").select("views, engagement").eq("workspace_id", workspaceId),
  ])

  const totalViews = (daily ?? []).reduce((sum, d) => sum + d.views, 0)
  const avgEngagement = daily && daily.length > 0
    ? (daily.reduce((sum, d) => sum + Number(d.engagement), 0) / daily.length)
    : 0

  return {
    generatedVideos: videos ?? 0,
    generatedImages: images ?? 0,
    publishedPosts: published ?? 0,
    totalViews,
    engagementRate: Number(avgEngagement.toFixed(2)),
  }
}

export async function getAnalyticsTimeseries(workspaceId: string, days = 30): Promise<AnalyticsDailyPoint[]> {
  const supabase = await createClient()
  const since = new Date()
  since.setDate(since.getDate() - days)

  const { data, error } = await supabase
    .from("analytics_daily")
    .select("date, views, engagement")
    .eq("workspace_id", workspaceId)
    .gte("date", since.toISOString().slice(0, 10))
    .order("date", { ascending: true })

  if (error) throw new Error(error.message)
  return (data ?? []).map((d) => ({ date: d.date, views: d.views, engagement: Number(d.engagement) }))
}

export async function getTopContent(workspaceId: string, limit = 5): Promise<TopContentItem[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("publish_jobs")
    .select("id, caption, platform, published_url, created_at, generation_jobs(thumbnail_url)")
    .eq("workspace_id", workspaceId)
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) throw new Error(error.message)
  return (data ?? []).map((row: any) => ({
    id: row.id,
    title: row.caption?.slice(0, 60) || "Untitled",
    platform: row.platform,
    thumbnailUrl: row.generation_jobs?.thumbnail_url ?? null,
    views: 0,
    engagementRate: 0,
    publishedAt: row.created_at,
  }))
}
