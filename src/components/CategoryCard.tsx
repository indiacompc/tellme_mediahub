'use client';

import {
	getProtectedImageUrl,
	isFirebaseStorageUrl
} from '@/lib/imageProtection';
import type { ImageCategorySummary } from '@/types/image';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface CategoryCardProps {
	category: ImageCategorySummary;
}

export default function CategoryCard({ category }: CategoryCardProps) {
	const router = useRouter();
	const [imgError, setImgError] = useState(false);

	if (!category.thumbnailSrc) {
		return null;
	}

	const handleClick = () => {
		const slug = category.categorySlug || category.categoryId.toLowerCase().replace(/\s+/g, '-');
		router.push(`/images?filter=${slug}`);
	};

	// Route Firebase Storage images through the proxy (bucket is private)
	const imgSrc = isFirebaseStorageUrl(category.thumbnailSrc)
		? getProtectedImageUrl(category.thumbnailSrc)
		: category.thumbnailSrc;

	const isProxied = isFirebaseStorageUrl(category.thumbnailSrc);

	return (
		<div
			onClick={handleClick}
			className='group relative cursor-pointer overflow-hidden rounded-xl shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-xl'
		>
			{/* Image Container */}
			<div className='bg-muted relative aspect-video w-full overflow-hidden'>
				{!imgError ? (
					<Image
						src={imgSrc}
						alt={category.thumbnailTitle}
						fill
						sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
						className='object-cover transition-transform duration-500 group-hover:scale-110'
						loading='lazy'
						unoptimized={isProxied}
						quality={isProxied ? undefined : 50}
						onError={() => setImgError(true)}
					/>
				) : (
					<div className='bg-muted flex h-full w-full items-center justify-center'>
						<span className='text-muted-foreground text-sm'>Image unavailable</span>
					</div>
				)}

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
							{category.imageCount}{' '}
							{category.imageCount === 1 ? 'Image' : 'Images'}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
