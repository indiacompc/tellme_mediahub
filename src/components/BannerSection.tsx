'use client';

import IframeClient from '@/components/IframeClient';
import { getYouTubeThumbnailFallbacks } from '@/lib/youtube-thumbnails';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious
} from '@/shadcn_data/components/ui/carousel';
import type { YouTubeVideo } from '@/types/youtube';
import { Play } from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import VideoBackground from './VideoBackground';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface BannerSectionProps {}

// Featured Video Card Component matching VideoCard design
function FeaturedVideoCard({
	video,
	onClick,
	loading = 'lazy'
}: {
	video: YouTubeVideo;
	onClick: () => void;
	loading?: 'lazy' | 'eager';
}) {
	const [currentThumbnailIndex, setCurrentThumbnailIndex] = useState(0);
	const [hasError, setHasError] = useState(false);

	// Get fallback thumbnails for this video
	const thumbnailFallbacks = video.id
		? getYouTubeThumbnailFallbacks(video.id)
		: video.thumbnail
			? [video.thumbnail]
			: [];

	// Start with the provided thumbnail, or hqdefault (index 1) for YouTube videos
	const startIndex = video.thumbnail && !video.id ? 0 : video.id ? 1 : 0;
	const currentIndex = startIndex + currentThumbnailIndex;
	const currentThumbnail =
		hasError || currentIndex >= thumbnailFallbacks.length
			? null
			: thumbnailFallbacks[currentIndex] || null;

	const handleImageError = () => {
		const nextIndex = currentThumbnailIndex + 1;
		const totalIndex = startIndex + nextIndex;

		if (totalIndex < thumbnailFallbacks.length) {
			setCurrentThumbnailIndex(nextIndex);
			setHasError(false);
		} else {
			setHasError(true);
		}
	};

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
							loading={loading}
							fetchPriority={loading === 'eager' ? 'high' : 'auto'}
							sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
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

export default function BannerSection({}: BannerSectionProps) {
	const router = useRouter();
	const descriptionText =
		'Accelerate your creative projects with premium 4K stock footage—licensed in hours, not months. Choose from thousands of curated clips across travel, heritage, nature, and tourism themes with transparent pricing and usage rights.';
	const paragraphArray = descriptionText.split(' ');
	const [shortsList, setShortsList] = useState<
		Array<{ id: string; title: string }>
	>([]);
	const [featuredVideos, setFeaturedVideos] = useState<YouTubeVideo[]>([]);
	const [carouselApi, setCarouselApi] = useState<any>(null);
	const [isCarouselHovered, setIsCarouselHovered] = useState(false);
	const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

	useEffect(() => {
		if (typeof window !== 'undefined' && 'matchMedia' in window) {
			const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
			setPrefersReducedMotion(mediaQuery.matches);
			const handler = (event: MediaQueryListEvent) =>
				setPrefersReducedMotion(event.matches);
			mediaQuery.addEventListener('change', handler);
			return () => mediaQuery.removeEventListener('change', handler);
		}
	}, []);

	useEffect(() => {
		let isMounted = true;
		const loadShortPreview = async () => {
			try {
				const response = await fetch(
					'/tellme_videohub_db_2025-07-18_171335.json'
				);
				if (!response.ok) return;
				const data = await response.json();
				if (!data?.videos || !Array.isArray(data.videos)) return;
				const shorts = data.videos
					.filter(
						(video: any) =>
							video?.is_short &&
							video?.status === 'public' &&
							video?.youtube_video_id
					)
					.slice(0, 10)
					.map((video: any) => ({
						id: video.youtube_video_id,
						title: video.title || 'Shorts'
					}));
				if (isMounted && shorts.length > 0) {
					setShortsList(shorts);
				}
			} catch {
				// Ignore errors
			}
		};

		const loadFeaturedVideos = async () => {
			try {
				const response = await fetch('/json_youtube.json');
				if (!response.ok) return;
				const data = await response.json();
				if (!Array.isArray(data)) return;

				const videos: YouTubeVideo[] = data
					.map((video: any, index: number) => {
						const url = video.url || '';
						const videoIdMatch = url.match(
							/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/
						);
						const videoId = videoIdMatch ? videoIdMatch[1] : null;
						if (!videoId) return null;

						const playlistMatch = url.match(/[?&]list=([^&\s]+)/);
						const playlistId = playlistMatch ? playlistMatch[1] : undefined;

						const slug =
							video.title
								.toLowerCase()
								.replace(/[^a-z0-9]+/g, '-')
								.replace(/^-+|-+$/g, '') + `-${videoId}`;

						const embedUrl = video.embed
							? String(video.embed)
							: playlistId
								? `https://www.youtube.com/embed/videoseries?list=${playlistId}`
								: `https://www.youtube.com/embed/${videoId}`;

						return {
							id: videoId,
							title: video.title || '',
							description: video.description || '',
							thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
							publishedAt: new Date().toISOString(),
							channelName: 'Tellme360',
							slug: slug,
							playlistId: playlistId,
							playlistIndex: playlistId ? index + 1 : undefined,
							embedUrl: embedUrl
						} as YouTubeVideo;
					})
					.filter((video): video is YouTubeVideo => video !== null);

				if (isMounted && videos.length > 0) {
					setFeaturedVideos(videos);
				}
			} catch {
				// Ignore errors
			}
		};

		loadShortPreview();
		loadFeaturedVideos();
		return () => {
			isMounted = false;
		};
	}, []);

	// Auto-scroll carousel
	useEffect(() => {
		if (!carouselApi || isCarouselHovered || prefersReducedMotion) return;

		const interval = setInterval(() => {
			carouselApi.scrollNext();
		}, 4000);

		return () => clearInterval(interval);
	}, [carouselApi, isCarouselHovered]);

	return (
		<>
			{/* Video Banner Section */}
			<div className='md:text-foreground relative min-h-[70vh] w-full overflow-hidden text-white sm:min-h-[80vh] md:h-[85vh] lg:h-[90vh] xl:h-[95vh] 2xl:h-screen'>
				<div className='md:hidden'>
					<VideoBackground />
				</div>
				<div className='md:bg-background/40 absolute top-0 right-0 bottom-0 left-0 z-1 bg-black/40 md:dark:bg-black/40' />
				<section className='content absolute top-0 right-0 bottom-0 left-0 z-10 flex h-auto w-full flex-col items-start justify-center px-3 pt-16 sm:px-4 sm:pt-20 md:px-6 md:pt-24 lg:px-8 lg:pt-28 xl:px-12 xl:pt-12 2xl:px-16 2xl:pt-16'>
					<div className='mx-auto w-full max-w-7xl lg:flex lg:items-center lg:justify-between lg:gap-8 xl:gap-12'>
						<div className='w-full max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-[calc(100%-360px)] 2xl:max-w-[calc(100%-420px)]'>
							<h2 className='font-cinzel mb-3 font-semibold sm:mb-4 md:mb-5 md:font-normal'>
								<motion.span
									className='text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl'
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{
										duration: 1,
										delay: 0
									}}
								>
									Welcome to&nbsp;
								</motion.span>
								<br />
								<motion.span
									className='text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl'
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{
										duration: 1,
										delay: 0.1
									}}
								>
									Tellme Media
								</motion.span>
							</h2>
							<p className='py-2 text-xs leading-relaxed wrap-break-word hyphens-none whitespace-normal sm:py-3 sm:text-sm md:py-4 md:text-base lg:py-5 lg:text-lg xl:text-xl'>
								{paragraphArray.map((word, i) => (
									<motion.span
										key={i}
										className='inline'
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ duration: 0.01, delay: i / 10 }}
									>
										{word}
										{i < paragraphArray.length - 1 ? ' ' : ''}
									</motion.span>
								))}
							</p>

							{/* Desktop Featured Videos Carousel - Show on md+ screens, inside banner */}
							{featuredVideos.length > 0 && (
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.6, delay: 0.5 }}
									className='mt-6 hidden w-full pr-0 md:mt-8 md:block md:pr-25 lg:pr-25 xl:pr-25 2xl:mt-10 2xl:pr-40'
								>
									<h3 className='text-foreground font-quicksand mb-5 text-xl font-semibold xl:mb-6 xl:text-2xl 2xl:mb-8 2xl:text-3xl'>
										Trending Videos
									</h3>
									<Carousel
										opts={{
											align: 'start',
											loop: true,
											dragFree: true
										}}
										setApi={setCarouselApi}
										className='relative w-full'
										onMouseEnter={() => setIsCarouselHovered(true)}
										onMouseLeave={() => setIsCarouselHovered(false)}
									>
										<CarouselContent className='-ml-4 xl:-ml-5 2xl:-ml-6'>
												{featuredVideos.map((video, index) => (
													<CarouselItem
														key={video.id}
														className='basis-[85%] pl-4 sm:basis-[70%] md:basis-[75%] lg:basis-1/3 xl:basis-[40%] xl:pl-5 2xl:basis-[45%] 2xl:pl-6'
													>
														<FeaturedVideoCard
															video={video}
															onClick={() =>
																router.push(`/video/${video.slug}?filter=videos`)
															}
															loading={index < 1 ? 'eager' : 'lazy'}
														/>
													</CarouselItem>
												))}
										</CarouselContent>
										<CarouselPrevious className='text-foreground border-foreground/20 hover:bg-foreground/10 hover:border-foreground/40 bg-background/30 -left-4 z-20 hidden size-12 border-2 backdrop-blur-sm md:flex lg:-left-6 xl:-left-8 xl:size-12 2xl:-left-10 2xl:size-12 dark:border-white/20 dark:bg-black/30 dark:hover:border-white/40 dark:hover:bg-white/10' />
										<CarouselNext className='text-foreground border-foreground/20 hover:bg-foreground/10 hover:border-foreground/40 bg-background/30 -right-4 z-20 hidden size-12 border-2 backdrop-blur-sm md:flex lg:-right-6 xl:-right-8 xl:size-12 2xl:-right-10 2xl:size-12 dark:border-white/20 dark:bg-black/30 dark:hover:border-white/40 dark:hover:bg-white/10' />
									</Carousel>
								</motion.div>
							)}
						</div>
						{/* Desktop Shorts Preview - Show on md+ screens, positioned on the right */}
						{shortsList.length > 0 && (
							<div className='absolute top-1/2 right-4 z-10 hidden -translate-y-1/2 md:right-6 md:block lg:right-6 xl:right-6 2xl:right-12'>
								<div className='rounded-xl'>
									<div className='h-[calc(100vh-250px)] max-h-137.5 w-75 xl:h-[calc(100vh-220px)] xl:max-h-150 xl:w-80 2xl:max-h-162.5 2xl:w-85'>
										<div className='border-foreground/20 bg-background relative h-full w-full overflow-hidden rounded-[28px] border shadow-xl xl:rounded-[32px] dark:border-white/20 dark:bg-black'>
											<div className='absolute top-2 left-1/2 z-10 h-1.5 w-12 -translate-x-1/2 rounded-full bg-neutral-800/80 xl:h-2 xl:w-16' />
											<div
												className='h-full snap-y snap-mandatory overflow-y-auto'
												style={{
													scrollbarWidth: 'none',
													msOverflowStyle: 'none',
													WebkitOverflowScrolling: 'touch',
													overscrollBehavior: 'contain'
												}}
											>
												{shortsList.map((short, index) => (
													<div
														key={short.id}
														className='h-full min-h-full w-full shrink-0 snap-start snap-always'
													>
														<IframeClient
															key={`desktop-short-${short.id}-${index}`}
															src={`https://www.youtube.com/embed/${short.id}?autoplay=${index === 0 ? 1 : 0}&mute=1&rel=0&playsinline=1&loop=0&controls=1`}
															title={short.title}
															loading={index < 1 ? 'eager' : 'lazy'}
															allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
															referrerPolicy='strict-origin-when-cross-origin'
															allowFullScreen
															className='h-full w-full border-0'
														/>
													</div>
												))}
											</div>
										</div>
									</div>
								</div>
							</div>
						)}
					</div>
				</section>
			</div>

			{/* Content Below Banner */}
			<div className='bg-background text-foreground w-full'>
				<div className='mx-auto max-w-7xl px-3 py-8 sm:px-4 sm:py-12 md:px-6 lg:px-8 xl:px-12 2xl:px-16'>
					{/* Mobile Shorts Preview - Show below banner on mobile only (below md) */}
					{shortsList.length > 0 && (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.3 }}
							className='mb-8 flex w-full justify-center sm:mb-10 md:hidden'
						>
							<div className='rounded-xl'>
								<div className='h-110 w-72 sm:h-130 sm:w-80 md:h-140 md:w-[340px]'>
									<div className='border-border bg-card relative h-full w-full overflow-hidden rounded-[24px] border shadow-xl sm:rounded-[28px]'>
										<div className='absolute top-2 left-1/2 z-10 h-1.5 w-12 -translate-x-1/2 rounded-full bg-neutral-800/80' />
										<div
											className='h-full snap-y snap-mandatory overflow-y-auto'
											style={{
												scrollbarWidth: 'none',
												msOverflowStyle: 'none',
												WebkitOverflowScrolling: 'touch',
												overscrollBehavior: 'contain'
											}}
										>
											{shortsList.map((short, index) => (
												<div
													key={short.id}
													className='h-full min-h-full w-full shrink-0 snap-start snap-always'
												>
													<IframeClient
														key={`mobile-short-${short.id}-${index}`}
														src={`https://www.youtube.com/embed/${short.id}?autoplay=${index === 0 ? 1 : 0}&mute=1&rel=0&playsinline=1&loop=0&controls=1`}
														title={short.title}
														loading={index < 1 ? 'eager' : 'lazy'}
														allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
														referrerPolicy='strict-origin-when-cross-origin'
														allowFullScreen
														className='h-full w-full border-0'
													/>
												</div>
											))}
										</div>
									</div>
								</div>
							</div>
						</motion.div>
					)}

					{/* Mobile Featured Videos Carousel - Show below banner on mobile only (below md) */}
					{featuredVideos.length > 0 && (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.5 }}
							className='w-full md:hidden'
						>
							<h3 className='text-foreground font-quicksand mb-6 text-xl font-semibold sm:mb-8 sm:text-2xl md:mb-10 md:text-3xl lg:text-4xl'>
								Trending Videos
							</h3>
							<Carousel
								opts={{
									align: 'start',
									loop: true,
									dragFree: true
								}}
								className='w-full'
							>
								<CarouselContent className='-ml-2 sm:-ml-3 md:-ml-4 lg:-ml-6'>
							{featuredVideos.map((video, index) => (
								<CarouselItem
									key={video.id}
									className='basis-[85%] pl-2 sm:basis-[70%] sm:pl-3 md:basis-[45%] md:pl-4 lg:basis-1/3 lg:pl-6 xl:basis-1/3 2xl:basis-1/4'
								>
									<FeaturedVideoCard
										video={video}
										onClick={() =>
											router.push(`/video/${video.slug}?filter=videos`)
										}
										loading={index < 1 ? 'eager' : 'lazy'}
									/>
								</CarouselItem>
							))}
								</CarouselContent>
								<CarouselPrevious className='border-border hover:bg-muted -left-4 hidden md:flex lg:-left-8 xl:-left-10' />
								<CarouselNext className='border-border hover:bg-muted -right-4 hidden md:flex lg:-right-8 xl:-right-10' />
							</Carousel>
						</motion.div>
					)}
				</div>
			</div>
		</>
	);
}
