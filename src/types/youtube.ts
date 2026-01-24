export interface YouTubeVideo {
  id: string
  title: string
  thumbnail: string
  channelName: string
  description: string
  publishedAt: string
  slug: string
  recordingLocation?: string
  isShort?: boolean
  playlistId?: string
  playlistIndex?: number
  embedUrl?: string
}
