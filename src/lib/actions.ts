'use server'

import type { YouTubeVideo } from '@/types/youtube'
import { buildYouTubeSearchUrl } from '@/shadcn_data/lib/youtube'
import fs from 'fs'
import path from 'path'

/**
 * Generates a URL-friendly slug from a title and video ID
 * @param title - Video title
 * @param videoId - YouTube video ID (for uniqueness)
 * @returns URL-friendly slug
 */
function generateSlug(title: string, videoId: string): string {
	// Convert to lowercase and replace spaces/special chars with hyphens
	let slug = title
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, '') // Remove special characters
		.replace(/\s+/g, '-') // Replace spaces with hyphens
		.replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
		.replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
	
	// Limit length and append video ID for uniqueness
	const maxLength = 100
	if (slug.length > maxLength) {
		slug = slug.substring(0, maxLength)
	}
	
	// Append video ID to ensure uniqueness
	slug = `${slug}-${videoId}`
	
	return slug
}

/**
 * YouTube API Key Configuration
 * 
 * To use this application, you need a valid YouTube Data API v3 key.
 * 
 * Setup instructions:
 * 1. Go to https://console.cloud.google.com/
 * 2. Create a new project or select an existing one
 * 3. Enable "YouTube Data API v3"
 * 4. Create credentials (API Key)
 * 5. Set the API key as an environment variable: YOUTUBE_API_KEY
 * 
 * For local development, create a .env.local file with:
 * YOUTUBE_API_KEY=your_api_key_here
 * 
 * Note: Make sure the API key has no restrictions or that your domain/IP is allowed
 */
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || 'AIzaSyAGxe-DHqTcWVqPtDCXo4EmiP85ztIMp3Y'

/**
 * Resolves a YouTube channel handle (@username) to channel ID
 */
async function resolveChannelHandle(handle: string): Promise<string> {
	// Remove @ if present
	const cleanHandle = handle.startsWith('@') ? handle.slice(1) : handle

	// Method 1: Try using channels.list with forHandle parameter (newer API feature)
	try {
		const channelsUrl = `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${encodeURIComponent(cleanHandle)}&key=${YOUTUBE_API_KEY}`
		const response = await fetch(channelsUrl)

		if (response.ok) {
			const data = await response.json()
			if (data.items && data.items.length > 0) {
				return data.items[0].id
			}
		} else {
			// If response is not ok, log the error but continue to fallback method
			const errorData = await response.json().catch(() => ({}))
			console.warn(
				`forHandle method returned ${response.status}:`,
				errorData.error?.message || response.statusText
			)
		}
	} catch (error) {
		console.warn('forHandle method failed, trying alternative method:', error)
	}

	// Method 2: Fallback - Use search endpoint
	try {
		const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(handle)}&type=channel&key=${YOUTUBE_API_KEY}&maxResults=1`
		const response = await fetch(searchUrl)

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}))
			const errorMessage = errorData.error?.message || response.statusText
			const errorReason = errorData.error?.errors?.[0]?.reason || ''
			
			// Provide more helpful error messages
			if (response.status === 403) {
				throw new Error(
					`API access forbidden. Please check: 1) API key is valid, 2) YouTube Data API v3 is enabled, 3) API key has proper permissions. Error: ${errorMessage}`
				)
			}
			
			throw new Error(
				`Failed to resolve channel handle: ${response.statusText} - ${errorMessage}${errorReason ? ` (${errorReason})` : ''}`
			)
		}

		const data = await response.json()
		if (data.items && data.items.length > 0) {
			return data.items[0].snippet.channelId
		}
	} catch (error) {
		console.error('Search method also failed:', error)
		throw error instanceof Error
			? error
			: new Error(`Failed to resolve channel handle: ${handle}`)
	}

	throw new Error(`Channel handle "${handle}" not found`)
}

/**
 * Fetches ALL YouTube videos for a given channel using pagination
 * @param channelId - YouTube channel ID or handle (e.g., "@Tellme360" or "UC...")
 * @returns Array of all YouTube videos from the channel
 */
export async function fetchYouTubeVideos(channelId: string): Promise<YouTubeVideo[]> {
	try {
		// If channelId starts with @, resolve it to actual channel ID
		let actualChannelId = channelId

		if (channelId.startsWith('@')) {
			actualChannelId = await resolveChannelHandle(channelId)
		}

		const allVideos: YouTubeVideo[] = []
		let nextPageToken: string | undefined = undefined
		let pageCount = 0
		const maxPages = 100 // Safety limit to prevent infinite loops

		// Fetch all pages of videos
		do {
			// Fetch videos using the channel ID with pagination
			const url = buildYouTubeSearchUrl(YOUTUBE_API_KEY, actualChannelId, 50, nextPageToken)
			const response = await fetch(url)

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}))
				throw new Error(
					`YouTube API error: ${response.statusText} - ${errorData.error?.message || ''}`
				)
			}

			const data = await response.json()

			if (!data.items || data.items.length === 0) {
				break
			}

			// Transform API response to YouTubeVideo format and add to array
			const videos = data.items.map((item: any) => ({
				id: item.id.videoId,
				title: item.snippet.title,
				description: item.snippet.description || '',
				thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url || '',
				publishedAt: item.snippet.publishedAt,
				channelName: item.snippet.channelTitle
			}))

			allVideos.push(...videos)

			// Get next page token if available
			nextPageToken = data.nextPageToken
			pageCount++

			// Safety check to prevent infinite loops
			if (pageCount >= maxPages) {
				console.warn(`Reached maximum page limit (${maxPages}). Stopping pagination.`)
				break
			}
		} while (nextPageToken)

		return allVideos
	} catch (error) {
		console.error('Error fetching YouTube videos:', error)
		throw error instanceof Error ? error : new Error('Failed to fetch YouTube videos')
	}
}

/**
 * Extracts YouTube video ID from a YouTube URL
 */
function extractVideoId(url: string): string | null {
	const patterns = [
		/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
		/youtube\.com\/watch\?.*v=([^&\n?#]+)/
	]
	
	for (const pattern of patterns) {
		const match = url.match(pattern)
		if (match && match[1]) {
			return match[1]
		}
	}
	
	return null
}

/**
 * Extracts YouTube playlist ID from a YouTube URL
 */
function extractPlaylistId(url: string): string | null {
	const match = url.match(/[?&]list=([^&\n?#]+)/)
	return match && match[1] ? match[1] : null
}

/**
 * Validates if a YouTube video is accessible by checking the video's oEmbed endpoint
 * @param videoId - YouTube video ID
 * @returns Promise<boolean> - true if video is accessible, false otherwise
 */
async function isYouTubeVideoAccessible(videoId: string): Promise<boolean> {
	try {
		// Create abort controller for timeout
		const controller = new AbortController()
		const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

		// Use YouTube oEmbed API to check if video exists and is accessible
		const oEmbedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
		const response = await fetch(oEmbedUrl, {
			method: 'GET',
			signal: controller.signal
		})

		clearTimeout(timeoutId)

		// If oEmbed returns 200, video is accessible
		if (response.ok) {
			return true
		}

		// If oEmbed fails, try checking the thumbnail as a fallback
		const thumbnailController = new AbortController()
		const thumbnailTimeoutId = setTimeout(() => thumbnailController.abort(), 3000) // 3 second timeout
		
		const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/default.jpg`
		const thumbnailResponse = await fetch(thumbnailUrl, {
			method: 'HEAD',
			signal: thumbnailController.signal
		})
		
		clearTimeout(thumbnailTimeoutId)
		return thumbnailResponse.ok
	} catch (error) {
		// If both checks fail, assume video is not accessible
		console.warn(`Video ${videoId} validation failed:`, error)
		return false
	}
}

/**
 * Validates multiple YouTube videos in parallel (with concurrency limit)
 * @param videos - Array of YouTubeVideo objects to validate
 * @param concurrency - Maximum number of concurrent validations (default: 5)
 * @returns Promise<YouTubeVideo[]> - Array of valid videos
 */
async function validateYouTubeVideos(videos: YouTubeVideo[], concurrency: number = 5): Promise<YouTubeVideo[]> {
	const validVideos: YouTubeVideo[] = []
	
	// Process videos in batches to avoid overwhelming the API
	for (let i = 0; i < videos.length; i += concurrency) {
		const batch = videos.slice(i, i + concurrency)
		const validationPromises = batch.map(async (video) => {
			const isValid = await isYouTubeVideoAccessible(video.id)
			return isValid ? video : null
		})
		
		const results = await Promise.all(validationPromises)
		validVideos.push(...results.filter((video): video is YouTubeVideo => video !== null))
	}
	
	return validVideos
}

/**
 * Loads videos from json_youtube.json file
 * @returns Array of YouTube videos from the JSON file
 */
export async function loadVideosFromJSON(): Promise<YouTubeVideo[]> {
	try {
		// Read the JSON file from the public directory
		const filePath = path.join(process.cwd(), 'public', 'json_youtube.json')
		const fileContents = fs.readFileSync(filePath, 'utf-8')
		const data = JSON.parse(fileContents)

		// Check if data is an array
		if (!Array.isArray(data)) {
			throw new Error('JSON file should contain an array of videos')
		}

		// Transform JSON video data to YouTubeVideo format
		const videos: YouTubeVideo[] = data
			.map((video: any, index: number) => {
				const videoId = extractVideoId(video.url)
				if (!videoId) {
					return null
				}
				
				const playlistId = extractPlaylistId(video.url)
				const title = video.title || ''
				const slug = generateSlug(title, videoId)
				const playlistIndex = playlistId ? index + 1 : undefined
				const embedUrl = video.embed
					? String(video.embed)
					: playlistId
						? `https://www.youtube.com/embed/videoseries?list=${playlistId}`
						: `https://www.youtube.com/embed/${videoId}`
				
				return {
					id: videoId,
					title: title,
					description: video.description || '',
					thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`, // Use hqdefault as it's more reliable
					publishedAt: new Date().toISOString(), // json_youtube.json doesn't have published date
					channelName: 'Tellme360',
					slug: slug,
					playlistId: playlistId || undefined,
					playlistIndex: playlistIndex,
					embedUrl: embedUrl
				}
			})
			.filter((video: YouTubeVideo | null): video is YouTubeVideo => video !== null)

		// Validate videos - check if they are accessible
		console.log(`Validating ${videos.length} videos...`)
		const validVideos = await validateYouTubeVideos(videos, 5) // Validate 5 at a time
		console.log(`Found ${validVideos.length} valid videos out of ${videos.length}`)

		return validVideos
	} catch (error) {
		console.error('Error loading videos from JSON:', error)
		throw error instanceof Error ? error : new Error('Failed to load videos from JSON file')
	}
}

/**
 * Loads videos for a specific playlist from json_youtube.json without validation
 * @param playlistId - YouTube playlist ID
 * @returns Array of YouTube videos in the playlist (in JSON order)
 */
export async function loadPlaylistFromJSON(playlistId: string): Promise<YouTubeVideo[]> {
	try {
		const filePath = path.join(process.cwd(), 'public', 'json_youtube.json')
		const fileContents = fs.readFileSync(filePath, 'utf-8')
		const data = JSON.parse(fileContents)

		if (!Array.isArray(data)) {
			throw new Error('JSON file should contain an array of videos')
		}

		return data
			.map((video: any, index: number) => {
				const videoId = extractVideoId(video.url)
				if (!videoId) {
					return null
				}

				const parsedPlaylistId = extractPlaylistId(video.url)
				if (!parsedPlaylistId || parsedPlaylistId !== playlistId) {
					return null
				}

				const title = video.title || ''
				const slug = generateSlug(title, videoId)
				const embedUrl = video.embed
					? String(video.embed)
					: `https://www.youtube.com/embed/videoseries?list=${parsedPlaylistId}`

				return {
					id: videoId,
					title: title,
					description: video.description || '',
					thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
					publishedAt: new Date().toISOString(),
					channelName: 'Tellme360',
					slug: slug,
					playlistId: parsedPlaylistId,
					playlistIndex: index + 1,
					embedUrl: embedUrl
				}
			})
			.filter((video: YouTubeVideo | null): video is YouTubeVideo => video !== null)
	} catch (error) {
		console.error('Error loading playlist from JSON:', error)
		return []
	}
}

/**
 * Loads shorts from tellme_videohub_db JSON file
 * @returns Array of YouTube shorts (videos where is_short is true)
 */
export async function loadShortsFromJSON(): Promise<YouTubeVideo[]> {
	try {
		// Read the JSON file from the public directory
		const filePath = path.join(process.cwd(), 'public', 'tellme_videohub_db_2025-07-18_171335.json')
		const fileContents = fs.readFileSync(filePath, 'utf-8')
		const data = JSON.parse(fileContents)

		// Check if videos array exists
		if (!data.videos || !Array.isArray(data.videos)) {
			throw new Error('Videos array not found in JSON file')
		}

		// Filter only shorts (is_short === true) and public videos
		const seenIds = new Set<string>()
		const shorts: YouTubeVideo[] = data.videos
			.filter((video: any) => {
				// Only include public shorts with YouTube IDs
				if (!video.youtube_video_id || video.status !== 'public' || !video.is_short) {
					return false
				}
				
				// Skip duplicates
				if (seenIds.has(video.youtube_video_id)) {
					return false
				}
				seenIds.add(video.youtube_video_id)
				return true
			})
			.map((video: any) => {
				const videoId = video.youtube_video_id
				const title = video.title || ''
				// Use existing slug from database, or generate one if not present
				const slug = video.slug || generateSlug(title, videoId)
				
				return {
					id: videoId,
					title: title,
					description: video.description || '',
					thumbnail: video.thumbnail_url || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
					publishedAt: video.published_on || video.last_modified || new Date().toISOString(),
					channelName: 'Tellme360',
					slug: slug,
					recordingLocation: video.recording_location || undefined,
					isShort: true
				}
			})

		// Sort by published date (newest first)
		shorts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

		// Validate shorts - check if they are accessible
		console.log(`Validating ${shorts.length} shorts...`)
		const validShorts = await validateYouTubeVideos(shorts, 5) // Validate 5 at a time
		console.log(`Found ${validShorts.length} valid shorts out of ${shorts.length}`)

		return validShorts
	} catch (error) {
		console.error('Error loading shorts from JSON:', error)
		throw error instanceof Error ? error : new Error('Failed to load shorts from JSON file')
	}
}

/**
 * Searches for videos in the tellme_videohub_db JSON file
 * @param query - Search query string
 * @returns Array of YouTube videos matching the search query
 */
export async function searchVideosInDatabase(query: string): Promise<YouTubeVideo[]> {
	try {
		if (!query || query.trim().length === 0) {
			return []
		}

		const searchTerm = query.toLowerCase().trim()
		
		// Read the JSON file from the public directory
		const filePath = path.join(process.cwd(), 'public', 'tellme_videohub_db_2025-07-18_171335.json')
		const fileContents = fs.readFileSync(filePath, 'utf-8')
		const data = JSON.parse(fileContents)

		// Check if videos array exists
		if (!data.videos || !Array.isArray(data.videos)) {
			throw new Error('Videos array not found in JSON file')
		}

		// Search in title, description, and other relevant fields
		const seenIds = new Set<string>()
		const videos: YouTubeVideo[] = data.videos
			.filter((video: any) => {
				// Only include public videos with YouTube IDs
				if (!video.youtube_video_id || video.status !== 'public') {
					return false
				}
				
				// Skip duplicates
				if (seenIds.has(video.youtube_video_id)) {
					return false
				}
				seenIds.add(video.youtube_video_id)

				// Search in title and description
				const title = (video.title || '').toLowerCase()
				const description = (video.description || '').toLowerCase()
				const recordingLocation = (video.recording_location || '').toLowerCase()
				
				return title.includes(searchTerm) || 
				       description.includes(searchTerm) || 
				       recordingLocation.includes(searchTerm)
			})
			.map((video: any) => {
				const videoId = video.youtube_video_id
				const title = video.title || ''
				// Use existing slug from database, or generate one if not present
				const slug = video.slug || generateSlug(title, videoId)
				
				return {
					id: videoId,
					title: title,
					description: video.description || '',
					thumbnail: video.thumbnail_url || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`, // Use hqdefault as it's more reliable
					publishedAt: video.published_on || video.last_modified || new Date().toISOString(),
					channelName: 'Tellme360',
					slug: slug,
					recordingLocation: video.recording_location || undefined,
					isShort: video.is_short || false
				}
			})

		// Validate videos - check if they are accessible
		console.log(`Validating ${videos.length} search results...`)
		const validVideos = await validateYouTubeVideos(videos, 5) // Validate 5 at a time
		console.log(`Found ${validVideos.length} valid videos out of ${videos.length}`)

		return validVideos
	} catch (error) {
		console.error('Error searching videos:', error)
		throw error instanceof Error ? error : new Error('Failed to search videos')
	}
}

/**
 * Gets a single video by slug from the database
 * @param slug - Video slug
 * @returns YouTubeVideo object or null if not found
 */
export async function getVideoBySlug(slug: string): Promise<YouTubeVideo | null> {
	try {
		// First try the tellme_videohub_db file (has more details like recording_location)
		try {
			const dbFilePath = path.join(process.cwd(), 'public', 'tellme_videohub_db_2025-07-18_171335.json')
			if (fs.existsSync(dbFilePath)) {
				const fileContents = fs.readFileSync(dbFilePath, 'utf-8')
				const data = JSON.parse(fileContents)

				if (data.videos && Array.isArray(data.videos)) {
					const video = data.videos.find((v: any) => v.slug === slug && v.status === 'public')
					if (video) {
						const videoId = video.youtube_video_id
						const title = video.title || ''
						const videoSlug = video.slug || generateSlug(title, videoId)
						
						return {
							id: videoId,
							title: title,
							description: video.description || '',
							thumbnail: video.thumbnail_url || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
							publishedAt: video.published_on || video.last_modified || new Date().toISOString(),
							channelName: 'Tellme360',
							slug: videoSlug,
							recordingLocation: video.recording_location || undefined,
							isShort: video.is_short || false
						}
					}
				}
			}
		} catch (err) {
			console.warn('Error reading tellme_videohub_db file:', err)
		}

		// Fallback to json_youtube.json (search by generated slug pattern)
		const filePath = path.join(process.cwd(), 'public', 'json_youtube.json')
		if (fs.existsSync(filePath)) {
			const fileContents = fs.readFileSync(filePath, 'utf-8')
			const data = JSON.parse(fileContents)

			if (Array.isArray(data)) {
				// Find video by matching slug
				for (const [index, video] of data.entries()) {
					const videoId = extractVideoId(video.url)
					if (!videoId) continue
					
					const title = video.title || ''
					const generatedSlug = generateSlug(title, videoId)
					
					if (generatedSlug === slug) {
						const playlistId = extractPlaylistId(video.url)
						const embedUrl = video.embed
							? String(video.embed)
							: playlistId
								? `https://www.youtube.com/embed/videoseries?list=${playlistId}`
								: `https://www.youtube.com/embed/${videoId}`

						return {
							id: videoId,
							title: title,
							description: video.description || '',
							thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
							publishedAt: new Date().toISOString(),
							channelName: 'Tellme360',
							slug: generatedSlug,
							playlistId: playlistId || undefined,
							playlistIndex: playlistId ? index + 1 : undefined,
							embedUrl: embedUrl
						}
					}
				}
			}
		}

		return null
	} catch (error) {
		console.error('Error getting video by slug:', error)
		return null
	}
}
