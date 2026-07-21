// ============================================================================
// Core domain types — AI Creative OS
// ============================================================================

export type UserRole = "ADMIN" | "USER"

export interface Profile {
  id: string
  email: string
  fullName: string | null
  avatarUrl: string | null
  role: UserRole
  activeWorkspaceId: string | null
  createdAt: string
  updatedAt: string
}

export interface Workspace {
  id: string
  name: string
  slug: string
  icon: string | null
  ownerId: string
  createdAt: string
  updatedAt: string
}

export interface WorkspaceMember {
  id: string
  workspaceId: string
  userId: string
  role: UserRole
  joinedAt: string
}

// ----------------------------------------------------------------------------
// Prompt Library
// ----------------------------------------------------------------------------

export type PromptStatus =
  | "pending"
  | "generating"
  | "generated"
  | "posting"
  | "posted"
  | "failed"

export interface Prompt {
  id: string
  workspaceId: string
  title: string
  prompt: string
  category: string
  description: string | null
  hashtags: string[]
  status: PromptStatus
  createdAt: string
  updatedAt: string
}

export type PromptInsert = Omit<Prompt, "id" | "createdAt" | "updatedAt">
export type PromptUpdate = Partial<PromptInsert>

// ----------------------------------------------------------------------------
// Generation jobs (video / image / voice / pdf)
// ----------------------------------------------------------------------------

export type GenerationKind = "video" | "image" | "voice" | "pdf" | "blog"

export type JobStatus =
  | "queued"
  | "generating"
  | "ready"
  | "failed"

export interface GenerationJob {
  id: string
  workspaceId: string
  promptId: string | null
  kind: GenerationKind
  provider: string
  inputPrompt: string
  status: JobStatus
  progress: number
  resultUrl: string | null
  thumbnailUrl: string | null
  errorMessage: string | null
  createdAt: string
  updatedAt: string
}

// ----------------------------------------------------------------------------
// Publishing
// ----------------------------------------------------------------------------

export type PublishPlatform = "youtube" | "instagram"

export type PublishStatus =
  | "draft"
  | "scheduled"
  | "publishing"
  | "published"
  | "failed"

export interface PublishAccount {
  id: string
  workspaceId: string
  platform: PublishPlatform
  accountName: string
  accountAvatar: string | null
  connected: boolean
  tokenExpiresAt: string | null
}

export interface PublishJob {
  id: string
  workspaceId: string
  generationJobId: string
  platform: PublishPlatform
  accountId: string
  caption: string
  hashtags: string[]
  scheduledFor: string | null
  status: PublishStatus
  publishedUrl: string | null
  createdAt: string
  updatedAt: string
}

// Plugin contract every publish provider must implement.
export interface PublishProvider {
  id: PublishPlatform
  label: string
  icon: string
  connect: (workspaceId: string) => Promise<PublishAccount>
  disconnect: (accountId: string) => Promise<void>
  publish: (job: Omit<PublishJob, "id" | "createdAt" | "updatedAt" | "status" | "publishedUrl">) => Promise<PublishJob>
}

// ----------------------------------------------------------------------------
// Notifications
// ----------------------------------------------------------------------------

export type NotificationType =
  | "video_generated"
  | "video_failed"
  | "image_ready"
  | "upload_started"
  | "upload_complete"
  | "upload_failed"
  | "prompt_completed"
  | "analytics_milestone"
  | "api_credits_low"
  | "api_expiring"
  | "schedule_reminder"

export interface NotificationAction {
  label: "Preview" | "Post" | "Retry" | "Delete" | "View"
  action: string
}

export interface AppNotification {
  id: string
  workspaceId: string
  userId: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  actions: NotificationAction[]
  relatedJobId: string | null
  createdAt: string
}

// ----------------------------------------------------------------------------
// Analytics
// ----------------------------------------------------------------------------

export interface AnalyticsSummary {
  generatedVideos: number
  generatedImages: number
  publishedPosts: number
  totalViews: number
  engagementRate: number
}

export interface AnalyticsDailyPoint {
  date: string
  views: number
  engagement: number
}

export interface TopContentItem {
  id: string
  title: string
  platform: PublishPlatform
  thumbnailUrl: string | null
  views: number
  engagementRate: number
  publishedAt: string
}

// ----------------------------------------------------------------------------
// Admin — API Manager
// ----------------------------------------------------------------------------

export type ApiProviderKind =
  | "video_generation"
  | "image_generation"
  | "voice_generation"
  | "publish_youtube"
  | "publish_instagram"

export interface ApiCredential {
  id: string
  providerKind: ApiProviderKind
  providerName: string
  maskedKey: string
  status: "active" | "expiring" | "expired" | "revoked"
  creditsRemaining: number | null
  expiresAt: string | null
  updatedAt: string
}

export interface SystemLogEntry {
  id: string
  level: "info" | "warning" | "error"
  source: string
  message: string
  metadata: Record<string, unknown> | null
  createdAt: string
}

// ----------------------------------------------------------------------------
// Assets
// ----------------------------------------------------------------------------

export interface Asset {
  id: string
  workspaceId: string
  kind: "video" | "image" | "audio" | "pdf"
  name: string
  url: string
  thumbnailUrl: string | null
  sizeBytes: number
  createdAt: string
}
