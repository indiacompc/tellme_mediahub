import ShortsLayout from '@/components/shorts-layout';
import { getVideoBySlug, loadShortsFromJSON } from '@/lib/actions';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type ParamsType = {
	params: Promise<{
		slug: string;
	}>;
	searchParams: Promise<{
		filter?: string;
	}>;
};

export async function generateMetadata({ params }: ParamsType) {
	const { slug } = await params;
	const video = await getVideoBySlug(decodeURIComponent(slug), true);

	if (!video) {
		return {
			title: 'Short Not Found'
		};
	}

	return {
		title: video.title,
		description: video.description,
		openGraph: {
			title: video.title,
			description: video.description || undefined,
			images: [video.thumbnail]
		},
		twitter: {
			title: video.title,
			description: video.description || undefined,
			images: [video.thumbnail]
		}
	};
}

export default async function ShortPage({ params }: ParamsType) {
	const { slug } = await params;
	const decodedSlug = decodeURIComponent(slug);
	const video = await getVideoBySlug(decodedSlug, true);

	if (!video) {
		console.error('Video not found for slug:', decodedSlug);
		notFound();
	}

	// Ensure this is a short, if not redirect or show error
	if (!video.isShort) {
		notFound();
	}

	// Determine back button destination
	const backHref = '/?filter=shorts';
	const backText = 'Back to Shorts';

	// Load all shorts
	let allShorts: Awaited<ReturnType<typeof loadShortsFromJSON>> = [];
	try {
		allShorts = await loadShortsFromJSON();
		// Ensure the current video is in the list (in case validation filtered it out)
		const videoInList = allShorts.find((s) => s.id === video.id);
		if (!videoInList) {
			// Add the current video to the list if it's not there
			allShorts = [video, ...allShorts];
		}

		// Debug: Log the loaded video and shorts list
		console.log('[Short Page] Video loaded:', {
			requestedSlug: decodedSlug,
			videoId: video.id,
			videoSlug: video.slug,
			videoTitle: video.title,
			totalShorts: allShorts.length,
			videoIndexInList: allShorts.findIndex((s) => s.id === video.id)
		});
	} catch (error) {
		console.error('Error loading shorts:', error);
		// If loading fails, at least include the current video
		allShorts = [video];
	}

	return (
		<>
			<div className='w-full p-0'>
				{/* Back Button */}
				<div className='absolute top-24 left-4 z-30 mb-4 lg:static lg:top-auto lg:left-auto lg:z-auto lg:mt-6 lg:mb-6 lg:ml-6'>
					<Link
						href={backHref}
						className='lg:text-muted-foreground lg:hover:text-foreground inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white backdrop-blur-sm transition-colors sm:text-base lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none'
					>
						<ArrowLeft className='h-4 w-4 sm:h-5 sm:w-5' />
						{backText}
					</Link>
				</div>

				<ShortsLayout key={video.id} video={video} allShorts={allShorts} />
			</div>
		</>
	);
}
