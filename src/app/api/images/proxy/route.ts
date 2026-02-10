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

		if (!imageUrl) {
			return NextResponse.json(
				{ error: 'Image URL is required' },
				{ status: 400 }
			);
		}

		// Decode the URL
		const decodedUrl = decodeURIComponent(imageUrl);

		// Validate that it's a Firebase Storage URL
		if (
			!decodedUrl.includes('storage.googleapis.com') &&
			!decodedUrl.includes('firebasestorage.app')
		) {
			return NextResponse.json(
				{
					error: 'Invalid image source. Only Firebase Storage URLs are allowed.'
				},
				{ status: 400 }
			);
		}

		// Check referrer AND token for security
		const referer = request.headers.get('referer');
		const origin = request.headers.get('origin');
		const host = request.headers.get('host') || '';

		// Check if request comes from same origin
		const isSameOrigin =
			referer?.includes(host) ||
			origin?.includes(host) ||
			referer?.includes('localhost') ||
			origin?.includes('localhost');

		// Verify token if provided
		const hasValidToken = token ? verifyAccessToken(decodedUrl, token) : false;

		// Allow access if:
		// 1. Valid token is provided (works even without referrer - for Next.js Image component)
		// 2. Same origin request with referrer (from your website)
		// 3. Development mode ONLY if same origin (for testing)
		const isAllowed =
			hasValidToken ||
			(isSameOrigin && (referer || origin)) || // Must have referrer or origin
			(process.env.NODE_ENV === 'development' && isSameOrigin && referer); // Dev mode still requires referrer

		if (!isAllowed) {
			// Log the attempt for monitoring
			console.warn('Blocked direct image access attempt:', {
				referer,
				origin,
				hasToken: !!token,
				url: decodedUrl.substring(0, 100)
			});
			return NextResponse.json(
				{
					error:
						'Access denied. Images can only be accessed through the website.',
					message:
						'Please visit the image page on our website to view this image.'
				},
				{ status: 403 }
			);
		}

		// Try to convert to signed URL if it's a Firebase Storage URL
		// This ensures access even if the bucket is private
		let imageUrlToFetch = decodedUrl;
		try {
			if (
				decodedUrl.includes('storage.googleapis.com') ||
				decodedUrl.includes('firebasestorage.app')
			) {
				// Try to get signed URL (will use original if Firebase Admin not configured)
				imageUrlToFetch = await convertToSignedUrl(decodedUrl, 3600); // 1 hour expiration

				// Log for debugging (remove in production)
				if (process.env.NODE_ENV === 'development') {
					console.log('Generated signed URL for:', decodedUrl.substring(0, 80));
				}
			}
		} catch (error) {
			console.error('Failed to generate signed URL:', error);
			// Continue with original URL - this will fail if bucket is private
			// but that's expected behavior
		}

		// Fetch the image from Firebase Storage (or signed URL)
		const imageResponse = await fetch(imageUrlToFetch, {
			headers: {
				'User-Agent': 'Mozilla/5.0 (compatible; Tellme360-Image-Proxy/1.0)'
			}
		});

		if (!imageResponse.ok) {
			return NextResponse.json(
				{ error: 'Failed to fetch image' },
				{ status: imageResponse.status }
			);
		}

		// Get image data
		const imageBuffer = await imageResponse.arrayBuffer();
		const contentType =
			imageResponse.headers.get('content-type') || 'image/jpeg';

		// Check if quality parameter is requested (for bandwidth optimization)
		const qualityParam = searchParams.get('q');
		const requestedQuality = qualityParam ? parseInt(qualityParam) : null;

		// Return the image with appropriate headers
		// Note: For server-side compression, you would need to install 'sharp' package
		// For now, we return the original image but with aggressive caching
		return new NextResponse(imageBuffer, {
			status: 200,
			headers: {
				'Content-Type': contentType,
				// Aggressive caching to reduce bandwidth on repeat visits
				'Cache-Control': 'public, max-age=31536000, s-maxage=31536000, immutable',
				'X-Content-Type-Options': 'nosniff',
				// Prevent direct linking
				'X-Frame-Options': 'SAMEORIGIN',
				// Add CORS headers to allow same-origin requests
				'Access-Control-Allow-Origin': origin || '*',
				'Access-Control-Allow-Methods': 'GET',
				'Access-Control-Allow-Headers': 'Content-Type',
				// Compression hint
				'Content-Encoding': 'identity',
				'Vary': 'Accept-Encoding'
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
