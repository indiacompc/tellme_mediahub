'use client';

import VideoCard from '@/components/video-card';
import type { YouTubeVideo } from '@/types/youtube';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface RecommendedVideosProps {
	videos: YouTubeVideo[];
}

export default function RecommendedVideos({ videos }: RecommendedVideosProps) {
	const [showAll, setShowAll] = useState(false);
	const router = useRouter();

	if (videos.length === 0) return null;

	const displayedVideos = showAll ? videos : videos.slice(0, 4);
	const hasMore = videos.length > 4;

	const handleVideoClick = (video: YouTubeVideo) => {
		router.push(`/video/${video.slug}?filter=videos`);
	};

	return (
		<div className='mt-12 sm:mt-16'>
			<h2 className='text-foreground font-cinzel mb-6 text-2xl font-semibold sm:mb-8 sm:text-3xl'>
				You May Also Like
			</h2>

			<div className='grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4'>
				{displayedVideos.map((video) => (
					<VideoCard
						key={video.id}
						video={video}
						onClick={() => handleVideoClick(video)}
					/>
				))}
			</div>

			{hasMore && !showAll && (
				<div className='mt-8 flex justify-center'>
					<button
						onClick={() => setShowAll(true)}
						className='bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-ring inline-flex h-10 items-center justify-center rounded-md px-8 text-sm font-medium transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none disabled:opacity-50'
					>
						View More
					</button>
				</div>
			)}
		</div>
	);
}
