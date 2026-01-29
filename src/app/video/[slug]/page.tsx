import tellme_logo from '@/assets/images/tellme_logo.png';
import IframeClient from '@/components/IframeClient';
import Navbar from '@/components/Navbar';
import ShortsLayout from '@/components/shorts-layout';
import VideoDetailsFull from '@/components/video-details-full';
import {
	getVideoBySlug,
	loadPlaylistFromJSON,
	loadShortsFromJSON
} from '@/lib/actions';
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
	const video = await getVideoBySlug(decodeURIComponent(slug));

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
	const video = await getVideoBySlug(decodeURIComponent(slug));

	if (!video) {
		notFound();
	}

	// Determine back button destination based on filter param or video type
	const backFilter =
		filter === 'shorts' ? 'shorts' : video.isShort ? 'shorts' : 'videos';
	const backHref = `/?filter=${backFilter}`;
	const backText =
		backFilter === 'shorts' ? 'Back to Shorts' : 'Back to Videos';
	const playlistVideos = video.playlistId
		? await loadPlaylistFromJSON(video.playlistId)
		: [];
	const embedSrc =
		video.embedUrl ??
		`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`;

	// Load all shorts if this is a short
	let allShorts: Awaited<ReturnType<typeof loadShortsFromJSON>> = [];
	if (video.isShort) {
		try {
			allShorts = await loadShortsFromJSON();
			// Ensure the current video is in the list (in case validation filtered it out)
			const videoInList = allShorts.find((s) => s.id === video.id);
			if (!videoInList) {
				// Add the current video to the list if it's not there
				allShorts = [video, ...allShorts];
			}
		} catch (error) {
			console.error('Error loading shorts:', error);
			// If loading fails, at least include the current video
			allShorts = [video];
		}
	}

	return (
		<>
			<Navbar tellme_logo={tellme_logo} />
			<div
				className={`w-full ${video.isShort ? 'p-0' : 'mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 md:px-8 lg:px-10 lg:py-10 xl:max-w-6xl 2xl:max-w-7xl'}`}
			>
				{/* Back Button */}
				<div
					className={`${video.isShort ? 'absolute top-24 left-4 z-30 mb-4 lg:static lg:top-auto lg:left-auto lg:z-auto lg:mt-6 lg:mb-6 lg:ml-6' : 'mb-6 sm:mb-8'}`}
				>
					<Link
						href={backHref}
						className={`inline-flex items-center gap-2 text-sm transition-colors sm:text-base ${
							video.isShort
								? 'lg:text-muted-foreground lg:hover:text-foreground rounded-lg bg-black/50 px-3 py-2 text-white backdrop-blur-sm hover:bg-black/70 lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none'
								: 'text-muted-foreground hover:text-foreground'
						}`}
					>
						<ArrowLeft className='h-4 w-4 sm:h-5 sm:w-5' />
						{backText}
					</Link>
				</div>

				{video.isShort ? (
					<ShortsLayout video={video} allShorts={allShorts} />
				) : (
					<>
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
												return (
													<Link
														key={item.id}
														href={`/video/${item.slug}?filter=${backFilter}`}
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
					</>
				)}
			</div>
		</>
	);
}
