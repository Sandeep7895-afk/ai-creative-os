import type { PublishProvider, PublishPlatform } from "@/types"
import { youtubeProvider } from "./youtube-provider"
import { instagramProvider } from "./instagram-provider"

/**
 * Plugin registry for publish destinations. Adding a new platform means
 * implementing PublishProvider (see types/index.ts) and registering it
 * here — nothing else in the app needs to change.
 */
const registry = new Map<PublishPlatform, PublishProvider>([
  [youtubeProvider.id, youtubeProvider],
  [instagramProvider.id, instagramProvider],
])

export function getPublishProvider(platform: PublishPlatform): PublishProvider {
  const provider = registry.get(platform)
  if (!provider) throw new Error(`No publish provider registered for "${platform}"`)
  return provider
}

export function listPublishProviders(): PublishProvider[] {
  return Array.from(registry.values())
}
