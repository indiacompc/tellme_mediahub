'use client';
import { cn } from '@/shadcn_data/lib/utils';
import {
	OnLoadingComplete,
	PlaceholderValue
} from 'next/dist/shared/lib/get-img-props';
import Image from 'next/image';
import React, { useState } from 'react';
// import { siteUrl } from '@/auth/ConfigManager';

const ImageWithLoading = (
	props: React.JSX.IntrinsicAttributes &
		Omit<
			React.DetailedHTMLProps<
				React.ImgHTMLAttributes<HTMLImageElement>,
				HTMLImageElement
			>,
			'ref' | 'height' | 'width' | 'loading' | 'alt' | 'src' | 'srcSet'
		> & {
			src: string | import('next/dist/shared/lib/get-img-props').StaticImport;
			alt: string;
			width?: number | `${number}`;
			height?: number | `${number}`;
			fill?: boolean;
			loader?: import('next/image').ImageLoader;
			quality?: number | `${number}`;
			priority?: boolean;
			loading?: 'eager' | 'lazy' | undefined;
			placeholder?: PlaceholderValue;
			blurDataURL?: string;
			unoptimized?: boolean;
			overrideSrc?: string;
			onLoadingComplete?: OnLoadingComplete;
			layout?: string;
			objectFit?: string;
			objectPosition?: string;
			lazyBoundary?: string;
			lazyRoot?: string;
		} & React.RefAttributes<HTMLImageElement | null> & {
			loadingClassName?: string;
		}
) => {
	const {
		src,
		className,
		onLoad,
		onError,
		alt,
		loadingClassName,
		unoptimized: propUnoptimized,
		quality: propQuality,
		...remainingProps
	} = props;
	const [isloaded, setIsLoaded] = useState(false);

	// Check if src is from Firebase Storage or proxy API - use unoptimized to avoid timeout/issues
	const isFirebaseStorage =
		typeof src === 'string' &&
		(src.includes('storage.googleapis.com') ||
			src.includes('firebasestorage.app'));

	// Check if src is a proxy URL (contains query string)
	const isProxyUrl =
		typeof src === 'string' && src.includes('/api/images/proxy');

	// Use unoptimized for Firebase Storage images and proxy URLs to prevent timeout/query string errors
	const shouldUseUnoptimized =
		propUnoptimized || isFirebaseStorage || isProxyUrl;

	// Default quality: 75 for grid images (lower bandwidth), can be overridden
	const defaultQuality = 75;
	const imageQuality = propQuality !== undefined ? propQuality : defaultQuality;

	return (
		<Image
			src={src}
			alt={alt}
			className={cn(
				className,
				isloaded ? '' : loadingClassName || 'animate-pulse bg-gray-200 dark:bg-gray-700'
			)}
			unoptimized={shouldUseUnoptimized}
			quality={shouldUseUnoptimized ? undefined : imageQuality}
			onLoad={(e) => {
				setIsLoaded(true);
				if (onLoad !== undefined) {
					onLoad(e);
				}
			}}
			onError={(e) => {
				setIsLoaded(true);
				if (onError !== undefined) {
					onError(e);
				}
			}}
			{...remainingProps}
		/>
	);
};

export default ImageWithLoading;
