'use client';

import MediaFilter from '@/components/MediaFilter';
import VideoGrid from '@/components/VideoGrid';

export default function ShortsPage() {
	return (
		<main className='mx-auto max-w-7xl px-4 py-6 sm:px-4 sm:py-8 lg:py-12'>
			<MediaFilter />
			<VideoGrid initialFilter='shorts' hideNavigation={true} />
		</main>
	);
}
