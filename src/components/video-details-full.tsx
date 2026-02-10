'use client';

import { Button } from '@/shadcn_data/components/ui/button';
import type { YouTubeVideo } from '@/types/youtube';
import Link from 'next/link';
import { useMemo, useState } from 'react';

interface VideoDetailsFullProps {
	video: YouTubeVideo;
}

export default function VideoDetailsFull({ video }: VideoDetailsFullProps) {
	const [showFullDescription, setShowFullDescription] = useState(false);
	const publishedDate = useMemo(() => {
		const formatter = new Intl.DateTimeFormat('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			timeZone: 'UTC'
		});
		return formatter.format(new Date(video.publishedAt));
	}, [video.publishedAt]);

	// Truncate description to first 300 characters for regular videos
	const truncatedDescription = video.description
		? video.description.substring(0, 300)
		: '';
	const hasMoreContent = video.description && video.description.length > 300;

	return (
		<div className='flex flex-col gap-6 sm:gap-8 lg:flex-row lg:gap-10 xl:gap-12'>
			{/* Main Content */}
			<main className='w-full lg:w-2/3 xl:w-[65%] 2xl:w-[70%]'>
				{/* Video Title */}
				<div className='mb-4 sm:mb-6'>
					<h1 className='text-foreground font-cinzel mb-2 text-2xl font-semibold sm:mb-3 sm:text-2xl lg:text-3xl xl:text-4xl'>
						{video.title}
					</h1>
					<p className='text-muted-foreground text-sm sm:text-base'>
						{video.channelName}
					</p>
				</div>

				{/* Video Description with View More/Less */}
				{video.description && (
					<div className='mb-6 sm:mb-8 lg:mb-10'>
						<h2 className='font-quicksand mb-3 text-lg font-semibold sm:mb-4 sm:text-xl lg:text-2xl'>
							Description
						</h2>
						<div className='text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap sm:text-base'>
							{showFullDescription ? (
								<div>
									<div>{video.description}</div>
									<button
										onClick={() => setShowFullDescription(false)}
										className='text-primary mt-2 ml-1 inline-block font-semibold hover:underline'
									>
										View less
									</button>
								</div>
							) : (
								<div>
									{truncatedDescription}
									{hasMoreContent && (
										<button
											onClick={() => setShowFullDescription(true)}
											className='text-primary ml-1 font-semibold hover:underline'
										>
											View more
										</button>
									)}
								</div>
							)}
						</div>
					</div>
				)}

				{/* Purchase Button */}
				<div className='mb-6 sm:mb-8 lg:mb-10'>
					<Link
						href={`/contact?subject=${encodeURIComponent(`Purchase request for video: https://www.youtube.com/watch?v=${video.id}`)}`}
					>
						<Button
							size='lg'
							className='px-6 py-5 text-base font-semibold sm:px-8 sm:py-6 sm:text-lg lg:px-10 lg:py-7 lg:text-xl'
						>
							Purchase Video
						</Button>
					</Link>
				</div>

				{/* Video Info */}
				<div className='border-t pt-6 sm:pt-8'>
					<div className='grid grid-cols-1 gap-4 text-sm sm:grid-cols-2 sm:gap-6 sm:text-base'>
						<div>
							<span className='text-muted-foreground'>Published:</span>
							<span className='text-foreground ml-2'>{publishedDate}</span>
						</div>
						<div>
							<span className='text-muted-foreground'>Channel:</span>
							<span className='text-foreground ml-2'>{video.channelName}</span>
						</div>
					</div>
				</div>
			</main>

			{/* Sidebar */}
			<aside className='w-full lg:w-1/3 xl:w-[35%] 2xl:w-[30%]'>
				<div className='bg-card border-border rounded-lg border p-4 sm:p-6 lg:p-8'>
					<h3 className='font-quicksand mb-4 text-lg font-semibold sm:mb-6 sm:text-xl lg:text-2xl'>
						Video Details
					</h3>
					<div className='space-y-3 text-sm sm:space-y-4 sm:text-base'>
						<div>
							<span className='text-muted-foreground mb-1 block sm:mb-2'>
								Channel
							</span>
							<span className='text-foreground font-medium'>
								{video.channelName}
							</span>
						</div>
						<div>
							<span className='text-muted-foreground mb-1 block sm:mb-2'>
								Published
							</span>
							<span className='text-foreground'>{publishedDate}</span>
						</div>
						{video.recordingLocation && (
							<div>
								<span className='text-muted-foreground mb-1 block sm:mb-2'>
									Location
								</span>
								<span className='text-foreground'>
									{video.recordingLocation}
								</span>
							</div>
						)}
					</div>
				</div>
			</aside>
		</div>
	);
}
