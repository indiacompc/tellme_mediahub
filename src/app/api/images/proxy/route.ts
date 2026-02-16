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

		// ── Security: Require Referer from our own domains ──
		// This is the most reliable way to block direct URL access:
		// - Browser <img> tags ALWAYS send Referer (same-origin request)
		// - Pasting URL in address bar NEVER sends Referer
		// - Works on ALL platforms (localhost, Vercel, custom domains)
		// - No CDN or proxy strips the Referer header
		const referer = request.headers.get('referer') || '';
		const originHeader = request.headers.get('origin') || '';
		const hostHeader = request.headers.get('host') || '';
		const forwardedHost = request.headers.get('x-forwarded-host') || '';
		const currentHost = (forwardedHost || hostHeader).toLowerCase();
		const currentHostname = currentHost.split(':')[0];
		const refererLower = referer.toLowerCase();

		const hasReferer = referer !== '';

		// Verify referer comes from one of our trusted origins
		const isFromTrustedOrigin =
			refererLower.includes('localhost') ||
			refererLower.includes('127.0.0.1') ||
			refererLower.includes('tellme360.media') ||
			refererLower.includes('tellmemediahub.com') ||
			refererLower.includes('vercel.app') ||
			refererLower.includes(currentHostname);

		// BLOCK if: no Referer OR Referer is not from our trusted origins
		if (!hasReferer || !isFromTrustedOrigin) {
			console.warn('Image Proxy Blocked:', {
				reason: !hasReferer ? 'No Referer header (direct URL access)' : 'Referer not from trusted origin',
				referer: referer.substring(0, 100) || '(empty)',
				currentHost
			});
			return NextResponse.json(
				{
					error: 'Access denied.',
					debug: isDev
						? {
							reason: !hasReferer
								? 'No Referer header — direct URL access is not allowed'
								: 'Referer is not from a trusted origin',
							referer: referer.substring(0, 100) || '(empty)',
							currentHost,
							currentHostname
						}
						: undefined
				},
				{ status: 403 }
			);
		}

		// ── Fetch and serve the image ──

		// Try to convert to signed URL if it's a Firebase Storage URL
		let imageUrlToFetch = imageUrl;
		try {
			if (
				imageUrl.includes('storage.googleapis.com') ||
				imageUrl.includes('firebasestorage.app')
			) {
				imageUrlToFetch = await convertToSignedUrl(imageUrl, 3600);

				if (isDev) {
					console.log('Generated signed URL for:', imageUrl.substring(0, 80));
				}
			}
		} catch (error) {
			console.error('Failed to generate signed URL:', error);
		}

		// Fetch the image
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
		return new NextResponse(imageBuffer, {
			status: 200,
			headers: {
				'Content-Type': contentType,
				// Cache for 1 day (not immutable, so security updates take effect)
				'Cache-Control': 'public, max-age=86400, s-maxage=86400',
				'X-Content-Type-Options': 'nosniff',
				'X-Frame-Options': 'SAMEORIGIN',
				'Access-Control-Allow-Origin': originHeader || '*',
				'Access-Control-Allow-Methods': 'GET',
				'Access-Control-Allow-Headers': 'Content-Type',
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
