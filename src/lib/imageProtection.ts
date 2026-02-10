/**
 * Gets a protected image URL that goes through our proxy API
 * This prevents direct access to Firebase Storage URLs
 *
 * NOTE: This is a client-safe function. For server-side token generation,
 * use getProtectedImageUrlServer from server components.
 *
 * @param originalUrl - Original Firebase Storage URL
 * @returns Protected proxy URL (without token - token will be validated server-side via referrer)
 */
export function getProtectedImageUrl(originalUrl: string): string {
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

	// Encode the original URL and create proxy URL
	// Token will be validated server-side via referrer check
	const encodedUrl = encodeURIComponent(originalUrl);
	return `/api/images/proxy?url=${encodedUrl}`;
}

/**
 * Checks if a URL is from Firebase Storage
 */
export function isFirebaseStorageUrl(url: string): boolean {
	return (
		url.includes('storage.googleapis.com') ||
		url.includes('firebasestorage.app')
	);
}
