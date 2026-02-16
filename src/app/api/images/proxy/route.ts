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

		// ── Security Context ──
		const referer = request.headers.get('referer') || '';
		const originHeader = request.headers.get('origin') || '';
		const hostHeader = request.headers.get('host') || '';
		const forwardedHost = request.headers.get('x-forwarded-host') || '';
		const currentHost = (forwardedHost || hostHeader).toLowerCase();
		const currentHostname = currentHost.split(':')[0];
		const refererLower = referer.toLowerCase();
		const originLower = originHeader.toLowerCase();

		// ── Sec-Fetch headers (modern browsers) ──
		// Sec-Fetch-Dest: "document" = user typed/pasted URL in address bar
		//                 "image"    = <img> tag load
		//                 "empty"    = fetch() / XHR
		//                 ""         = server-side request (no browser)
		const secFetchDest = request.headers.get('sec-fetch-dest') || '';
		const secFetchSite = request.headers.get('sec-fetch-site') || '';

		// Block direct navigation (user pasting proxy URL in browser address bar)
		const isDirectNavigation = secFetchDest === 'document';
		if (isDirectNavigation) {
			console.warn('Image Proxy Blocked: Direct URL navigation attempt');
			return NextResponse.json(
				{ error: 'Direct access not allowed.' },
				{ status: 403 }
			);
		}

		// ── Token verification ──
		const hasValidToken = token
			? verifyAccessToken(imageUrl, token) ||
			verifyAccessToken(decodeURIComponent(imageUrl), token)
			: false;

		// ── Origin verification ──
		// Check if the request host is one of our trusted hosts
		const isTrustedHost =
			currentHostname.includes('localhost') ||
			currentHostname.includes('127.0.0.1') ||
			currentHostname.includes('vercel.app') ||
			currentHostname.includes('tellme360') ||
			currentHostname.includes('tellmemediahub');

		// Check if the request originates from our own pages (via Referer/Origin)
		const isFromOurPages =
			refererLower.includes('tellme360.media') ||
			refererLower.includes('tellmemediahub.com') ||
			originLower.includes('tellme360.media') ||
			originLower.includes('tellmemediahub.com') ||
			refererLower.includes('localhost') ||
			originLower.includes('localhost') ||
			refererLower.includes('vercel.app') ||
			originLower.includes('vercel.app') ||
			(referer && refererLower.includes(currentHostname)) ||
			(originHeader && originLower.includes(currentHostname));

		// Check if request is same-origin (browser sets this reliably)
		const isBrowserSameOrigin = secFetchSite === 'same-origin';

		// Server-side requests (SSR, Next.js image optimization) don't have
		// Sec-Fetch headers — they come from the Node.js server itself
		const isServerSideRequest = !secFetchDest && !secFetchSite;

		// ── Permission logic ──
		// Allow if ANY of these is true:
		// 1. Valid token (programmatic access)
		// 2. Browser same-origin request (Sec-Fetch-Site: same-origin)
		// 3. Referer/Origin from our own pages
		// 4. Server-side request on a trusted host (SSR / Next.js internal)
		// 5. Development mode on a trusted host
		const isAllowed =
			hasValidToken ||
			isBrowserSameOrigin ||
			isFromOurPages ||
			(isServerSideRequest && isTrustedHost) ||
			(isDev && isTrustedHost);

		if (!isAllowed) {
			console.warn('Image Proxy Blocked:', {
				currentHost,
				isDev,
				hasValidToken,
				isTrustedHost,
				isFromOurPages,
				isBrowserSameOrigin,
				isServerSideRequest,
				secFetchDest,
				secFetchSite
			});
			return NextResponse.json(
				{
					error: 'Access denied.',
					debug: isDev
						? {
							currentHost,
							referer: referer.substring(0, 100),
							origin: originHeader,
							secFetchDest,
							secFetchSite,
							hasValidToken,
							isTrustedHost,
							isFromOurPages,
							isBrowserSameOrigin,
							isServerSideRequest
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
