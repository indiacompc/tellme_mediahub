import tellme_logo from '@/assets/images/tellme_logo.png';
import IframeClient from '@/components/IframeClient';
import Navbar from '@/components/Navbar';
import VideoDetailsFull from '@/components/video-details-full';
import {
	getVideoBySlug,
	loadPlaylistFromJSON
} from '@/lib/actions';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

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
	const video = await getVideoBySlug(decodeURIComponent(slug), false);

	if (!video) {
		return {
			title: 'Video Not Found'
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

export default async function VideoPage({ params, searchParams }: ParamsType) {
	const { slug } = await params;
	const { filter } = await searchParams;
	const video = await getVideoBySlug(decodeURIComponent(slug), false);

	if (!video) {
		notFound();
	}

	// If this is a short, redirect to the short route
	if (video.isShort) {
		redirect(`/short/${slug}${filter ? `?filter=${filter}` : ''}`);
	}

	// Determine back button destination
	const backFilter = filter === 'videos' ? 'videos' : 'videos';
	const backHref = `/?filter=${backFilter}`;
	const backText = 'Back to Videos';
	
	const playlistVideos = video.playlistId
		? await loadPlaylistFromJSON(video.playlistId)
		: [];
	// Use embedUrl from JSON if available, otherwise generate default
	// The embed URL from json_youtube.json already has query params, so we need to append properly
	let embedSrc: string;
	if (video.embedUrl) {
		// Check if embedUrl already has autoplay parameter
		if (video.embedUrl.includes('autoplay=')) {
			// Replace existing autoplay value
			embedSrc = video.embedUrl.replace(/autoplay=\d+/, 'autoplay=1');
			// Ensure rel=0 is present
			if (!embedSrc.includes('rel=')) {
				embedSrc += embedSrc.includes('?') ? '&rel=0' : '?rel=0';
			} else {
				embedSrc = embedSrc.replace(/rel=\d+/, 'rel=0');
			}
		} else {
			// Add autoplay and rel parameters
			embedSrc = `${video.embedUrl}${video.embedUrl.includes('?') ? '&' : '?'}autoplay=1&rel=0`;
		}
	} else {
		embedSrc = `https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`;
	}

	return (
		<>
			<Navbar tellme_logo={tellme_logo} />
			<div className='mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 md:px-8 lg:px-10 lg:py-10 xl:max-w-6xl 2xl:max-w-7xl'>
				{/* Back Button */}
				<div className='mb-6 sm:mb-8'>
					<Link
						href={backHref}
						className='text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors sm:text-base'
					>
						<ArrowLeft className='h-4 w-4 sm:h-5 sm:w-5' />
						{backText}
					</Link>
				</div>

				<div
					className={
						playlistVideos.length > 1
							? 'lg:grid lg:grid-cols-[minmax(0,1fr)_90px] lg:gap-6'
							: 'lg:grid lg:grid-cols-1'
					}
				>
					<div>
						{/* Video Player */}
						<div className='mb-6 aspect-5/4 w-full overflow-hidden bg-black sm:mb-8 sm:aspect-16/10 md:aspect-video lg:mb-10'>
							<IframeClient
								src={embedSrc}
								title={video.title}
								allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
								referrerPolicy='strict-origin-when-cross-origin'
								allowFullScreen
								className='h-full w-full border-0'
								frameBorder='0'
							/>
						</div>

						{/* Full Video Details - For Regular Videos */}
						<VideoDetailsFull video={video} />
					</div>

					{playlistVideos.length > 1 && (
						<aside className='mt-8 lg:mt-0'>
							<div className='border-border bg-card rounded-lg border'>
								<div className='border-border border-b px-4 py-3'>
									<h3 className='text-foreground text-sm font-semibold'>
										Playlist
									</h3>
									<p className='text-muted-foreground text-xs'>
										{playlistVideos.length} videos
									</p>
								</div>
								<div className='max-h-[60vh] overflow-y-auto'>
									{playlistVideos.map((item) => {
										const isCurrent = item.id === video.id;
										// Route playlist items correctly based on type
										const itemRoute = item.isShort ? '/short' : '/video';
										return (
											<Link
												key={item.id}
												href={`${itemRoute}/${item.slug}?filter=${item.isShort ? 'shorts' : 'videos'}`}
												className={`border-border flex gap-3 border-b px-4 py-3 transition-colors last:border-b-0 ${
													isCurrent ? 'bg-muted' : 'hover:bg-muted/60'
												}`}
											>
												<div className='h-10 w-16 shrink-0 overflow-hidden rounded bg-black'>
													<img
														src={item.thumbnail}
														alt={item.title}
														className='h-full w-full object-cover'
													/>
												</div>
												<div className='min-w-0'>
													<p
														className={`line-clamp-2 text-xs font-medium ${isCurrent ? 'text-foreground' : 'text-muted-foreground'}`}
													>
														{item.title}
													</p>
												</div>
											</Link>
										);
									})}
								</div>
							</div>
						</aside>
					)}
				</div>
			</div>
		</>
	);
}
