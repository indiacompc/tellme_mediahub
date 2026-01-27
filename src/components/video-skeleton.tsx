'use client';

export default function VideoSkeleton() {
	return (
		<div className='bg-card border-border flex h-full animate-pulse flex-col overflow-hidden rounded-lg border'>
			{/* Thumbnail Skeleton */}
			<div className='bg-muted aspect-video w-full' />

			{/* Content Skeleton */}
			<div className='flex flex-1 flex-col p-4'>
				<div className='bg-muted mb-3 h-4 w-3/4 rounded' />
				<div className='bg-muted h-4 w-1/2 rounded' />
				<div className='bg-muted mt-auto h-3 w-2/3 rounded' />
			</div>

			{/* Button Skeleton */}
			<div className='px-4 pb-4'>
				<div className='bg-muted h-9 w-full rounded-md' />
			</div>
		</div>
	);
}
