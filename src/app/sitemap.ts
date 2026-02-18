import { siteUrl } from '@/auth/ConfigManager';
import { getAllCategories, loadShortsFromJSON } from '@/lib/actions';
import type { ImageListing } from '@/types/image';
import fs from 'fs';
import { MetadataRoute } from 'next';
import path from 'path';

// Helper to get all videos from the database
async function getAllVideos(): Promise<Array<{ slug: string }>> {
	try {
		const filePath = path.join(
			process.cwd(),
			'public',
			'tellme_videohub_db_2025-07-18_171335.json'
		);
		if (!fs.existsSync(filePath)) {
			return [];
		}
		const fileContents = fs.readFileSync(filePath, 'utf-8');
		const data = JSON.parse(fileContents);

		if (!data.videos || !Array.isArray(data.videos)) {
			return [];
		}

		// Filter only public videos that are NOT shorts
		const videos = data.videos
			.filter(
				(video: any) =>
					video.youtube_video_id && video.status === 'public' && !video.is_short
			)
			.map((video: any) => {
				const title = video.title || '';
				const videoId = video.youtube_video_id;
				// Generate slug similar to how it's done in actions.ts
				let slug = video.slug;
				if (!slug) {
					slug = title
						.toLowerCase()
						.trim()
						.replace(/[^\w\s-]/g, '')
						.replace(/\s+/g, '-')
						.replace(/-+/g, '-')
						.replace(/^-+|-+$/g, '');
					const maxLength = 100;
					if (slug.length > maxLength) {
						slug = slug.substring(0, maxLength);
					}
					slug = `${slug}-${videoId}`;
				}
				return { slug };
			});

		// Remove duplicates
		const uniqueVideos = Array.from(
			new Map<string, { slug: string }>(videos.map((v: { slug: string }) => [v.slug, v])).values()
		);

		return uniqueVideos;
	} catch (error) {
		console.error('Error loading videos for sitemap:', error);
		return [];
	}
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl = siteUrl.replace(/\/$/, ''); // Remove trailing slash
	const currentDate = new Date().toISOString();

	// Static pages
	const staticPages: MetadataRoute.Sitemap = [
		{
			url: baseUrl,
			lastModified: currentDate,
			changeFrequency: 'daily',
			priority: 1.0
		},
		{
			url: `${baseUrl}/?filter=images`,
			lastModified: currentDate,
			changeFrequency: 'daily',
			priority: 0.9
		},
		{
			url: `${baseUrl}/?filter=videos`,
			lastModified: currentDate,
			changeFrequency: 'daily',
			priority: 0.9
		},
		{
			url: `${baseUrl}/?filter=shorts`,
			lastModified: currentDate,
			changeFrequency: 'daily',
			priority: 0.9
		},
		{
			url: `${baseUrl}/images`,
			lastModified: currentDate,
			changeFrequency: 'daily',
			priority: 0.9
		},
		{
			url: `${baseUrl}/about-us`,
			lastModified: currentDate,
			changeFrequency: 'monthly',
			priority: 0.7
		},
		{
			url: `${baseUrl}/contact`,
			lastModified: currentDate,
			changeFrequency: 'monthly',
			priority: 0.7
		},
		{
			url: `${baseUrl}/privacy-policy`,
			lastModified: currentDate,
			changeFrequency: 'yearly',
			priority: 0.5
		},
		{
			url: `${baseUrl}/terms-and-conditions`,
			lastModified: currentDate,
			changeFrequency: 'yearly',
			priority: 0.5
		}
	];

	// Get all videos
	const videos = await getAllVideos();
	const videoPages: MetadataRoute.Sitemap = videos.map((video) => ({
		url: `${baseUrl}/video/${encodeURIComponent(video.slug)}`,
		lastModified: currentDate,
		changeFrequency: 'weekly',
		priority: 0.8
	}));

	// Get all shorts
	let shorts: Array<{ slug: string }> = [];
	try {
		const shortsData = await loadShortsFromJSON();
		shorts = shortsData.map((short) => ({
			slug: short.slug
		}));
	} catch (error) {
		console.error('Error loading shorts for sitemap:', error);
	}

	const shortsPages: MetadataRoute.Sitemap = shorts.map((short) => ({
		url: `${baseUrl}/shorts/${encodeURIComponent(short.slug)}`,
		lastModified: currentDate,
		changeFrequency: 'weekly',
		priority: 0.8
	}));

	// Get all image categories
	let categories: Array<{ slug: string }> = [];
	try {
		const categoriesData = await getAllCategories();
		categories = categoriesData.map((cat) => ({
			slug: cat.slug
		}));
	} catch (error) {
		console.error('Error loading categories for sitemap:', error);
	}

	const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
		url: `${baseUrl}/images?filter=${encodeURIComponent(category.slug)}`,
		lastModified: currentDate,
		changeFrequency: 'weekly',
		priority: 0.8
	}));

	// Get all images
	let images: Array<{ slug: string; categorySlug?: string }> = [];
	try {
		const filePath = path.join(process.cwd(), 'public', 'image_listings.json');
		if (fs.existsSync(filePath)) {
			const fileContents = fs.readFileSync(filePath, 'utf-8');
			const allImages: ImageListing[] = JSON.parse(fileContents);
			if (Array.isArray(allImages)) {
				images = allImages
					.filter((img) => img.status === 'public')
					.map((img) => ({
						slug: img.slug,
						categorySlug: (img as any).category_slug
					}));
			}
		}
	} catch (error) {
		console.error('Error loading images for sitemap:', error);
	}

	const imagePages: MetadataRoute.Sitemap = images.map((image) => {
		const categoryParam = image.categorySlug
			? `?filter=${encodeURIComponent(image.categorySlug)}`
			: '';
		return {
			url: `${baseUrl}/images/detail/${encodeURIComponent(image.slug)}${categoryParam}`,
			lastModified: currentDate,
			changeFrequency: 'monthly',
			priority: 0.7
		};
	});

	// Combine all pages
	return [
		...staticPages,
		...videoPages,
		...shortsPages,
		...categoryPages,
		...imagePages
	];
}
