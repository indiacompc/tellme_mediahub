/**
 * Firebase Storage utilities for generating signed URLs
 * This allows private storage with time-limited access
 */

import { App, cert, getApps, initializeApp } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import fs from 'fs';
import path from 'path';

let firebaseApp: App | null = null;

/**
 * Initialize Firebase Admin SDK
 */
function initializeFirebaseAdmin(): App {
	if (firebaseApp) {
		return firebaseApp;
	}

	// Check if already initialized
	const existingApp = getApps()[0];
	if (existingApp) {
		firebaseApp = existingApp;
		return firebaseApp;
	}

	try {
		// Try to get service account key from environment
		const serviceAccountKeyPath =
			process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH ||
			path.join(process.cwd(), 'firebase-service-account.json');

		const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

		let serviceAccount;

		if (serviceAccountKey) {
			// Decode base64 if provided as env variable
			const decoded = Buffer.from(serviceAccountKey, 'base64').toString(
				'utf-8'
			);
			serviceAccount = JSON.parse(decoded);
		} else if (fs.existsSync(serviceAccountKeyPath)) {
			// Read from file
			const keyFile = fs.readFileSync(serviceAccountKeyPath, 'utf-8');
			serviceAccount = JSON.parse(keyFile);
		} else {
			throw new Error(
				'Firebase service account key not found. Please set FIREBASE_SERVICE_ACCOUNT_KEY_PATH or FIREBASE_SERVICE_ACCOUNT_KEY environment variable.'
			);
		}

		firebaseApp = initializeApp({
			credential: cert(serviceAccount),
			storageBucket: 'tellme360media.firebasestorage.app'
		});

		return firebaseApp;
	} catch (error) {
		console.error('Failed to initialize Firebase Admin:', error);
		throw error;
	}
}

/**
 * Generate a signed URL for a Firebase Storage file
 * @param filePath - Path to the file in Firebase Storage (e.g., "images/image.jpg")
 * @param expiresIn - Expiration time in seconds (default: 3600 = 1 hour)
 * @returns Signed URL that expires after the specified time
 */
export async function getSignedUrl(
	filePath: string,
	expiresIn: number = 3600
): Promise<string> {
	try {
		// Initialize Firebase Admin if not already done
		const app = initializeFirebaseAdmin();
		const bucket = getStorage(app).bucket();

		// Get file reference
		const file = bucket.file(filePath);

		// Check if file exists
		const [exists] = await file.exists();
		if (!exists) {
			throw new Error(`File not found: ${filePath}`);
		}

		// Generate signed URL
		const [url] = await file.getSignedUrl({
			action: 'read',
			expires: Date.now() + expiresIn * 1000
		});

		return url;
	} catch (error) {
		console.error('Error generating signed URL:', error);
		throw error;
	}
}

/**
 * Extract file path from Firebase Storage URL
 * @param firebaseUrl - Full Firebase Storage URL
 * @returns File path in bucket (e.g., "images/image.jpg")
 */
export function extractFilePathFromUrl(firebaseUrl: string): string {
	try {
		// Handle both storage.googleapis.com and firebasestorage.app URLs
		const url = new URL(firebaseUrl);

		// Format 1: https://storage.googleapis.com/tellme360media.firebasestorage.app/images/file.jpg
		// Format 2: https://storage.googleapis.com/bucket/o/path%2Fto%2Ffile.jpg?token=...
		// Format 3: https://firebasestorage.googleapis.com/v0/b/bucket/o/path%2Fto%2Ffile.jpg?token=...

		// Try to extract path after /o/ (for signed URLs or old format)
		let pathMatch = url.pathname.match(/\/o\/(.+?)(?:\?|$)/);
		if (pathMatch) {
			return decodeURIComponent(pathMatch[1]);
		}

		// For direct storage URLs: https://storage.googleapis.com/bucket/path/to/file.jpg
		// Extract everything after the bucket name
		if (url.hostname.includes('storage.googleapis.com')) {
			// Path format: /tellme360media.firebasestorage.app/images/file.jpg
			// or: /bucket-name/images/file.jpg
			const pathParts = url.pathname.split('/').filter((p) => p);

			// Find the bucket name (usually contains 'tellme360media' or 'firebasestorage')
			const bucketIndex = pathParts.findIndex(
				(p) => p.includes('tellme360media') || p.includes('firebasestorage')
			);

			if (bucketIndex >= 0 && bucketIndex < pathParts.length - 1) {
				// Return everything after the bucket name, decode URL encoding
				const filePath = pathParts.slice(bucketIndex + 1).join('/');
				return decodeURIComponent(filePath);
			}

			// If no bucket found, try to get path after first segment
			if (pathParts.length > 1) {
				return pathParts.slice(1).join('/');
			}
		}

		// Last resort: try to extract /images/... pattern directly from URL
		const imagesMatch = firebaseUrl.match(/\/images\/(.+?)(?:\?|$)/);
		if (imagesMatch) {
			return decodeURIComponent(imagesMatch[1]);
		}

		// If all else fails, return the filename from URL
		const lastPart = url.pathname.split('/').pop();
		if (lastPart && lastPart !== url.pathname) {
			return decodeURIComponent(lastPart);
		}

		// Final fallback: return the full pathname without leading slash
		return url.pathname.replace(/^\//, '').replace(/^[^\/]+\//, '');
	} catch (error) {
		console.error('Error extracting file path from URL:', error);
		// Fallback: try to extract from the URL string directly
		const match = firebaseUrl.match(/\/images\/(.+?)(?:\?|$)/);
		if (match) {
			return decodeURIComponent(match[1]);
		}
		return firebaseUrl;
	}
}

/**
 * Convert a Firebase Storage URL to a signed URL
 * @param firebaseUrl - Original Firebase Storage public URL
 * @param expiresIn - Expiration time in seconds (default: 3600 = 1 hour)
 * @returns Signed URL or original URL if conversion fails
 */
export async function convertToSignedUrl(
	firebaseUrl: string,
	expiresIn: number = 3600
): Promise<string> {
	// Only convert Firebase Storage URLs
	if (
		!firebaseUrl.includes('storage.googleapis.com') &&
		!firebaseUrl.includes('firebasestorage.app')
	) {
		return firebaseUrl;
	}

	try {
		const filePath = extractFilePathFromUrl(firebaseUrl);
		return await getSignedUrl(filePath, expiresIn);
	} catch (error) {
		console.error('Failed to convert to signed URL, using original:', error);
		// Return original URL if conversion fails (for backward compatibility)
		return firebaseUrl;
	}
}
