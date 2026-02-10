'use client';

import ImageWithLoading from '@/components/ImageWithLoading';
import {
	getProtectedImageUrl,
	isFirebaseStorageUrl
} from '@/lib/imageProtection';
import type { ImageListing } from '@/types/image';
import Link from 'next/link';

interface RecommendedImagesProps {
	images: ImageListing[];
	currentCategorySlug?: string;
}

export default function RecommendedImages({
	images,
	currentCategorySlug
}: RecommendedImagesProps) {
	if (!images || images.length === 0) {
		return null;
	}

	return (
		<div className='mt-12 sm:mt-16 lg:mt-20'>
			<h2 className='text-foreground font-cinzel mb-6 text-xl font-semibold sm:mb-8 sm:text-2xl lg:text-3xl'>
				Recommended Images
			</h2>
			<div className='grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-4 lg:gap-8'>
				{images.map((image) => {
					// Use current category slug if available, otherwise try to get from image
					const imageCategorySlug =
						currentCategorySlug || (image as any).category_slug;
					const detailUrl = `/images/detail/${image.slug}${imageCategorySlug ? `?filter=${imageCategorySlug}` : ''}`;

					return (
						<Link
							key={image.id}
							href={detailUrl}
							className='group bg-muted relative overflow-hidden rounded-lg transition-transform duration-300 hover:scale-105 hover:shadow-lg'
						>
							<div className='relative aspect-4/3 w-full overflow-hidden'>
							<ImageWithLoading
								src={
									isFirebaseStorageUrl(image.src)
										? getProtectedImageUrl(image.src)
										: image.src
								}
								alt={image.title}
								fill
								className='object-cover transition-transform duration-300 group-hover:scale-110'
								sizes='(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw'
								loading='lazy'
								quality={70}
							/>
								<div className='absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20' />
							</div>
							<div className='absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
								<p className='line-clamp-2 text-xs font-medium text-white sm:text-sm'>
									{image.title}
								</p>
							</div>
						</Link>
					);
				})}
			</div>
		</div>
	);
}
