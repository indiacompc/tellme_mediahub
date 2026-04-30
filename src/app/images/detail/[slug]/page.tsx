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
import type { FAQPage, ImageObject, WithContext } from 'schema-dts';
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
	// Canonical must always be the clean URL without any ?filter= query param.
	// All filter variants (?filter=monuments, ?filter=black-and-white, etc.) are
	// duplicate views of the same image — consolidating to the clean URL prevents
	// link-equity splitting and avoids Google treating each filter as a unique page.
	const canonicalUrl = `${baseUrl}/images/detail/${encodeURIComponent(image.slug)}`;

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
			: {}),
		// Prevent Google from treating this as time-sensitive news content.
		// The slug may contain a date suffix (e.g. -10072025) but this is a
		// stock image page, not a news article — noarchive is not needed here,
		// but we explicitly omit datePublished/dateModified from metadata so
		// Google's news crawler has no date signal to latch on to.
		robots: {
			index: true,
			follow: true,
			'max-snippet': -1,
			'max-image-preview': 'large',
			'max-video-preview': -1
		}
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
	// Structured data URL must match the canonical — clean URL without filter param.
	const imageUrl = `${baseUrl}/images/detail/${encodeURIComponent(image.slug)}`;

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

	// Derive MIME type from the actual image URL so it is never wrong for
	// PNG, WebP, or VR panorama sources (not hardcoded to image/jpeg).
	const deriveEncodingFormat = (url: string): string => {
		const ext = url.split('?')[0].split('.').pop()?.toLowerCase();
		const mimeMap: Record<string, string> = {
			jpg: 'image/jpeg',
			jpeg: 'image/jpeg',
			png: 'image/png',
			webp: 'image/webp',
			gif: 'image/gif',
			avif: 'image/avif',
			svg: 'image/svg+xml'
		};
		return mimeMap[ext ?? ''] || 'image/jpeg';
	};

	// acquireLicensePage: the page where users initiate a purchase/license
	// request. Google specifically requires this for Image Search commerce
	// badges ("License" button in image results).
	// Use .trim() to guard against any category label concatenated to the
	// title in the source data (e.g. "Arched Frame of Charminar CourtyardGuide").
	const cleanImageTitle = (image.meta_title || image.title).trim();
	const acquireLicensePageUrl =
		`${baseUrl}/contact` +
		`?type=licensing` +
		`&imageName=${encodeURIComponent(cleanImageTitle)}` +
		`&imageId=${image.id}` +
		`&subject=${encodeURIComponent(`Licensing inquiry: ${cleanImageTitle}`)}`;

	// creditText is the attribution string Google surfaces when the image
	// is reused. Format: "© Year Organization" is the widely accepted standard.
	const currentYear = new Date().getFullYear();
	const creditText = `© ${currentYear} Tellme Digiinfotech Private Limited`;

	// copyrightYear: year the image was first created/captured.
	const copyrightYear = image.captured_date
		? new Date(image.captured_date).getFullYear()
		: currentYear;

	// FAQ structured data — built only when the image has curated geo_faq
	// entries. Each Q&A becomes a Question node so Google can render FAQ rich
	// results and AI engines can extract clean answer pairs.
	const faqStructuredData: WithContext<FAQPage> | null =
		image.geo_faq && image.geo_faq.length > 0
			? {
				'@context': 'https://schema.org',
				'@type': 'FAQPage',
				'@id': `${imageUrl}#faq`,
				mainEntity: image.geo_faq.map((qa) => ({
					'@type': 'Question',
					name: qa.question,
					acceptedAnswer: {
						'@type': 'Answer',
						text: qa.answer
					}
				}))
			}
			: null;

	const imageStructuredData: WithContext<ImageObject> = {
		'@context': 'https://schema.org',
		'@type': 'ImageObject',

		// ── Identity ────────────────────────────────────────────────────────
		// @id makes this node referenceable from other schema graphs on the page.
		'@id': imageUrl,

		name: image.meta_title || image.title,
		description: image.meta_description || image.description,
		inLanguage: 'en',

		// ── Image source ────────────────────────────────────────────────────
		// contentUrl: the raw image file URL — the primary field Google indexes.
		// image:      the page URL displaying the image (same as url here).
		// thumbnail:  smaller preview; Google uses it for search result cards.
		contentUrl: structuredDataImageUrl,
		url: imageUrl,
		image: structuredDataImageUrl,
		thumbnail: {
			'@type': 'ImageObject',
			url: structuredDataImageUrl
		},
		// representativeOfPage: true tells Google this ImageObject is the
		// primary/hero image of the page — enables richer image indexing.
		representativeOfPage: true,

		// ── Dimensions & format ─────────────────────────────────────────────
		width: {
			'@type': 'QuantitativeValue',
			value: image.width,
			unitCode: 'E37' // pixel
		},
		height: {
			'@type': 'QuantitativeValue',
			value: image.height,
			unitCode: 'E37'
		},
		encodingFormat: deriveEncodingFormat(structuredDataImageUrl),

		// ── Authorship & rights ─────────────────────────────────────────────
		// author:          who created the image (required for attribution badges).
		// creator:         alias for author; kept for broader compatibility.
		// publisher:       who distributes/publishes it (the platform).
		// copyrightHolder: legal rights owner.
		// copyrightNotice: full human-readable copyright statement.
		// creditText:      short attribution Google surfaces in image reuse panels.
		author: {
			'@type': 'Organization',
			name: 'Tellme Digiinfotech Private Limited',
			url: baseUrl,
			logo: {
				'@type': 'ImageObject',
				url: `${baseUrl}/favicon-32x32.png`
			}
		},
		creator: {
			'@type': 'Organization',
			name: 'Tellme Digiinfotech Private Limited',
			url: baseUrl
		},
		publisher: {
			'@type': 'Organization',
			name: 'Tellme Media',
			url: baseUrl,
			logo: {
				'@type': 'ImageObject',
				url: `${baseUrl}/favicon-32x32.png`
			}
		},
		copyrightHolder: {
			'@type': 'Organization',
			name: 'Tellme Digiinfotech Private Limited',
			url: baseUrl
		},
		copyrightYear,
		copyrightNotice: `© ${copyrightYear} Tellme Digiinfotech Private Limited. All rights reserved.`,
		creditText,

		// ── Licensing & commerce ────────────────────────────────────────────
		// license:            URL to the full license/terms page.
		// acquireLicensePage: URL where users can request/purchase a license.
		//                     THIS is what triggers the Google Image Search
		//                     "License" badge and shopping integration.
		license: `${baseUrl}/terms-and-conditions`,
		acquireLicensePage: acquireLicensePageUrl,

		// ── Taxonomy ────────────────────────────────────────────────────────
		keywords: image.meta_keywords || undefined,

		// ── Location ────────────────────────────────────────────────────────
		...(fullLocation && {
			contentLocation: {
				'@type': 'Place',
				name: fullLocation
			}
		}),

		// ── Dates ───────────────────────────────────────────────────────────
		// dateCreated: when the photo was taken (from EXIF/captured_date field).
		// NOTE: datePublished/dateModified are intentionally omitted to prevent
		// Google's news-freshness scorer from treating this as a news article.
		...(image.captured_date && {
			dateCreated: image.captured_date
		}),

		// ── Geolocation ─────────────────────────────────────────────────────
		...(image.latitude &&
			image.longitude && {
			geo: {
				'@type': 'GeoCoordinates',
				latitude: image.latitude,
				longitude: image.longitude
			}
		})
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

			{/* FAQ structured data — emitted only when curated GEO Q&A exists.
			    Powers Google FAQ rich results and gives AI assistants
			    (ChatGPT, Perplexity, SGE) clean Q&A pairs to lift from. */}
			{image.geo_faq && image.geo_faq.length > 0 && (
				<script
					id='faqStructuredData'
					type='application/ld+json'
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(faqStructuredData)
					}}
				/>
			)}
		</div>
	);
}
