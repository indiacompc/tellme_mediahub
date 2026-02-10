'use client';

import {
	getProtectedImageUrl,
	isFirebaseStorageUrl
} from '@/lib/imageProtection';
import type { ImageCategory } from '@/types/image';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface CategoryCardProps {
	category: ImageCategory;
}

export default function CategoryCard({ category }: CategoryCardProps) {
	const router = useRouter();

	// Filter checks for valid src
	const validImages = category.images.filter((img) => img.src);

	if (validImages.length === 0) {
		return null;
	}

	// Get the first image from the category (preferably with priority 1)
	const thumbnailImage =
		validImages.find((img) => img.priority === 1) || validImages[0];

	const handleClick = () => {
		// Navigate to images page with filter query parameter
		const slug =
			category.categorySlug ||
			category.categoryId.toLowerCase().replace(/\s+/g, '-');
		router.push(`/images?filter=${slug}`);
	};

	return (
		<div
			onClick={handleClick}
			className='group relative cursor-pointer overflow-hidden rounded-xl shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-xl'
		>
			{/* Image Container */}
			<div className='bg-muted relative aspect-video w-full overflow-hidden'>
				<Image
					src={
						isFirebaseStorageUrl(thumbnailImage.src)
							? getProtectedImageUrl(thumbnailImage.src)
							: thumbnailImage.src
					}
					alt={thumbnailImage.title}
					fill
					sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
					className='object-cover transition-transform duration-500 group-hover:scale-110'
					loading='lazy'
					unoptimized={isFirebaseStorageUrl(thumbnailImage.src)}
				/>

				{/* Black Overlay */}
				<div className='absolute inset-0 bg-black/20 transition-colors duration-300 group-hover:bg-black/40' />
				<div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100' />

				{/* Content Overlay */}
				<div className='absolute bottom-0 left-0 flex w-full items-end justify-between p-4 sm:p-5'>
					{/* Category Name - Bottom Left */}
					<h3 className='font-cinzel text-xl font-bold text-white capitalize shadow-black drop-shadow-md sm:text-2xl'>
						{category.categoryName}
					</h3>

					{/* Count - Bottom Right */}
					<div className='rounded-full bg-black/60 px-3 py-1 backdrop-blur-sm transition-transform duration-300 group-hover:scale-105'>
						<p className='text-xs font-semibold text-white'>
							{validImages.length}{' '}
							{validImages.length === 1 ? 'Image' : 'Images'}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
