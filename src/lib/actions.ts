'use server';

import { buildYouTubeSearchUrl } from '@/shadcn_data/lib/youtube';
import type { ImageCategory, ImageListing } from '@/types/image';
import type { YouTubeVideo } from '@/types/youtube';
import fs from 'fs';
import path from 'path';

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
		.replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens

	// Limit length and append video ID for uniqueness
	const maxLength = 100;
	if (slug.length > maxLength) {
		slug = slug.substring(0, maxLength);
	}

	// Append video ID to ensure uniqueness
	slug = `${slug}-${videoId}`;

	return slug;
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
const YOUTUBE_API_KEY =
	process.env.YOUTUBE_API_KEY || 'AIzaSyAGxe-DHqTcWVqPtDCXo4EmiP85ztIMp3Y';

/**
 * Resolves a YouTube channel handle (@username) to channel ID
 */
async function resolveChannelHandle(handle: string): Promise<string> {
	// Remove @ if present
	const cleanHandle = handle.startsWith('@') ? handle.slice(1) : handle;

	// Method 1: Try using channels.list with forHandle parameter (newer API feature)
	try {
		const channelsUrl = `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${encodeURIComponent(cleanHandle)}&key=${YOUTUBE_API_KEY}`;
		const response = await fetch(channelsUrl);

		if (response.ok) {
			const data = await response.json();
			if (data.items && data.items.length > 0) {
				return data.items[0].id;
			}
		} else {
			// If response is not ok, log the error but continue to fallback method
			const errorData = await response.json().catch(() => ({}));
			console.warn(
				`forHandle method returned ${response.status}:`,
				errorData.error?.message || response.statusText
			);
		}
	} catch (error) {
		console.warn('forHandle method failed, trying alternative method:', error);
	}

	// Method 2: Fallback - Use search endpoint
	try {
		const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(handle)}&type=channel&key=${YOUTUBE_API_KEY}&maxResults=1`;
		const response = await fetch(searchUrl);

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			const errorMessage = errorData.error?.message || response.statusText;
			const errorReason = errorData.error?.errors?.[0]?.reason || '';

			// Provide more helpful error messages
			if (response.status === 403) {
				throw new Error(
					`API access forbidden. Please check: 1) API key is valid, 2) YouTube Data API v3 is enabled, 3) API key has proper permissions. Error: ${errorMessage}`
				);
			}

			throw new Error(
				`Failed to resolve channel handle: ${response.statusText} - ${errorMessage}${errorReason ? ` (${errorReason})` : ''}`
			);
		}

		const data = await response.json();
		if (data.items && data.items.length > 0) {
			return data.items[0].snippet.channelId;
		}
	} catch (error) {
		console.error('Search method also failed:', error);
		throw error instanceof Error
			? error
			: new Error(`Failed to resolve channel handle: ${handle}`);
	}

	throw new Error(`Channel handle "${handle}" not found`);
}

/**
 * Fetches ALL YouTube videos for a given channel using pagination
 * @param channelId - YouTube channel ID or handle (e.g., "@Tellme360" or "UC...")
 * @returns Array of all YouTube videos from the channel
 */
export async function fetchYouTubeVideos(
	channelId: string
): Promise<YouTubeVideo[]> {
	try {
		// If channelId starts with @, resolve it to actual channel ID
		let actualChannelId = channelId;

		if (channelId.startsWith('@')) {
			actualChannelId = await resolveChannelHandle(channelId);
		}

		const allVideos: YouTubeVideo[] = [];
		let nextPageToken: string | undefined = undefined;
		let pageCount = 0;
		const maxPages = 100; // Safety limit to prevent infinite loops

		// Fetch all pages of videos
		do {
			// Fetch videos using the channel ID with pagination
			const url = buildYouTubeSearchUrl(
				YOUTUBE_API_KEY,
				actualChannelId,
				50,
				nextPageToken
			);
			const response = await fetch(url);

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(
					`YouTube API error: ${response.statusText} - ${errorData.error?.message || ''}`
				);
			}

			const data = await response.json();

			if (!data.items || data.items.length === 0) {
				break;
			}

			// Transform API response to YouTubeVideo format and add to array
			const videos = data.items.map((item: any) => ({
				id: item.id.videoId,
				title: item.snippet.title,
				description: item.snippet.description || '',
				thumbnail:
					item.snippet.thumbnails.high?.url ||
					item.snippet.thumbnails.default?.url ||
					'',
				publishedAt: item.snippet.publishedAt,
				channelName: item.snippet.channelTitle
			}));

			allVideos.push(...videos);

			// Get next page token if available
			nextPageToken = data.nextPageToken;
			pageCount++;

			// Safety check to prevent infinite loops
			if (pageCount >= maxPages) {
				console.warn(
					`Reached maximum page limit (${maxPages}). Stopping pagination.`
				);
				break;
			}
		} while (nextPageToken);

		return allVideos;
	} catch (error) {
		console.error('Error fetching YouTube videos:', error);
		throw error instanceof Error
			? error
			: new Error('Failed to fetch YouTube videos');
	}
}

/**
 * Extracts YouTube video ID from a YouTube URL
 */
function extractVideoId(url: string): string | null {
	const patterns = [
		/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
		/youtube\.com\/watch\?.*v=([^&\n?#]+)/
	];

	for (const pattern of patterns) {
		const match = url.match(pattern);
		if (match && match[1]) {
			return match[1];
		}
	}

	return null;
}

/**
 * Extracts YouTube playlist ID from a YouTube URL
 */
function extractPlaylistId(url: string): string | null {
	const match = url.match(/[?&]list=([^&\n?#]+)/);
	return match && match[1] ? match[1] : null;
}

/**
 * Validates if a YouTube video is accessible by checking the video's oEmbed endpoint
 * @param videoId - YouTube video ID
 * @returns Promise<boolean> - true if video is accessible, false otherwise
 */
async function isYouTubeVideoAccessible(videoId: string): Promise<boolean> {
	try {
		// Create abort controller for timeout
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

		// Use YouTube oEmbed API to check if video exists and is accessible
		const oEmbedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
		const response = await fetch(oEmbedUrl, {
			method: 'GET',
			signal: controller.signal
		});

		clearTimeout(timeoutId);

		// If oEmbed returns 200, video is accessible
		if (response.ok) {
			return true;
		}

		// If oEmbed fails, try checking the thumbnail as a fallback
		const thumbnailController = new AbortController();
		const thumbnailTimeoutId = setTimeout(
			() => thumbnailController.abort(),
			3000
		); // 3 second timeout

		const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/default.jpg`;
		const thumbnailResponse = await fetch(thumbnailUrl, {
			method: 'HEAD',
			signal: thumbnailController.signal
		});

		clearTimeout(thumbnailTimeoutId);
		return thumbnailResponse.ok;
	} catch (error) {
		// If both checks fail, assume video is not accessible
		console.warn(`Video ${videoId} validation failed:`, error);
		return false;
	}
}

/**
 * Validates multiple YouTube videos in parallel (with concurrency limit)
 * @param videos - Array of YouTubeVideo objects to validate
 * @param concurrency - Maximum number of concurrent validations (default: 5)
 * @returns Promise<YouTubeVideo[]> - Array of valid videos
 */
async function validateYouTubeVideos(
	videos: YouTubeVideo[],
	concurrency: number = 5
): Promise<YouTubeVideo[]> {
	const validVideos: YouTubeVideo[] = [];

	// Process videos in batches to avoid overwhelming the API
	for (let i = 0; i < videos.length; i += concurrency) {
		const batch = videos.slice(i, i + concurrency);
		const validationPromises = batch.map(async (video) => {
			const isValid = await isYouTubeVideoAccessible(video.id);
			return isValid ? video : null;
		});

		const results = await Promise.all(validationPromises);
		validVideos.push(
			...results.filter((video): video is YouTubeVideo => video !== null)
		);
	}

	return validVideos;
}

/**
 * Loads videos from json_youtube.json file
 * @returns Array of YouTube videos from the JSON file
 */
export async function loadVideosFromJSON(): Promise<YouTubeVideo[]> {
	try {
		// Read the JSON file from the public directory
		const filePath = path.join(process.cwd(), 'public', 'json_youtube.json');
		const fileContents = fs.readFileSync(filePath, 'utf-8');
		const data = JSON.parse(fileContents);

		// Check if data is an array
		if (!Array.isArray(data)) {
			throw new Error('JSON file should contain an array of videos');
		}

		// Transform JSON video data to YouTubeVideo format
		const videos: YouTubeVideo[] = data
			.map((video: any, index: number) => {
				const videoId = extractVideoId(video.url);
				if (!videoId) {
					return null;
				}

				const playlistId = extractPlaylistId(video.url);
				const title = video.title || '';
				const slug = generateSlug(title, videoId);
				const playlistIndex = playlistId ? index + 1 : undefined;
				const embedUrl = video.embed
					? String(video.embed)
					: playlistId
						? `https://www.youtube.com/embed/videoseries?list=${playlistId}`
						: `https://www.youtube.com/embed/${videoId}`;

				return {
					id: videoId,
					title: title,
					description: video.description || '',
					thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`, // Use hqdefault as it's more reliable
					publishedAt: new Date().toISOString(), // json_youtube.json doesn't have published date
					channelName: 'Tellme360',
					slug: slug,
					playlistId: playlistId,
					playlistIndex: playlistIndex,
					embedUrl: embedUrl
				} as YouTubeVideo;
			})
			.filter((video): video is YouTubeVideo => video !== null);

		// Validate videos - check if they are accessible
		console.log(`Validating ${videos.length} videos...`);
		const validVideos = await validateYouTubeVideos(videos, 5); // Validate 5 at a time
		console.log(
			`Found ${validVideos.length} valid videos out of ${videos.length}`
		);

		return validVideos;
	} catch (error) {
		console.error('Error loading videos from JSON:', error);
		throw error instanceof Error
			? error
			: new Error('Failed to load videos from JSON file');
	}
}

/**
 * Loads videos for a specific playlist from json_youtube.json without validation
 * @param playlistId - YouTube playlist ID
 * @returns Array of YouTube videos in the playlist (in JSON order)
 */
export async function loadPlaylistFromJSON(
	playlistId: string
): Promise<YouTubeVideo[]> {
	try {
		const filePath = path.join(process.cwd(), 'public', 'json_youtube.json');
		const fileContents = fs.readFileSync(filePath, 'utf-8');
		const data = JSON.parse(fileContents);

		if (!Array.isArray(data)) {
			throw new Error('JSON file should contain an array of videos');
		}

		return data
			.map((video: any, index: number) => {
				const videoId = extractVideoId(video.url);
				if (!videoId) {
					return null;
				}

				const parsedPlaylistId = extractPlaylistId(video.url);
				if (!parsedPlaylistId || parsedPlaylistId !== playlistId) {
					return null;
				}

				const title = video.title || '';
				const slug = generateSlug(title, videoId);
				const embedUrl = video.embed
					? String(video.embed)
					: `https://www.youtube.com/embed/videoseries?list=${parsedPlaylistId}`;

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
				} as YouTubeVideo;
			})
			.filter((video): video is YouTubeVideo => video !== null);
	} catch (error) {
		console.error('Error loading playlist from JSON:', error);
		return [];
	}
}

/**
 * Loads shorts from tellme_videohub_db JSON file
 * @returns Array of YouTube shorts (videos where is_short is true)
 */
export async function loadShortsFromJSON(): Promise<YouTubeVideo[]> {
	try {
		// Read the JSON file from the public directory
		const filePath = path.join(
			process.cwd(),
			'public',
			'tellme_videohub_db_2025-07-18_171335.json'
		);
		const fileContents = fs.readFileSync(filePath, 'utf-8');
		const data = JSON.parse(fileContents);

		// Check if videos array exists
		if (!data.videos || !Array.isArray(data.videos)) {
			throw new Error('Videos array not found in JSON file');
		}

		// Filter only shorts (is_short === true) and public videos
		const seenIds = new Set<string>();
		const shorts: YouTubeVideo[] = data.videos
			.filter((video: any) => {
				// Only include public shorts with YouTube IDs
				if (
					!video.youtube_video_id ||
					video.status !== 'public' ||
					!video.is_short
				) {
					return false;
				}

				// Skip duplicates
				if (seenIds.has(video.youtube_video_id)) {
					return false;
				}
				seenIds.add(video.youtube_video_id);
				return true;
			})
			.map((video: any) => {
				const videoId = video.youtube_video_id;
				const title = video.title || '';
				// Use existing slug from database, or generate one if not present
				const slug = video.slug || generateSlug(title, videoId);

				return {
					id: videoId,
					title: title,
					description: video.description || '',
					thumbnail:
						video.thumbnail_url ||
						`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
					publishedAt:
						video.published_on ||
						video.last_modified ||
						new Date().toISOString(),
					channelName: 'Tellme360',
					slug: slug,
					recordingLocation: video.recording_location || undefined,
					isShort: true
				};
			});

		// Sort by published date (newest first)
		shorts.sort(
			(a, b) =>
				new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
		);

		// Validate shorts - check if they are accessible
		console.log(`Validating ${shorts.length} shorts...`);
		const validShorts = await validateYouTubeVideos(shorts, 5); // Validate 5 at a time
		console.log(
			`Found ${validShorts.length} valid shorts out of ${shorts.length}`
		);

		return validShorts;
	} catch (error) {
		console.error('Error loading shorts from JSON:', error);
		throw error instanceof Error
			? error
			: new Error('Failed to load shorts from JSON file');
	}
}

/**
 * Searches for videos in the tellme_videohub_db JSON file
 * @param query - Search query string
 * @returns Array of YouTube videos matching the search query
 */
export async function searchVideosInDatabase(
	query: string
): Promise<YouTubeVideo[]> {
	try {
		if (!query || query.trim().length === 0) {
			return [];
		}

		const searchTerm = query.toLowerCase().trim();

		// Read the JSON file from the public directory
		const filePath = path.join(
			process.cwd(),
			'public',
			'tellme_videohub_db_2025-07-18_171335.json'
		);
		const fileContents = fs.readFileSync(filePath, 'utf-8');
		const data = JSON.parse(fileContents);

		// Check if videos array exists
		if (!data.videos || !Array.isArray(data.videos)) {
			throw new Error('Videos array not found in JSON file');
		}

		// Search in title, description, and other relevant fields
		const seenIds = new Set<string>();
		const videos: YouTubeVideo[] = data.videos
			.filter((video: any) => {
				// Only include public videos with YouTube IDs
				if (!video.youtube_video_id || video.status !== 'public') {
					return false;
				}

				// Skip duplicates
				if (seenIds.has(video.youtube_video_id)) {
					return false;
				}
				seenIds.add(video.youtube_video_id);

				// Search in title and description
				const title = (video.title || '').toLowerCase();
				const description = (video.description || '').toLowerCase();
				const recordingLocation = (
					video.recording_location || ''
				).toLowerCase();

				return (
					title.includes(searchTerm) ||
					description.includes(searchTerm) ||
					recordingLocation.includes(searchTerm)
				);
			})
			.map((video: any) => {
				const videoId = video.youtube_video_id;
				const title = video.title || '';
				// Use existing slug from database, or generate one if not present
				const slug = video.slug || generateSlug(title, videoId);

				return {
					id: videoId,
					title: title,
					description: video.description || '',
					thumbnail:
						video.thumbnail_url ||
						`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`, // Use hqdefault as it's more reliable
					publishedAt:
						video.published_on ||
						video.last_modified ||
						new Date().toISOString(),
					channelName: 'Tellme360',
					slug: slug,
					recordingLocation: video.recording_location || undefined,
					isShort: video.is_short || false
				};
			});

		// Validate videos - check if they are accessible
		console.log(`Validating ${videos.length} search results...`);
		const validVideos = await validateYouTubeVideos(videos, 5); // Validate 5 at a time
		console.log(
			`Found ${validVideos.length} valid videos out of ${videos.length}`
		);

		return validVideos;
	} catch (error) {
		console.error('Error searching videos:', error);
		throw error instanceof Error ? error : new Error('Failed to search videos');
	}
}

/**
 * Gets a single video by slug from the database
 * @param slug - Video slug
 * @param isShort - Optional: if true, only search for shorts; if false, only search for regular videos
 * @returns YouTubeVideo object or null if not found
 */
export async function getVideoBySlug(
	slug: string,
	isShort?: boolean
): Promise<YouTubeVideo | null> {
	try {
		// First try the tellme_videohub_db file (has more details like recording_location)
		try {
			const dbFilePath = path.join(
				process.cwd(),
				'public',
				'tellme_videohub_db_2025-07-18_171335.json'
			);
			if (fs.existsSync(dbFilePath)) {
				const fileContents = fs.readFileSync(dbFilePath, 'utf-8');
				const data = JSON.parse(fileContents);

				if (data.videos && Array.isArray(data.videos)) {
					// Filter by is_short if specified
					let filteredVideos = data.videos;
					if (isShort !== undefined) {
						filteredVideos = data.videos.filter((v: any) =>
							isShort ? v.is_short === true : v.is_short !== true
						);
					}

					// First try exact slug match (case-sensitive first, most reliable)
					let video = filteredVideos.find(
						(v: any) => v.slug === slug && v.status === 'public'
					);

					// If not found, try exact slug match with URL decoding
					if (!video) {
						const decodedSlug = decodeURIComponent(slug);
						video = filteredVideos.find(
							(v: any) => v.slug === decodedSlug && v.status === 'public'
						);
					}

					// If not found, try to extract video ID from slug and match by ID
					// Slugs typically end with the video ID (e.g., "title-videoId")
					if (!video) {
						// Try multiple methods to extract video ID from slug
						let potentialVideoId: string | null = null;

						// Method 1: Check if slug ends with a video ID (11 characters after last hyphen)
						const slugParts = slug.split('-');
						if (slugParts.length > 0) {
							const lastPart = slugParts[slugParts.length - 1];
							// YouTube video IDs are exactly 11 characters
							if (
								lastPart &&
								lastPart.length === 11 &&
								/^[a-zA-Z0-9_-]{11}$/.test(lastPart)
							) {
								potentialVideoId = lastPart;
							}
						}

						// Method 2: If slug ends with video ID directly (no hyphen before it)
						// Extract last 11 characters if they match video ID pattern
						if (!potentialVideoId && slug.length >= 11) {
							const last11 = slug.slice(-11);
							if (/^[a-zA-Z0-9_-]{11}$/.test(last11)) {
								potentialVideoId = last11;
							}
						}

						// Try to find video by extracted ID (this is the most reliable method)
						if (potentialVideoId) {
							video = filteredVideos.find(
								(v: any) =>
									v.youtube_video_id === potentialVideoId &&
									v.status === 'public'
							);
						}

						// Method 3: Try case-insensitive exact slug match
						if (!video) {
							video = filteredVideos.find(
								(v: any) =>
									v.slug &&
									v.slug.toLowerCase() === slug.toLowerCase() &&
									v.status === 'public'
							);
						}

						// Method 4: Last resort - try to find video ID anywhere in slug, but prioritize exact matches
						// Only use this if we haven't found a match yet and the slug looks like it might contain a video ID
						if (!video && slug.length >= 11) {
							// Find all potential 11-character sequences in the slug
							const videoIdPattern = /[a-zA-Z0-9_-]{11}/g;
							const matches = slug.match(videoIdPattern);
							if (matches && matches.length > 0) {
								// Try each potential video ID (starting from the end, as IDs are usually at the end)
								// But only match if the slug from the database also contains this video ID
								for (let i = matches.length - 1; i >= 0; i--) {
									const testVideoId = matches[i];
									const foundVideo = filteredVideos.find(
										(v: any) =>
											v.youtube_video_id === testVideoId &&
											v.status === 'public' &&
											// Additional check: ensure the stored slug also contains or ends with this ID
											(v.slug?.endsWith(`-${testVideoId}`) ||
												v.slug?.endsWith(testVideoId))
									);
									if (foundVideo) {
										video = foundVideo;
										break;
									}
								}
							}
						}
					}

					if (video) {
						const videoId = video.youtube_video_id;
						const title = video.title || '';
						const videoSlug = video.slug || generateSlug(title, videoId);

						// Try to get embed URL from json_youtube.json if this is a regular video (not a short)
						// This ensures featured videos use the embed URL from json_youtube.json
						let embedUrl: string | undefined = undefined;
						if (!video.is_short) {
							try {
								const jsonFilePath = path.join(
									process.cwd(),
									'public',
									'json_youtube.json'
								);
								if (fs.existsSync(jsonFilePath)) {
									const jsonFileContents = fs.readFileSync(
										jsonFilePath,
										'utf-8'
									);
									const jsonData = JSON.parse(jsonFileContents);
									if (Array.isArray(jsonData)) {
										// Find matching video by video ID
										const jsonVideo = jsonData.find((v: any) => {
											const vId = extractVideoId(v.url);
											return vId === videoId;
										});
										if (jsonVideo && jsonVideo.embed) {
											embedUrl = String(jsonVideo.embed);
										}
									}
								}
							} catch {
								// Ignore errors, will use default embed URL
							}
						}

						return {
							id: videoId,
							title: title,
							description: video.description || '',
							thumbnail:
								video.thumbnail_url ||
								`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
							publishedAt:
								video.published_on ||
								video.last_modified ||
								new Date().toISOString(),
							channelName: 'Tellme360',
							slug: videoSlug,
							recordingLocation: video.recording_location || undefined,
							isShort: video.is_short || false,
							embedUrl: embedUrl
						};
					}
				}
			}
		} catch (err) {
			console.warn('Error reading tellme_videohub_db file:', err);
		}

		// Fallback to json_youtube.json (search by generated slug pattern)
		const filePath = path.join(process.cwd(), 'public', 'json_youtube.json');
		if (fs.existsSync(filePath)) {
			const fileContents = fs.readFileSync(filePath, 'utf-8');
			const data = JSON.parse(fileContents);

			if (Array.isArray(data)) {
				// Find video by matching slug
				for (const [index, video] of data.entries()) {
					const videoId = extractVideoId(video.url);
					if (!videoId) continue;

					const title = video.title || '';
					const generatedSlug = generateSlug(title, videoId);

					if (generatedSlug === slug) {
						const playlistId = extractPlaylistId(video.url);
						const embedUrl = video.embed
							? String(video.embed)
							: playlistId
								? `https://www.youtube.com/embed/videoseries?list=${playlistId}`
								: `https://www.youtube.com/embed/${videoId}`;

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
						};
					}
				}
			}
		}

		return null;
	} catch (error) {
		console.error('Error getting video by slug:', error);
		return null;
	}
}

/**
 * Loads images from image_listings.json file and groups them by category
 * @returns Array of image categories with their images
 */
/**
 * Normalizes category ID to handle variations like "monument" vs "monuments"
 * @param categoryId - Raw category ID
 * @returns Normalized category ID
 */
function normalizeCategory(categoryId: string): string {
	let normalized = categoryId.toLowerCase().trim();

	// Replace ampersand with 'and'
	normalized = normalized.replace(/\s+&\s+/g, ' and ');

	// Handle singular/plural variations manually for better accuracy
	const mappings: Record<string, string> = {
		monument: 'monuments',
		temple: 'temples',
		building: 'buildings',
		'local market': 'local markets'
	};

	if (mappings[normalized]) {
		return mappings[normalized];
	}

	return normalized;
}

/**
 * Formats category ID to a readable name (title case)
 * @param categoryId - Category ID string
 * @returns Formatted category name
 */
function formatCategoryName(categoryId: string): string {
	return categoryId
		.split(' ')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(' ');
}

/**
 * Loads images from image_listings.json file and groups them by category
 * @returns Array of image categories with their images
 */
export async function loadImagesFromJSON(): Promise<ImageCategory[]> {
	try {
		const filePath = path.join(process.cwd(), 'public', 'image_listings.json');
		const fileContents = fs.readFileSync(filePath, 'utf-8');
		const images: ImageListing[] = JSON.parse(fileContents);

		if (!Array.isArray(images)) {
			throw new Error('JSON file should contain an array of images');
		}

		// Filter only public images
		const publicImages = images.filter((img) => img.status === 'public');

		// Group images by category
		const categoryMap = new Map<string, ImageListing[]>();

		publicImages.forEach((image) => {
			const rawCategory = image.image_category_id || 'uncategorized';
			const categoryId = normalizeCategory(rawCategory);

			if (!categoryMap.has(categoryId)) {
				categoryMap.set(categoryId, []);
			}
			categoryMap.get(categoryId)!.push(image);
		});

		// Convert map to array of categories
		const categories: ImageCategory[] = Array.from(categoryMap.entries()).map(
			([categoryId, categoryImages]) => {
				// Get slug from first image in category
				const firstImage = categoryImages[0];
				const categorySlug =
					(firstImage as any).category_slug ||
					normalizeCategory(categoryId).replace(/\s+/g, '-');

				return {
					categoryId,
					categoryName: formatCategoryName(categoryId),
					categorySlug,
					images: categoryImages.sort((a, b) => b.priority - a.priority) // Sort by priority
				};
			}
		);

		// Sort categories alphabetically
		categories.sort((a, b) => a.categoryName.localeCompare(b.categoryName));

		return categories;
	} catch (error) {
		console.error('Error loading images from JSON:', error);
		throw error instanceof Error
			? error
			: new Error('Failed to load images from JSON file');
	}
}

/**
 * Searches for images in the image_listings.json file
 * @param query - Search query string
 * @returns Array of image categories matching the search query
 */
export async function searchImagesInDatabase(
	query: string
): Promise<ImageCategory[]> {
	try {
		if (!query || query.trim().length === 0) {
			return [];
		}

		const searchTerm = query.toLowerCase().trim();
		const filePath = path.join(process.cwd(), 'public', 'image_listings.json');
		const fileContents = fs.readFileSync(filePath, 'utf-8');
		const images: ImageListing[] = JSON.parse(fileContents);

		if (!Array.isArray(images)) {
			throw new Error('JSON file should contain an array of images');
		}

		// Search in title, description, location, category, and other relevant fields
		const filteredImages = images.filter((image) => {
			if (image.status !== 'public') return false;

			const title = (image.title || '').toLowerCase();
			const description = (image.description || '').toLowerCase();
			const category = (image.image_category_id || '').toLowerCase();
			const city = (image.city || '').toLowerCase();
			const state = (image.state || '').toLowerCase();
			const location = (image.captured_location || '').toLowerCase();

			return (
				title.includes(searchTerm) ||
				description.includes(searchTerm) ||
				category.includes(searchTerm) ||
				city.includes(searchTerm) ||
				state.includes(searchTerm) ||
				location.includes(searchTerm)
			);
		});

		// Group filtered images by category
		const categoryMap = new Map<string, ImageListing[]>();

		filteredImages.forEach((image) => {
			const rawCategory = image.image_category_id || 'uncategorized';
			const categoryId = normalizeCategory(rawCategory);

			if (!categoryMap.has(categoryId)) {
				categoryMap.set(categoryId, []);
			}
			categoryMap.get(categoryId)!.push(image);
		});

		// Convert map to array of categories
		const categories: ImageCategory[] = Array.from(categoryMap.entries()).map(
			([categoryId, categoryImages]) => {
				// Get slug from first image in category
				const firstImage = categoryImages[0];
				const categorySlug =
					(firstImage as any).category_slug ||
					normalizeCategory(categoryId).replace(/\s+/g, '-');

				return {
					categoryId,
					categoryName: formatCategoryName(categoryId),
					categorySlug,
					images: categoryImages.sort((a, b) => b.priority - a.priority)
				};
			}
		);

		// Sort categories alphabetically
		categories.sort((a, b) => a.categoryName.localeCompare(b.categoryName));

		return categories;
	} catch (error) {
		console.error('Error searching images:', error);
		throw error instanceof Error ? error : new Error('Failed to search images');
	}
}

/**
 * Normalizes category slug to handle variations
 * @param categorySlug - Raw category slug
 * @returns Normalized category slug
 */
function normalizeCategorySlug(categorySlug: string): string {
	return categorySlug.toLowerCase().trim().replace(/\s+/g, '-');
}

/**
 * Gets images by category slug from JSON file with pagination and optional location filters
 * @param categorySlug - Category slug (e.g., "black-and-white")
 * @param limit - Number of images per page (default: 10)
 * @param skip - Number of images to skip (for pagination)
 * @param stateFilter - Optional state name to filter by (e.g., "madhya pradesh")
 * @param cityFilter - Optional city name to filter by (e.g., "orchha")
 * @returns Object with images array and total count
 */
export async function getImagesByCategorySlug(
	categorySlug: string,
	limit: number = 10,
	skip: number = 0,
	stateFilter?: string,
	cityFilter?: string
): Promise<{ images: ImageListing[]; total: number }> {
	try {
		const filePath = path.join(process.cwd(), 'public', 'image_listings.json');
		const fileContents = fs.readFileSync(filePath, 'utf-8');
		const allImages: ImageListing[] = JSON.parse(fileContents);

		if (!Array.isArray(allImages)) {
			throw new Error('JSON file should contain an array of images');
		}

		// Normalize the category slug
		const normalizedSlug = normalizeCategorySlug(categorySlug);

		// Filter images by category_slug, status, and location filters
		const filteredImages = allImages.filter((image) => {
			if (image.status !== 'public') return false;
			
			// Category filter
			const imageCategorySlug = (image as any).category_slug || '';
			if (normalizeCategorySlug(imageCategorySlug) !== normalizedSlug) {
				return false;
			}

			// State filter (case-insensitive)
			if (stateFilter) {
				const imageState = (image.state || '').toLowerCase().trim();
				const filterState = stateFilter.toLowerCase().trim();
				if (imageState !== filterState) {
					return false;
				}
			}

			// City filter (case-insensitive)
			if (cityFilter) {
				const imageCity = (image.city || '').toLowerCase().trim();
				const filterCity = cityFilter.toLowerCase().trim();
				if (imageCity !== filterCity) {
					return false;
				}
			}

			return true;
		});

		// Sort by priority (highest first)
		const sortedImages = filteredImages.sort((a, b) => b.priority - a.priority);

		// Apply pagination
		const paginatedImages = sortedImages.slice(skip, skip + limit);

		return {
			images: paginatedImages,
			total: sortedImages.length
		};
	} catch (error) {
		console.error('Error loading images by category slug:', error);
		throw error instanceof Error
			? error
			: new Error('Failed to load images by category slug');
	}
}

/**
 * Gets all unique states and cities from images in a specific category
 * @param categorySlug - Category slug to get locations for
 * @param stateFilter - Optional state to filter cities by
 * @returns Object with unique states and cities arrays (cities filtered by state if provided)
 */
export async function getCategoryLocations(
	categorySlug: string,
	stateFilter?: string
): Promise<{ states: string[]; cities: string[] }> {
	try {
		const filePath = path.join(process.cwd(), 'public', 'image_listings.json');
		const fileContents = fs.readFileSync(filePath, 'utf-8');
		const allImages: ImageListing[] = JSON.parse(fileContents);

		if (!Array.isArray(allImages)) {
			throw new Error('JSON file should contain an array of images');
		}

		// Normalize the category slug
		const normalizedSlug = normalizeCategorySlug(categorySlug);

		// Filter images by category
		let categoryImages = allImages.filter((image) => {
			if (image.status !== 'public') return false;
			const imageCategorySlug = (image as any).category_slug || '';
			return normalizeCategorySlug(imageCategorySlug) === normalizedSlug;
		});

		// If state filter is provided, filter images by state first
		if (stateFilter) {
			const normalizedStateFilter = stateFilter.toLowerCase().trim();
			categoryImages = categoryImages.filter((image) => {
				const imageState = (image.state || '').toLowerCase().trim();
				return imageState === normalizedStateFilter;
			});
		}

		// Extract unique states
		const statesSet = new Set<string>();
		allImages
			.filter((image) => {
				if (image.status !== 'public') return false;
				const imageCategorySlug = (image as any).category_slug || '';
				return normalizeCategorySlug(imageCategorySlug) === normalizedSlug;
			})
			.forEach((image) => {
				if (image.state && image.state.trim()) {
					statesSet.add(image.state.trim().toLowerCase());
				}
			});

		// Extract unique cities (from filtered category images)
		const citiesSet = new Set<string>();
		categoryImages.forEach((image) => {
			if (image.city && image.city.trim()) {
				citiesSet.add(image.city.trim().toLowerCase());
			}
		});

		return {
			states: Array.from(statesSet).sort(),
			cities: Array.from(citiesSet).sort()
		};
	} catch (error) {
		console.error('Error getting category locations:', error);
		return { states: [], cities: [] };
	}
}

/**
 * Gets all unique categories from JSON file
 * @returns Array of category objects with slug and name
 */
export async function getAllCategories(): Promise<
	Array<{ slug: string; name: string }>
> {
	try {
		const filePath = path.join(process.cwd(), 'public', 'image_listings.json');
		const fileContents = fs.readFileSync(filePath, 'utf-8');
		const allImages: ImageListing[] = JSON.parse(fileContents);

		if (!Array.isArray(allImages)) {
			throw new Error('JSON file should contain an array of images');
		}

		// Get unique categories
		const categoryMap = new Map<string, string>();

		allImages.forEach((image) => {
			if (image.status === 'public') {
				const categorySlug = (image as any).category_slug || '';
				const categoryName = image.image_category_id || 'Uncategorized';
				if (categorySlug && !categoryMap.has(categorySlug)) {
					categoryMap.set(categorySlug, categoryName);
				}
			}
		});

		return Array.from(categoryMap.entries()).map(([slug, name]) => ({
			slug,
			name: formatCategoryName(name)
		}));
	} catch (error) {
		console.error('Error loading categories:', error);
		throw error instanceof Error
			? error
			: new Error('Failed to load categories');
	}
}

/**
 * Gets a single image by slug from JSON file
 * @param slug - Image slug
 * @returns ImageListing object or null if not found
 */
export async function getImageBySlug(
	slug: string
): Promise<ImageListing | null> {
	try {
		const filePath = path.join(process.cwd(), 'public', 'image_listings.json');
		const fileContents = fs.readFileSync(filePath, 'utf-8');
		const allImages: ImageListing[] = JSON.parse(fileContents);

		if (!Array.isArray(allImages)) {
			throw new Error('JSON file should contain an array of images');
		}

		// Find image by slug (exact match first, then try URL decoded)
		let image = allImages.find(
			(img) => img.slug === slug && img.status === 'public'
		);

		if (!image) {
			const decodedSlug = decodeURIComponent(slug);
			image = allImages.find(
				(img) => img.slug === decodedSlug && img.status === 'public'
			);
		}

		return image || null;
	} catch (error) {
		console.error('Error getting image by slug:', error);
		return null;
	}
}

/**
 * Gets suggested images (from same category or random) from JSON file
 * @param currentImageId - ID of the current image to exclude
 * @param categorySlug - Optional category slug to get images from same category
 * @param limit - Number of images to return (default: 8)
 * @returns Array of ImageListing objects
 */
export async function getSuggestedImages(
	currentImageId: number,
	categorySlug?: string,
	limit: number = 8
): Promise<ImageListing[]> {
	try {
		const filePath = path.join(process.cwd(), 'public', 'image_listings.json');
		const fileContents = fs.readFileSync(filePath, 'utf-8');
		const allImages: ImageListing[] = JSON.parse(fileContents);

		if (!Array.isArray(allImages)) {
			throw new Error('JSON file should contain an array of images');
		}

		// Filter public images, exclude current image
		let candidates = allImages.filter(
			(img) => img.status === 'public' && img.id !== currentImageId
		);

		// If categorySlug is provided, prioritize images from same category
		if (categorySlug) {
			const normalizedSlug = normalizeCategorySlug(categorySlug);
			const sameCategory = candidates.filter((img) => {
				const imageCategorySlug = (img as any).category_slug || '';
				return normalizeCategorySlug(imageCategorySlug) === normalizedSlug;
			});

			// If we have enough images from same category, use those
			if (sameCategory.length >= limit) {
				candidates = sameCategory;
			} else {
				// Mix same category with others
				candidates = [
					...sameCategory,
					...candidates.filter((img) => {
						const imageCategorySlug = (img as any).category_slug || '';
						return normalizeCategorySlug(imageCategorySlug) !== normalizedSlug;
					})
				];
			}
		}

		// Sort by priority and shuffle
		const sorted = candidates.sort((a, b) => b.priority - a.priority);
		const shuffled = sorted.sort(() => 0.5 - Math.random());
		const suggested = shuffled.slice(0, limit);

		return suggested;
	} catch (error) {
		console.error('Error getting suggested images:', error);
		return [];
	}
}

/**
 * Gets suggested videos (random) from the database
 * @param currentVideoId - ID of the current video to exclude
 * @param limit - Number of videos to return (default: 8)
 * @returns Array of random YouTube videos
 */
export async function getSuggestedVideos(
	currentVideoId: string,
	limit: number = 8
): Promise<YouTubeVideo[]> {
	try {
		const filePath = path.join(
			process.cwd(),
			'public',
			'tellme_videohub_db_2025-07-18_171335.json'
		);
		const fileContents = fs.readFileSync(filePath, 'utf-8');
		const data = JSON.parse(fileContents);

		if (!data.videos || !Array.isArray(data.videos)) {
			return [];
		}

		// Filter public videos, exclude current video and shorts
		const candidates = data.videos
			.filter(
				(video: any) =>
					video.youtube_video_id &&
					video.status === 'public' &&
					!video.is_short &&
					video.youtube_video_id !== currentVideoId
			)
			.map((video: any) => {
				const videoId = video.youtube_video_id;
				const title = video.title || '';
				const slug = video.slug || generateSlug(title, videoId);

				return {
					id: videoId,
					title: title,
					description: video.description || '',
					thumbnail:
						video.thumbnail_url ||
						`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
					publishedAt:
						video.published_on ||
						video.last_modified ||
						new Date().toISOString(),
					channelName: 'Tellme360',
					slug: slug,
					recordingLocation: video.recording_location || undefined,
					isShort: false
				} as YouTubeVideo;
			});

		// Remove duplicates based on ID
		const uniqueCandidates = Array.from(
			new Map(candidates.map((v: any) => [v.id, v])).values()
		);

		// Shuffle and take limit
		const shuffled = uniqueCandidates.sort(() => 0.5 - Math.random());
		const suggested = shuffled.slice(0, limit);

		return suggested as YouTubeVideo[]; // Cast to ensure type compatibility
	} catch (error) {
		console.error('Error getting suggested videos:', error);
		return [];
	}
}

/**
 * Server-side function to generate a protected image URL with access token
 * This should be used in server components to generate secure URLs
 */
export async function getProtectedImageUrlServer(
	originalUrl: string
): Promise<string> {
	// If already a proxy URL, return as is
	if (originalUrl.includes('/api/images/proxy')) {
		return originalUrl;
	}

	// If already a signed URL, return as is
	if (
		originalUrl.includes('GoogleAccessId') ||
		originalUrl.includes('Expires')
	) {
		return originalUrl;
	}

	// Generate access token server-side
	const crypto = await import('crypto');
	const secret =
		process.env.IMAGE_PROXY_SECRET || 'default-secret-change-in-production';
	const expiresIn = 3600; // 1 hour
	const timestamp = Math.floor(Date.now() / 1000) + expiresIn;
	const data = `${originalUrl}|${timestamp}`;
	const hash = crypto.createHmac('sha256', secret).update(data).digest('hex');
	const token = `${timestamp}:${hash}`;

	// Encode the original URL and create proxy URL with token
	const encodedUrl = encodeURIComponent(originalUrl);
	return `/api/images/proxy?url=${encodedUrl}&token=${encodeURIComponent(token)}`;
}
