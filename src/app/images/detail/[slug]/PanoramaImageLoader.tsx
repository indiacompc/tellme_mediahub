'use client';
import PanoramaViewer from '@/components/PanoramaViewer';
import { cn } from '@/shadcn_data/lib/utils';
import type { ImageListing } from '@/types/image';
import Image from 'next/image';
import { Fragment, Suspense, useState } from 'react';

const PanoramaImageLoader = ({
	imageListingData,
	src
}: {
	imageListingData: ImageListing;
	src?: string;
}) => {
	const [isImageLoaded, setIsImageLoaded] = useState(false);
	const imageId = 'three-js-window-by-images-detail-page';
	const displaySrc = src || imageListingData.src;

	return (
		<Fragment>
			<Image
				id={imageId}
				src={displaySrc}
				width={imageListingData.width}
				height={imageListingData.height}
				quality={100}
				alt={imageListingData.title}
				className={cn(
					'h-full w-full object-cover transition-opacity duration-700',
					isImageLoaded ? 'absolute opacity-0' : 'animate-pulse opacity-100'
				)}
				onLoad={() => setIsImageLoaded(true)}
				onContextMenu={(e) => e.preventDefault()}
				title={imageListingData.title}
				priority={true}
				loading='eager'
				unoptimized
			/>
			<Suspense>
				{isImageLoaded && <PanoramaViewer imageUrl={displaySrc} />}
			</Suspense>
		</Fragment>
	);
};

export default PanoramaImageLoader;
