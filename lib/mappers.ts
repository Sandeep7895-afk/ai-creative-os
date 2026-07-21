/* eslint-disable @typescript-eslint/no-explicit-any -- raw Supabase rows are untyped at the client boundary; mapped to domain types immediately after */
// Maps snake_case DB rows to camelCase domain types.
import type {
  Prompt,
  GenerationJob,
  AppNotification,
  PublishAccount,
  PublishJob,
  Asset,
  ApiCredential,
  SystemLogEntry,
  Workspace,
  Profile,
} from "@/types"

export function mapPrompt(row: any): Prompt {
  return {
    id: row.id,
    workspaceId: row.workspace_id,
    title: row.title,
    prompt: row.prompt,
    category: row.category,
    description: row.description,
    hashtags: row.hashtags ?? [],
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function mapGenerationJob(row: any): GenerationJob {
  return {
    id: row.id,
    workspaceId: row.workspace_id,
    promptId: row.prompt_id,
    kind: row.kind,
    provider: row.provider,
    inputPrompt: row.input_prompt,
    status: row.status,
    progress: row.progress,
    resultUrl: row.result_url,
    thumbnailUrl: row.thumbnail_url,
    errorMessage: row.error_message,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function mapNotification(row: any): AppNotification {
  return {
    id: row.id,
    workspaceId: row.workspace_id,
    userId: row.user_id,
    type: row.type,
    title: row.title,
    message: row.message,
    read: row.read,
    actions: row.actions ?? [],
    relatedJobId: row.related_job_id,
    createdAt: row.created_at,
  }
}

export function mapPublishAccount(row: any): PublishAccount {
  return {
    id: row.id,
    workspaceId: row.workspace_id,
    platform: row.platform,
    accountName: row.account_name,
    accountAvatar: row.account_avatar,
    connected: row.connected,
    tokenExpiresAt: row.token_expires_at,
  }
}

export function mapPublishJob(row: any): PublishJob {
  return {
    id: row.id,
    workspaceId: row.workspace_id,
    generationJobId: row.generation_job_id,
    platform: row.platform,
    accountId: row.account_id,
    caption: row.caption,
    hashtags: row.hashtags ?? [],
    scheduledFor: row.scheduled_for,
    status: row.status,
    publishedUrl: row.published_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function mapAsset(row: any): Asset {
  return {
    id: row.id,
    workspaceId: row.workspace_id,
    kind: row.kind,
    name: row.name,
    url: row.url,
    thumbnailUrl: row.thumbnail_url,
    sizeBytes: row.size_bytes,
    createdAt: row.created_at,
  }
}

export function mapApiCredential(row: any, maskedKey: string): ApiCredential {
  return {
    id: row.id,
    providerKind: row.provider_kind,
    providerName: row.provider_name,
    maskedKey,
    status: row.status,
    creditsRemaining: row.credits_remaining,
    expiresAt: row.expires_at,
    updatedAt: row.updated_at,
  }
}

export function mapSystemLog(row: any): SystemLogEntry {
  return {
    id: row.id,
    level: row.level,
    source: row.source,
    message: row.message,
    metadata: row.metadata,
    createdAt: row.created_at,
  }
}

export function mapWorkspace(row: any): Workspace {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    icon: row.icon,
    ownerId: row.owner_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function mapProfile(row: any): Profile {
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    avatarUrl: row.avatar_url,
    role: row.role,
    activeWorkspaceId: row.active_workspace_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}
