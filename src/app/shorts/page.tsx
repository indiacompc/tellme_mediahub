'use client';

import MediaFilter from '@/components/MediaFilter';
import VideoGrid from '@/components/VideoGrid';
import { Suspense } from 'react';

function ShortsPageContent() {
	return (
		<main className='mx-auto max-w-7xl px-4 py-6 sm:px-4 sm:py-8 lg:py-12'>
			<MediaFilter />
			<VideoGrid initialFilter='shorts' hideNavigation={true} />
		</main>
	);
}

export default function ShortsPage() {
	return (
		<Suspense
			fallback={
				<main className='mx-auto max-w-7xl px-4 py-6 sm:px-4 sm:py-8 lg:py-12'>
					<div className='flex min-h-[75dvh] w-full items-center justify-center'>
						<p>Loading...</p>
					</div>
				</main>
			}
		>
			<ShortsPageContent />
		</Suspense>
	);
}
