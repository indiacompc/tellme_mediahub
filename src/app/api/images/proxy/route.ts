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

		// ── Security: Multi-layer protection ──
		// Layer 1: Token validation (if provided) - must be valid if present
		// Layer 2: Referer validation - ALWAYS required to block direct URL access
		// Both layers must pass for access to be granted

		const referer = request.headers.get('referer') || '';
		const originHeader = request.headers.get('origin') || '';
		const hostHeader = request.headers.get('host') || '';
		const forwardedHost = request.headers.get('x-forwarded-host') || '';
		const currentHost = (forwardedHost || hostHeader).toLowerCase();
		const currentHostname = currentHost.split(':')[0];

		// Validate token if provided (must be valid if present)
		if (token) {
			const isValidToken = verifyAccessToken(imageUrl, token);
			if (!isValidToken) {
				console.warn('Image Proxy Blocked: Invalid token', {
					imageUrl: imageUrl.substring(0, 80),
					hasToken: !!token
				});
				return NextResponse.json(
					{
						error: 'Access denied.',
						debug: isDev ? { reason: 'Invalid or expired token' } : undefined
					},
					{ status: 403 }
				);
			}
		}

		// ALWAYS require referer validation (even if token is valid)
		// This prevents direct URL access even with a valid token
		const hasReferer = referer !== '';

		// Parse referer URL to check its path and hostname
		let refererPath = '';
		let refererHostname = '';
		try {
			if (referer) {
				const refererUrl = new URL(referer);
				refererPath = refererUrl.pathname.toLowerCase();
				refererHostname = refererUrl.hostname.toLowerCase();
			}
		} catch {
			// Invalid referer URL format - treat as no referer
		}

		// Verify referer comes from one of our trusted origins
		const isFromTrustedOrigin =
			refererHostname.includes('localhost') ||
			refererHostname.includes('127.0.0.1') ||
			refererHostname.includes('tellme360.media') ||
			refererHostname.includes('tellmemediahub.com') ||
			refererHostname.includes('vercel.app') ||
			refererHostname === currentHostname;

		// CRITICAL: Block if referer is the proxy API route itself
		const isRefererProxyRoute = refererPath.includes('/api/images/proxy');

		// CRITICAL: Block if referer is any API route
		const isRefererApiRoute = refererPath.startsWith('/api/');

		// CRITICAL: Require referer to be from a valid page path
		// Allow root path '/' (home page where category thumbnails are displayed)
		// Also allow specific page paths where images are displayed
		// Note: Direct URL access typically has NO referer, so empty referer is still blocked
		const isRefererValidPage =
			refererPath !== '' &&
			(refererPath === '/' ||
				refererPath.startsWith('/images') ||
				refererPath.startsWith('/shorts') ||
				refererPath.startsWith('/video') ||
				refererPath.startsWith('/about') ||
				refererPath.startsWith('/contact') ||
				refererPath.startsWith('/privacy'));

		// BLOCK if:
		// 1. No Referer header (direct URL access in address bar)
		// 2. Referer is not from trusted origin
		// 3. Referer is the proxy route itself
		// 4. Referer is any API route
		// 5. Referer path is not a valid page path
		if (
			!hasReferer ||
			!isFromTrustedOrigin ||
			isRefererProxyRoute ||
			isRefererApiRoute ||
			!isRefererValidPage
		) {
			console.warn('Image Proxy Blocked:', {
				reason: !hasReferer
					? 'No Referer header (direct URL access)'
					: !isFromTrustedOrigin
						? 'Referer not from trusted origin'
						: isRefererProxyRoute
							? 'Referer is proxy route itself (direct access)'
							: isRefererApiRoute
								? 'Referer is API route'
								: 'Referer is not from a valid page path',
				referer: referer.substring(0, 100) || '(empty)',
				refererPath,
				refererHostname,
				currentHost,
				hasToken: !!token
			});
			return NextResponse.json(
				{
					error: 'Access denied.',
					debug: isDev
						? {
								reason: !hasReferer
									? 'No Referer header — direct URL access is not allowed'
									: !isFromTrustedOrigin
										? 'Referer is not from a trusted origin'
										: isRefererProxyRoute
											? 'Referer is the proxy route itself — direct access blocked'
											: isRefererApiRoute
												? 'Referer is an API route — only page requests allowed'
												: 'Referer is not from a valid page path — must be from an actual page',
								referer: referer.substring(0, 100) || '(empty)',
								refererPath,
								refererHostname,
								currentHost,
								currentHostname,
								hasToken: !!token
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
