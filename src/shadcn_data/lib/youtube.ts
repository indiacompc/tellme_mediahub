// Optional: YouTube API helper functions for future use
export const YOUTUBE_CHANNEL_IDS = {
  TELLME360: "@Tellme360",
  // Add more channel IDs as needed
}

export const YOUTUBE_PLAYLISTS = {
  // Add playlist IDs as needed
}

/**
 * Helper function to build YouTube search URL
 * @param apiKey - YouTube API key
 * @param channelId - YouTube channel ID (not handle)
 * @param maxResults - Maximum number of results per page (default: 50, max: 50)
 * @param pageToken - Optional page token for pagination
 */
export function buildYouTubeSearchUrl(
	apiKey: string,
	channelId: string,
	maxResults = 50,
	pageToken?: string
): string {
	const params = new URLSearchParams({
		part: 'snippet',
		channelId,
		maxResults: Math.min(maxResults, 50).toString(), // YouTube API max is 50
		order: 'date',
		type: 'video',
		key: apiKey
	})

	if (pageToken) {
		params.append('pageToken', pageToken)
	}

	return `https://www.googleapis.com/youtube/v3/search?${params.toString()}`
}
