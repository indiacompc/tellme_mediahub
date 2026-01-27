/**
 * Gets YouTube thumbnail URL with fallback options
 * YouTube thumbnails have different sizes, not all videos have all sizes
 * Order: maxresdefault -> hqdefault -> mqdefault -> default
 */
export function getYouTubeThumbnail(
	videoId: string,
	preferredSize:
		| 'maxresdefault'
		| 'hqdefault'
		| 'mqdefault'
		| 'default' = 'hqdefault'
): string {
	// Use hqdefault as default since it's more reliable than maxresdefault
	const size = preferredSize || 'hqdefault';
	return `https://img.youtube.com/vi/${videoId}/${size}.jpg`;
}

/**
 * Gets an array of thumbnail URLs in order of preference (fallback chain)
 */
export function getYouTubeThumbnailFallbacks(videoId: string): string[] {
	return [
		`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
		`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
		`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
		`https://img.youtube.com/vi/${videoId}/default.jpg`
	];
}
