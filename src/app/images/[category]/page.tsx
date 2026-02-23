import { siteUrl } from '@/auth/ConfigManager';
import {
	getAllCategories,
	getImagesByCategorySlug,
	searchImagesInDatabase
} from '@/lib/actions';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import type { CollectionPage, WithContext } from 'schema-dts';
import MasonryLayout from './MasonryLayout';

type PhotoCategoryPageProps = {
	params: Promise<{ category: string }>;
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// Reduced limit to minimize bandwidth usage
const limit = 8;

const normalizeSlug = (slug: string) =>
	slug
		?.toString()
		.toLowerCase()
		.trim()
		.replace(/\s+/g, '-');

const matchesSearchTerm = (image: any, term: string) => {
	const searchTerm = term.toLowerCase();
	return (
		(image.title || '').toLowerCase().includes(searchTerm) ||
		(image.description || '').toLowerCase().includes(searchTerm) ||
		(image.image_category_id || '').toLowerCase().includes(searchTerm) ||
		(image.city || '').toLowerCase().includes(searchTerm) ||
		(image.state || '').toLowerCase().includes(searchTerm) ||
		(image.captured_location || '').toLowerCase().includes(searchTerm)
	);
};

export async function generateMetadata({
	params,
	searchParams
}: PhotoCategoryPageProps): Promise<Metadata> {
	const paramsAwaited = await params;
	const searchParamsAwaited = await searchParams;

	const page = searchParamsAwaited.page
		? Array.isArray(searchParamsAwaited.page)
			? searchParamsAwaited.page[0]
			: searchParamsAwaited.page
		: undefined;

	const pageNumber = page ? Number.parseInt(page) : 1;

	// Get category info
	const categories = await getAllCategories();
	const category = categories.find(
		(cat) => cat.slug === paramsAwaited.category
	);

	if (!category) {
		notFound();
	}

	const { siteUrl } = await import('@/auth/ConfigManager');
	const baseUrl = siteUrl.replace(/\/$/, '');
	const categoryUrl = `${baseUrl}/images?filter=${encodeURIComponent(category.slug)}`;
	const title = `${category.name}${pageNumber > 1 ? ` | Page ${pageNumber}` : ''}`;
	const description = `Browse our collection of ${category.name} images. High-quality stock photos and images available for licensing.`;
	const keywords = `${category.name}, images, stock photos, ${category.name} photography, ${category.name} pictures`;

	return {
		title,
		description,
		keywords,
		alternates: {
			canonical:
				pageNumber > 1 ? `${categoryUrl}&page=${pageNumber}` : categoryUrl
		},
		openGraph: {
			title,
			description,
			type: 'website',
			url: pageNumber > 1 ? `${categoryUrl}&page=${pageNumber}` : categoryUrl,
			siteName: 'Tellme Media'
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description
		},
		robots: {
			index: true,
			follow: true
		}
	};
}

const PhotoCategoryPage = async ({
	params,
	searchParams
}: PhotoCategoryPageProps) => {
	const [paramsAwaited, searchParamsAwaited] = await Promise.all([
		params,
		searchParams
	]);

	const page = searchParamsAwaited.page
		? Array.isArray(searchParamsAwaited.page)
			? searchParamsAwaited.page[0]
			: searchParamsAwaited.page
		: undefined;

	const pageNumber = page ? Number.parseInt(page) : 1;

	// Get category info
	const categories = await getAllCategories();
	const category = categories.find(
		(cat) => cat.slug === paramsAwaited.category
	);

	if (!category) {
		notFound();
	}

	// Get images for this category (only first 10 initially)
	const skip = (pageNumber - 1) * limit;
	const searchTerm = searchParamsAwaited.q
		? Array.isArray(searchParamsAwaited.q)
			? searchParamsAwaited.q[0]
			: searchParamsAwaited.q
		: '';

	let imageListingsData = [] as any[];
	let total_images = 0;

	if (searchTerm.trim()) {
		// When arriving from search, try to use the search subset for this category
		const searchResults = await searchImagesInDatabase(searchTerm);
		const targetSlug = normalizeSlug(paramsAwaited.category);
		const match = searchResults.find((cat) => {
			const catSlug = normalizeSlug(cat.categorySlug || '');
			const catId = normalizeSlug(cat.categoryId || '');
			const catName = normalizeSlug(cat.categoryName || '');
			return catSlug === targetSlug || catId === targetSlug || catName === targetSlug;
		});

		const matchedImages = match?.images ?? [];
		const filteredMatchedImages = matchedImages.filter((img) =>
			matchesSearchTerm(img, searchTerm)
		);

		if (filteredMatchedImages.length > 0) {
			imageListingsData = filteredMatchedImages;
			total_images = imageListingsData.length;
		} else {
			// Fallback: load category images and filter by search term
			const { images: catImages } = await getImagesByCategorySlug(
				paramsAwaited.category,
				500,
				0
			);
			imageListingsData = catImages.filter((img) => matchesSearchTerm(img, searchTerm));
			total_images = imageListingsData.length;
		}
	} else {
		const result = await getImagesByCategorySlug(
			paramsAwaited.category,
			limit,
			skip
		);
		imageListingsData = result.images;
		total_images = result.total;
	}

	// Generate structured data for category page
	const baseUrl = siteUrl.replace(/\/$/, '');
	const categoryUrl = `${baseUrl}/images?filter=${encodeURIComponent(category.slug)}`;

	const collectionStructuredData: WithContext<CollectionPage> = {
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		name: category.name,
		description: `Browse our collection of ${category.name} images. High-quality stock photos and images available for licensing.`,
		url: pageNumber > 1 ? `${categoryUrl}&page=${pageNumber}` : categoryUrl,
		mainEntity: {
			'@type': 'ItemList',
			numberOfItems: total_images,
			itemListElement: imageListingsData.slice(0, 10).map((image, index) => ({
				'@type': 'ListItem',
				position: skip + index + 1,
				item: {
					'@type': 'ImageObject',
					name: (image as any).meta_title || image.title,
					url: `${baseUrl}/images/detail/${encodeURIComponent(image.slug)}${category.slug ? `?filter=${encodeURIComponent(category.slug)}` : ''}`
				}
			}))
		},
		breadcrumb: {
			'@type': 'BreadcrumbList',
			itemListElement: [
				{
					'@type': 'ListItem',
					position: 1,
					name: 'Home',
					item: baseUrl
				},
				{
					'@type': 'ListItem',
					position: 2,
					name: 'Images',
					item: `${baseUrl}/images`
				},
				{
					'@type': 'ListItem',
					position: 3,
					name: category.name,
					item: categoryUrl
				}
			]
		}
	};

	return (
		<main className='min-h-screen'>
			<div className='relative container mx-auto px-4 py-4 sm:px-6 sm:py-8 lg:px-8'>
				<div className='mb-4 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between'></div>

				<Suspense>
				<MasonryLayout
					images={imageListingsData}
					categorySlug={paramsAwaited.category}
					pageNumber={pageNumber}
					totalPages={
						searchTerm.trim()
							? Math.max(1, Math.ceil(imageListingsData.length / limit))
							: Math.ceil(total_images / limit)
					}
					limit={limit}
					searchQuery={searchTerm.trim() ? searchTerm : undefined}
				/>
				</Suspense>
			</div>

			{/* Structured Data for SEO */}
			<script
				id='collectionStructuredData'
				type='application/ld+json'
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(collectionStructuredData)
				}}
			/>
		</main>
	);
};

export default PhotoCategoryPage;
