import { siteUrl } from '@/auth/ConfigManager';
import ImageDetailsFull from '@/components/image-details-full';
import ImageWithLoading from '@/components/ImageWithLoading';
import ProtectedImageWrapper from '@/components/ProtectedImageWrapper';
import RecommendedImages from '@/components/RecommendedImages';
import {
	getImageBySlug,
	getProtectedImageUrlServer,
	getSuggestedImages
} from '@/lib/actions';
import { convertToSignedUrl } from '@/lib/firebaseStorage';
import { isFirebaseStorageUrl } from '@/lib/imageProtection';
import { ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { ImageObject, WithContext } from 'schema-dts';
import PanoramaImageLoader from './PanoramaImageLoader';

type ParamsType = {
	params: Promise<{
		slug: string;
	}>;
	searchParams: Promise<{
		filter?: string;
	}>;
};

export async function generateMetadata({
	params
}: ParamsType): Promise<Metadata> {
	const { slug } = await params;
	const image = await getImageBySlug(decodeURIComponent(slug));

	if (!image) {
		return {
			title: 'Image Not Found'
		};
	}

	// Generate signed URL for metadata (social media crawlers need accessible URLs)
	// Signed URLs are time-limited (24 hours) and work without referer checks
	// This allows social media crawlers to access preview images while still providing security
	const metaImageUrl = isFirebaseStorageUrl(image.src)
		? await convertToSignedUrl(image.src, 86400) // 24 hours expiry for metadata
		: image.src;

	const baseUrl = siteUrl.replace(/\/$/, '');
	const categorySlug = (image as any).category_slug;
	const categoryParam = categorySlug
		? `?filter=${encodeURIComponent(categorySlug)}`
		: '';
	const canonicalUrl = `${baseUrl}/images/detail/${encodeURIComponent(image.slug)}${categoryParam}`;

	// Build location string for structured data
	const locationParts = [];
	if (image.captured_location) locationParts.push(image.captured_location);
	if (image.city) locationParts.push(image.city);
	if (image.state) locationParts.push(image.state);
	const fullLocation = locationParts.join(', ');

	return {
		title: image.meta_title || image.title,
		description: image.meta_description || image.description,
		keywords: image.meta_keywords || undefined,
		alternates: {
			canonical: canonicalUrl
		},
		openGraph: {
			title: image.meta_title || image.title,
			description: image.meta_description || image.description,
			images: [metaImageUrl],
			type: 'website',
			url: canonicalUrl,
			siteName: 'Tellme Media'
		},
		twitter: {
			card: 'summary_large_image',
			title: image.meta_title || image.title,
			description: image.meta_description || image.description,
			images: [metaImageUrl]
		},
		...(image.state || fullLocation || (image.latitude && image.longitude)
			? {
				other: {
					...(image.state && { 'geo.region': image.state }),
					...(fullLocation && { 'geo.placename': fullLocation }),
					...(image.latitude &&
						image.longitude && {
						'geo.position': `${image.latitude};${image.longitude}`
					})
				}
			}
			: {})
	};
}

export default async function ImageDetailPage({
	params,
	searchParams
}: ParamsType) {
	const { slug } = await params;
	const { filter } = await searchParams;
	const image = await getImageBySlug(decodeURIComponent(slug));

	if (!image) {
		notFound();
	}

	// Get suggested images (from same category if available)
	const categorySlug = (image as any).category_slug;

	// Determine back button destination
	// Use filter from URL if available, otherwise use image's category_slug
	const categoryFilter = filter || categorySlug;
	const backHref = categoryFilter
		? `/images?filter=${categoryFilter}`
		: '/?filter=images';
	const backText = categoryFilter ? 'Back to Category' : 'Back to Images';
	const suggestedImages = await getSuggestedImages(image.id, categorySlug, 8);

	// Generate protected URL server-side with token
	const protectedImageUrl = isFirebaseStorageUrl(image.src)
		? await getProtectedImageUrlServer(image.src)
		: image.src;

	// Generate structured data for SEO
	const baseUrl = siteUrl.replace(/\/$/, '');
	const categorySlugForStructured = (image as any).category_slug;
	const categoryParamForStructured = categorySlugForStructured
		? `?filter=${encodeURIComponent(categorySlugForStructured)}`
		: '';
	const imageUrl = `${baseUrl}/images/detail/${encodeURIComponent(image.slug)}${categoryParamForStructured}`;

	// Build location string
	const locationParts = [];
	if (image.captured_location) locationParts.push(image.captured_location);
	if (image.city) locationParts.push(image.city);
	if (image.state) locationParts.push(image.state);
	const fullLocation = locationParts.join(', ');

	// Generate signed URL for structured data image
	const structuredDataImageUrl = isFirebaseStorageUrl(image.src)
		? await convertToSignedUrl(image.src, 86400)
		: image.src;

	const imageStructuredData: WithContext<ImageObject> = {
		'@context': 'https://schema.org',
		'@type': 'ImageObject',
		name: image.meta_title || image.title,
		description: image.meta_description || image.description,
		image: structuredDataImageUrl,
		url: imageUrl,
		width: {
			'@type': 'QuantitativeValue',
			value: image.width,
			unitCode: 'E37'
		},
		height: {
			'@type': 'QuantitativeValue',
			value: image.height,
			unitCode: 'E37'
		},
		contentUrl: structuredDataImageUrl,
		encodingFormat: 'image/jpeg',
		keywords: image.meta_keywords || undefined,
		...(fullLocation && {
			contentLocation: {
				'@type': 'Place',
				name: fullLocation
			}
		}),
		...(image.captured_date && {
			dateCreated: image.captured_date
		}),
		...(image.latitude &&
			image.longitude && {
			geo: {
				'@type': 'GeoCoordinates',
				latitude: image.latitude,
				longitude: image.longitude
			}
		}),
		copyrightHolder: {
			'@type': 'Organization',
			name: 'Tellme Digiinfotech Private Limited'
		},
		license: `${baseUrl}/terms-and-conditions`,
		creator: {
			'@type': 'Organization',
			name: 'Tellme Digiinfotech Private Limited'
		}
	};

	return (
		<div className='mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 md:px-8 lg:px-10 lg:py-10 xl:max-w-6xl 2xl:max-w-7xl'>
			{/* Back Button */}
			<div className='mb-6 sm:mb-8'>
				<Link
					href={backHref}
					className='text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors sm:text-base'
				>
					<ArrowLeft className='h-4 w-4 sm:h-5 sm:w-5' />
					{backText}
				</Link>
			</div>

			<div className='lg:grid lg:grid-cols-1'>
				<div>
					{/* Image Display */}
					<div className='mb-6 flex h-[40dvh] w-full items-center justify-center overflow-hidden rounded-lg bg-transparent sm:mb-8 lg:mb-10 lg:h-[60dvh]'>
						<ProtectedImageWrapper>
							<div className='relative flex h-full w-full items-center justify-center'>
								{image.is_vr_pano ? (
									<PanoramaImageLoader
										imageListingData={image}
										src={protectedImageUrl}
									/>
								) : (
									<ImageWithLoading
										src={protectedImageUrl}
										alt={image.meta_title || image.title}
										width={image.width}
										height={image.height}
										className='h-full w-full object-contain'
										style={{
											aspectRatio: `${image.width} / ${image.height}`
										}}
										sizes={
											image.width > image.height
												? '(max-width: 640px) 100vw, (max-width: 768px) 75vw, 66vw'
												: '(max-width: 640px) 80vw, (max-width: 768px) 50vw, 40vw'
										}
										priority
										unoptimized
									/>
								)}
							</div>
						</ProtectedImageWrapper>
					</div>

					{/* Full Image Details */}
					<ImageDetailsFull image={image} />
				</div>
			</div>

			{/* Recommended Images */}
			<RecommendedImages
				images={suggestedImages}
				currentCategorySlug={categoryFilter}
			/>

			{/* Structured Data for SEO */}
			<script
				id='imageStructuredData'
				type='application/ld+json'
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(imageStructuredData)
				}}
			/>
		</div>
	);
}
