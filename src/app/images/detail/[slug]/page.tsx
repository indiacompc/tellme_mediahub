import ImageDetailsFull from '@/components/image-details-full';
import ImageWithLoading from '@/components/ImageWithLoading';
import ProtectedImageWrapper from '@/components/ProtectedImageWrapper';
import RecommendedImages from '@/components/RecommendedImages';
import {
	getImageBySlug,
	getProtectedImageUrlServer,
	getSuggestedImages
} from '@/lib/actions';
import { isFirebaseStorageUrl } from '@/lib/imageProtection';
import { ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

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

	return {
		title: image.meta_title || image.title,
		description: image.meta_description || image.description,
		keywords: image.meta_keywords,
		openGraph: {
			title: image.meta_title || image.title,
			description: image.meta_description || image.description,
			images: [image.src]
		},
		twitter: {
			card: 'summary_large_image',
			title: image.meta_title || image.title,
			description: image.meta_description || image.description,
			images: [image.src]
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
								<ImageWithLoading
									src={protectedImageUrl}
									alt={image.title}
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
		</div>
	);
}
