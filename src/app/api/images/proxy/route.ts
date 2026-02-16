import { convertToSignedUrl } from '@/lib/firebaseStorage';
import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Verify the access token
 */
function verifyAccessToken(imageUrl: string, token: string): boolean {
	try {
		const secret =
			process.env.IMAGE_PROXY_SECRET || 'default-secret-change-in-production';
		const [timestamp, hash] = token.split(':');

		if (!timestamp || !hash) return false;

		// Check if token is expired
		if (parseInt(timestamp) < Math.floor(Date.now() / 1000)) {
			return false;
		}

		// Verify hash
		const data = `${imageUrl}|${timestamp}`;
		const expectedHash = crypto
			.createHmac('sha256', secret)
			.update(data)
			.digest('hex');

		return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(expectedHash));
	} catch {
		return false;
	}
}

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const imageUrl = searchParams.get('url');
		const token = searchParams.get('token');

		const isDev = process.env.NODE_ENV === 'development';

		if (!imageUrl) {
			return NextResponse.json(
				{ error: 'Image URL is required' },
				{ status: 400 }
			);
		}

		// Security Context
		const referer = request.headers.get('referer') || '';
		const originHeader = request.headers.get('origin') || '';
		const hostHeader = request.headers.get('host') || '';
		const forwardedHost = request.headers.get('x-forwarded-host') || '';
		const currentHost = (forwardedHost || hostHeader).toLowerCase();

		// Verify Token (works everywhere)
		const hasValidToken = token
			? verifyAccessToken(imageUrl, token) ||
				verifyAccessToken(decodeURIComponent(imageUrl), token)
			: false;

		// Verify Origin (robust check for Vercel/Localhost/Production)
		const currentHostname = currentHost.split(':')[0];
		const refererLower = referer.toLowerCase();
		const originLower = originHeader.toLowerCase();

		const isSameOrigin =
			currentHostname.includes('localhost') ||
			currentHostname.includes('127.0.0.1') ||
			currentHostname.includes('vercel.app') ||
			currentHostname.includes('tellme360') ||
			// Allow tellme360.media as a trusted origin
			refererLower.includes('tellme360.media') ||
			originLower.includes('tellme360.media') ||
			(referer && refererLower.includes(currentHostname)) ||
			(originHeader && originLower.includes(currentHostname));

		// Permission logic:
		// ALWAYS require a Referer header — this blocks direct URL pasting in the browser.
		// Browsers always send Referer when loading <img> resources on a page,
		// but do NOT send Referer when you paste a URL directly in the address bar.
		// Additionally, require either a valid token or same-origin.
		const hasReferer = referer !== '';
		const isAllowed = hasReferer && (hasValidToken || isSameOrigin);

		if (!isAllowed) {
			console.warn('Image Proxy Blocked:', {
				currentHost,
				isDev,
				hasValidToken,
				isSameOrigin
			});
			return NextResponse.json(
				{
					error: 'Access denied.',
					debug: isDev
						? {
								currentHost,
								referer,
								hasValidToken,
								isSameOrigin,
								isDev
							}
						: undefined
				},
				{ status: 403 }
			);
		}

		// Try to convert to signed URL if it's a Firebase Storage URL
		// This ensures access even if the bucket is private
		let imageUrlToFetch = imageUrl;
		try {
			if (
				imageUrl.includes('storage.googleapis.com') ||
				imageUrl.includes('firebasestorage.app')
			) {
				// Try to get signed URL (will use original if Firebase Admin not configured)
				imageUrlToFetch = await convertToSignedUrl(imageUrl, 3600); // 1 hour expiration

				// Log for debugging (remove in production)
				if (process.env.NODE_ENV === 'development') {
					console.log('Generated signed URL for:', imageUrl.substring(0, 80));
				}
			}
		} catch (error) {
			console.error('Failed to generate signed URL:', error);
			// Continue with original URL - this will fail if bucket is private
			// but that's expected behavior
		}

		// Fetch the image from Firebase Storage (or signed URL)
		let imageResponse;
		try {
			imageResponse = await fetch(imageUrlToFetch, {
				headers: {
					'User-Agent': 'Mozilla/5.0 (compatible; Tellme360-Image-Proxy/1.0)'
				}
			});
		} catch (fetchError) {
			console.error(
				'[Image Proxy Fetch Error]:',
				fetchError,
				'URL:',
				imageUrlToFetch
			);
			return NextResponse.json(
				{
					error: 'Failed to connect to image source',
					details: isDev ? String(fetchError) : undefined
				},
				{ status: 502 }
			);
		}

		if (!imageResponse.ok) {
			console.error(
				'[Image Proxy Source Error]:',
				imageResponse.status,
				imageResponse.statusText,
				'URL:',
				imageUrlToFetch
			);
			return NextResponse.json(
				{ error: 'Image source returned error', status: imageResponse.status },
				{ status: imageResponse.status }
			);
		}

		// Get image data
		const imageBuffer = await imageResponse.arrayBuffer();
		const contentType =
			imageResponse.headers.get('content-type') || 'image/jpeg';

		// Return the image with appropriate headers
		// Note: For server-side compression, you would need to install 'sharp' package
		// For now, we return the original image but with aggressive caching
		return new NextResponse(imageBuffer, {
			status: 200,
			headers: {
				'Content-Type': contentType,
				// Aggressive caching to reduce bandwidth on repeat visits
				'Cache-Control':
					'public, max-age=31536000, s-maxage=31536000, immutable',
				'X-Content-Type-Options': 'nosniff',
				// Prevent direct linking
				'X-Frame-Options': 'SAMEORIGIN',
				// Add CORS headers to allow same-origin requests
				'Access-Control-Allow-Origin': originHeader || '*',
				'Access-Control-Allow-Methods': 'GET',
				'Access-Control-Allow-Headers': 'Content-Type',
				// Compression hint
				'Content-Encoding': 'identity',
				Vary: 'Accept-Encoding'
			}
		});
	} catch (error) {
		console.error('Image proxy error:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
