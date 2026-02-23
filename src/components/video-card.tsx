'use client';

import { getYouTubeThumbnailFallbacks } from '@/lib/youtube-thumbnails';
import type { YouTubeVideo } from '@/types/youtube';
import { Play } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface VideoCardProps {
	video: YouTubeVideo;
	onClick: () => void;
}

export default function VideoCard({ video, onClick }: VideoCardProps) {
	const [currentThumbnailIndex, setCurrentThumbnailIndex] = useState(0);
	const [hasError, setHasError] = useState(false);

	// Get fallback thumbnails for this video
	// If video has an ID, use fallback chain; otherwise use the provided thumbnail
	const thumbnailFallbacks = video.id
		? getYouTubeThumbnailFallbacks(video.id)
		: video.thumbnail
			? [video.thumbnail]
			: [];

	// Start with the provided thumbnail, or hqdefault (index 1) for YouTube videos (more reliable than maxresdefault)
	const startIndex = video.thumbnail && !video.id ? 0 : video.id ? 1 : 0;
	const currentIndex = startIndex + currentThumbnailIndex;
	const currentThumbnail =
		hasError || currentIndex >= thumbnailFallbacks.length
			? null
			: thumbnailFallbacks[currentIndex] || null;


	const handleImageError = () => {
		// Try next fallback thumbnail
		const nextIndex = currentThumbnailIndex + 1;
		const totalIndex = startIndex + nextIndex;

		if (totalIndex < thumbnailFallbacks.length) {
			setCurrentThumbnailIndex(nextIndex);
			setHasError(false);
		} else {
			// All thumbnails failed
			setHasError(true);
		}
	};

	// Use portrait aspect ratio for shorts, landscape for regular videos
	const aspectRatio = video.isShort ? 'aspect-[9/16]' : 'aspect-video';

	return (
		<div className='group flex h-full flex-col'>
			<div
				onClick={onClick}
				className='border-border hover:border-primary bg-card hover:bg-muted/50 cursor-pointer overflow-hidden rounded-lg border transition-all duration-300 hover:shadow-lg'
			>
				<div
					className={`relative w-full ${aspectRatio} bg-muted overflow-hidden rounded-lg`}
				>
					{currentThumbnail ? (
						<Image
							src={currentThumbnail}
							alt={video.title}
							fill
							className='rounded-lg object-cover transition-transform duration-300 group-hover:scale-110'
							unoptimized
							loading='lazy'
							fetchPriority='auto'
							sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
							onError={handleImageError}
						/>
					) : (
						<div className='bg-muted text-muted-foreground flex h-full w-full items-center justify-center rounded-lg'>
							<div className='text-center'>
								<Play className='mx-auto mb-2 h-12 w-12 opacity-50' />
								<p className='text-xs'>No thumbnail</p>
							</div>
						</div>
					)}
					{/* Overlay */}
					{/* <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-accent flex items-center justify-center transition-all duration-300 group-hover:scale-125 group-hover:shadow-lg">
              <Play className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-white" />
            </div>
          </div> */}
				</div>
			</div>

			{/* Content */}
			<div className='flex flex-1 flex-col p-3 sm:p-4'>
				<h3 className='text-foreground group-hover:text-primary font-cinzel line-clamp-2 text-sm font-semibold transition-colors duration-300 sm:text-base'>
					{video.title}
				</h3>
				<p className='text-muted-foreground mt-2 text-xs sm:text-sm'>
					{video.channelName}
				</p>
			</div>
		</div>
	);
}
