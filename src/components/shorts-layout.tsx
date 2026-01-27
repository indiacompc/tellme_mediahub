'use client';

import { Button } from '@/shadcn_data/components/ui/button';
import type { YouTubeVideo } from '@/types/youtube';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

interface ShortsLayoutProps {
	video: YouTubeVideo;
	allShorts?: YouTubeVideo[];
}

export default function ShortsLayout({
	video,
	allShorts = []
}: ShortsLayoutProps) {
	const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
	const [expandedShorts, setExpandedShorts] = useState<Set<string>>(new Set());
	const [showFullDescription, setShowFullDescription] = useState<Set<string>>(
		new Set()
	);
	const containerRef = useRef<HTMLDivElement>(null);
	const videoRefs = useRef<(HTMLDivElement | null)[]>([]);
	const isScrollingRef = useRef(false);
	const observerRef = useRef<IntersectionObserver | null>(null);
	const currentVideoIndexRef = useRef(0);

	// Use all shorts if provided, otherwise just show the current video
	const shortsList = allShorts.length > 0 ? allShorts : [video];

	// Find the index of the current video in the shorts list
	useEffect(() => {
		const index = shortsList.findIndex((s) => s.id === video.id);
		if (index !== -1) {
			setCurrentVideoIndex(index);
			currentVideoIndexRef.current = index;
		}
	}, [video.id, shortsList]);

	// Toggle expanded state for a specific short
	const toggleExpanded = (shortId: string) => {
		setExpandedShorts((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(shortId)) {
				newSet.delete(shortId);
			} else {
				newSet.add(shortId);
			}
			return newSet;
		});
	};

	// Toggle full description for a specific short
	const toggleFullDescription = (shortId: string) => {
		setShowFullDescription((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(shortId)) {
				newSet.delete(shortId);
			} else {
				newSet.add(shortId);
			}
			return newSet;
		});
	};

	// Render animated description text
	const renderAnimatedDescription = (text: string, className: string = '') => {
		if (!text) return null;
		const wordArray = text.split(' ');
		return (
			<div className={className}>
				{wordArray.map((word, i) => (
					<motion.span
						key={i}
						className='inline'
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.01, delay: i / 10 }}
					>
						{word}
						{i < wordArray.length - 1 ? ' ' : ''}
					</motion.span>
				))}
			</div>
		);
	};

	// Use Intersection Observer for better performance
	useEffect(() => {
		// Cleanup previous observer
		if (observerRef.current) {
			observerRef.current.disconnect();
		}

		// Create new Intersection Observer
		observerRef.current = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
						const index = parseInt(
							entry.target.getAttribute('data-index') || '0'
						);
						if (
							index !== currentVideoIndexRef.current &&
							!isScrollingRef.current
						) {
							currentVideoIndexRef.current = index;
							setCurrentVideoIndex(index);
							// Update URL without navigation
							const newVideo = shortsList[index];
							if (newVideo) {
								window.history.replaceState(
									null,
									'',
									`/video/${newVideo.slug}`
								);
							}
						}
					}
				});
			},
			{
				threshold: [0.5],
				rootMargin: '0px'
			}
		);

		// Wait for refs to be populated, then observe
		const timeoutId = setTimeout(() => {
			videoRefs.current.forEach((ref) => {
				if (ref && observerRef.current) {
					observerRef.current.observe(ref);
				}
			});
		}, 100);

		return () => {
			clearTimeout(timeoutId);
			if (observerRef.current) {
				observerRef.current.disconnect();
			}
		};
	}, [shortsList.length]);

	// Scroll to current video when component mounts or video changes (only on initial load)
	const initialLoadRef = useRef(true);
	useEffect(() => {
		if (
			initialLoadRef.current &&
			videoRefs.current[currentVideoIndex] &&
			containerRef.current
		) {
			initialLoadRef.current = false;
			setTimeout(() => {
				if (videoRefs.current[currentVideoIndex]) {
					videoRefs.current[currentVideoIndex]?.scrollIntoView({
						behavior: 'smooth',
						block: 'center'
					});
				}
			}, 100);
		}
	}, [currentVideoIndex]);

	// Handle scroll for desktop details hiding only
	const handleScroll = () => {
		// Check if we're on desktop (lg breakpoint is 1024px)
		const isDesktop = window.innerWidth >= 1024;

		// On desktop, if details are expanded, hide them when scrolling
		if (isDesktop && expandedShorts.size > 0) {
			setExpandedShorts(new Set());
		}
	};

	return (
		<div className='mx-auto w-full px-0 sm:px-4 md:px-6 lg:max-w-7xl lg:px-4 lg:pb-4'>
			{/* Scrollable Shorts Feed */}
			<div
				ref={containerRef}
				onScroll={handleScroll}
				className='scrollbar-hide h-screen snap-y snap-mandatory overflow-y-auto scroll-smooth lg:h-[calc(100vh-120px)]'
				style={{
					scrollbarWidth: 'none',
					msOverflowStyle: 'none',
					WebkitOverflowScrolling: 'touch',
					overscrollBehavior: 'contain'
				}}
			>
				<div className='flex flex-col items-center lg:gap-4 lg:pb-12'>
					{shortsList.map((short, index) => {
						const isCurrent = index === currentVideoIndex;
						const shortTruncatedDesc = short.description
							? short.description.substring(0, 150)
							: '';
						const shortHasMore =
							short.description && short.description.length > 150;
						const isExpanded = expandedShorts.has(short.id);
						const embedSrc = short.playlistId
							? `https://www.youtube.com/embed/${short.id}?list=${short.playlistId}&index=${short.playlistIndex ?? 1}&autoplay=${isCurrent ? 1 : 0}&mute=0&rel=0`
							: `https://www.youtube.com/embed/${short.id}?autoplay=${isCurrent ? 1 : 0}&mute=0&rel=0`;

						return (
							<div
								key={short.id}
								ref={(el) => {
									videoRefs.current[index] = el;
								}}
								data-index={index}
								className='relative flex min-h-screen w-full snap-start items-center justify-center lg:min-h-[calc(100vh-140px)] lg:flex-row lg:items-center lg:justify-center lg:pt-0'
							>
								{/* Mobile: Full Screen Video */}
								<div className='absolute inset-0 h-full w-full bg-black lg:hidden'>
									<iframe
										src={embedSrc}
										title={short.title}
										allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
										referrerPolicy='strict-origin-when-cross-origin'
										allowFullScreen
										className='h-full w-full border-0'
										loading='lazy'
										frameBorder='0'
									/>
								</div>

								{/* Desktop: Video, Title and Details Group */}
								<div className='hidden w-full flex-row items-end gap-4 sm:gap-5 lg:flex lg:justify-center lg:gap-4 xl:gap-5'>
									{/* Desktop: Title (Bottom Left, Outside Video) */}
									<div
										className={`flex items-end pb-2 transition-all duration-300 ${
											!isExpanded
												? 'w-72 shrink-0 xl:w-80'
												: 'w-0 overflow-hidden'
										}`}
									>
										{!isExpanded && (
											<button
												onClick={() => toggleExpanded(short.id)}
												className='max-w-xs text-left'
											>
												<h1 className='text-foreground text-lg leading-tight font-bold xl:text-xl'>
													{short.title}
												</h1>
												<p className='text-muted-foreground mt-1 text-xs'>
													Click here
												</p>
											</button>
										)}
									</div>

									{/* Desktop: Video Player */}
									<div className='flex w-auto shrink-0 justify-center'>
										<div className='aspect-9/16 w-[calc(100vw-0.5rem)] overflow-hidden rounded-lg bg-black sm:w-full sm:max-w-100 md:max-w-110 lg:w-105 xl:w-125 2xl:w-150'>
											<iframe
												src={embedSrc}
												title={short.title}
												allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
												referrerPolicy='strict-origin-when-cross-origin'
												allowFullScreen
												className='h-full w-full border-0'
												loading='lazy'
												frameBorder='0'
											/>
										</div>
									</div>

									{/* Desktop: Details Panel - Now part of the same flex row */}
									<div
										className={`transition-all duration-300 ${
											isExpanded
												? 'mr-4 block w-80 shrink-0 xl:ml-6 xl:w-96'
												: 'hidden w-0'
										}`}
									>
										{isExpanded && (
											<div className='animate-in fade-in slide-in-from-left-4 space-y-6 duration-300'>
												{/* Channel Name */}
												<div className='animate-in fade-in slide-in-from-left-2 delay-75 duration-300'>
													<p className='text-muted-foreground text-lg'>
														{short.title}
													</p>
													<p className='text-muted-foreground text-sm'>
														{short.channelName}
													</p>
												</div>

												{/* Video Description with View More/Less */}
												{short.description && (
													<div className='animate-in fade-in slide-in-from-left-2 delay-150 duration-300'>
														<div className='text-muted-foreground text-sm'>
															{showFullDescription.has(short.id) ? (
																<div>
																	{renderAnimatedDescription(
																		short.description,
																		'whitespace-pre-wrap'
																	)}
																	<button
																		onClick={() =>
																			toggleFullDescription(short.id)
																		}
																		className='text-primary mt-2 ml-1 inline-block font-semibold hover:underline'
																	>
																		View less
																	</button>
																</div>
															) : (
																<div>
																	{renderAnimatedDescription(
																		shortTruncatedDesc
																	)}
																	{shortHasMore && (
																		<button
																			onClick={() =>
																				toggleFullDescription(short.id)
																			}
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
												<div className='animate-in fade-in slide-in-from-left-2 delay-225 duration-300'>
													<Link
														href={`/contact?subject=${encodeURIComponent(`Purchase request for video: https://www.youtube.com/watch?v=${short.id}`)}`}
													>
														<Button
															size='lg'
															className='w-full px-8 py-6 text-lg font-semibold lg:w-auto'
														>
															Purchase Video
														</Button>
													</Link>
												</div>

												{/* Video Info */}
												<div className='animate-in fade-in slide-in-from-left-2 border-t pt-6 delay-300 duration-300'>
													<div className='space-y-3 text-sm'>
														<div>
															<span className='text-muted-foreground'>
																Published:
															</span>
															<span className='text-foreground ml-2'>
																{new Date(short.publishedAt).toLocaleDateString(
																	'en-US',
																	{
																		year: 'numeric',
																		month: 'long',
																		day: 'numeric'
																	}
																)}
															</span>
														</div>
														<div>
															<span className='text-muted-foreground'>
																Channel:
															</span>
															<span className='text-foreground ml-2'>
																{short.channelName}
															</span>
														</div>
														{short.recordingLocation && (
															<div>
																<span className='text-muted-foreground'>
																	Location:
																</span>
																<span className='text-foreground ml-2'>
																	{short.recordingLocation}
																</span>
															</div>
														)}
													</div>
												</div>
											</div>
										)}
									</div>
								</div>

								{/* Mobile: Title Overlay at Bottom */}
								{!isExpanded && (
									<div className='pointer-events-none absolute right-0 bottom-0 left-0 bg-linear-to-t from-black/80 via-black/60 to-transparent p-3 sm:p-4 lg:hidden'>
										<button
											onClick={() => toggleExpanded(short.id)}
											className='pointer-events-auto w-full text-left'
										>
											<h1 className='line-clamp-2 text-xs leading-tight font-semibold text-white sm:text-sm'>
												{short.title}
											</h1>
											<p className='mt-1 text-[10px] text-white/70 sm:text-xs'>
												Click here
											</p>
										</button>
									</div>
								)}

								{/* Description and Details Panel - Show When Expanded */}
								{/* Mobile: Bottom Sheet */}
								<div
									className={`absolute right-0 bottom-0 left-0 z-10 bg-black/95 transition-all duration-300 lg:hidden ${
										isExpanded ? 'h-[60%]' : 'h-0 overflow-hidden'
									}`}
								>
									{isExpanded && (
										<div className='animate-in fade-in slide-in-from-bottom-4 h-full overflow-y-auto px-4 duration-300 sm:px-6'>
											{/* Mobile: Close Button (X) */}
											<div className='animate-in fade-in sticky top-0 z-20 flex justify-end bg-black/95 pt-3 pb-2 duration-200'>
												<button
													onClick={() => toggleExpanded(short.id)}
													className='rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20'
													aria-label='Close details'
												>
													<X className='h-5 w-5 text-white' />
												</button>
											</div>

											<div className='space-y-4 pt-2 sm:space-y-6'>
												{/* Channel Name */}
												<div className='animate-in fade-in slide-in-from-bottom-2 delay-75 duration-300'>
													<h2 className='text-sm font-semibold text-white sm:text-base'>
														{short.title}
													</h2>
													<p className='text-xs text-white/70 sm:text-sm'>
														{short.channelName}
													</p>
												</div>

												{/* Video Description with View More/Less */}
												{short.description && (
													<div className='animate-in fade-in slide-in-from-bottom-2 delay-150 duration-300'>
														<div className='lg:text-muted-foreground text-xs text-white/90 sm:text-sm'>
															{showFullDescription.has(short.id) ? (
																<div>
																	{renderAnimatedDescription(
																		short.description,
																		'whitespace-pre-wrap'
																	)}
																	<button
																		onClick={() =>
																			toggleFullDescription(short.id)
																		}
																		className='text-primary lg:text-primary mt-2 ml-1 inline-block font-semibold hover:underline'
																	>
																		View less
																	</button>
																</div>
															) : (
																<div>
																	{renderAnimatedDescription(
																		shortTruncatedDesc
																	)}
																	{shortHasMore && (
																		<button
																			onClick={() =>
																				toggleFullDescription(short.id)
																			}
																			className='text-primary lg:text-primary ml-1 font-semibold hover:underline'
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
												<div className='animate-in fade-in slide-in-from-bottom-2 delay-225 duration-300'>
													<Link
														href={`/contact?subject=${encodeURIComponent(`Purchase request for video: https://www.youtube.com/watch?v=${short.id}`)}`}
													>
														<Button
															size='lg'
															className='bg-primary hover:bg-primary/90 w-full px-6 py-4 text-sm font-semibold sm:px-8 sm:py-6 sm:text-base lg:w-auto lg:text-lg'
														>
															Purchase Video
														</Button>
													</Link>
												</div>

												{/* Video Info */}
												<div className='lg:border-border animate-in fade-in slide-in-from-bottom-2 border-t border-white/20 pt-4 delay-300 duration-300 sm:pt-6'>
													<div className='space-y-2 text-xs sm:space-y-3 sm:text-sm'>
														<div>
															<span className='lg:text-muted-foreground text-white/70'>
																Published:
															</span>
															<span className='lg:text-foreground ml-2 text-white'>
																{new Date(short.publishedAt).toLocaleDateString(
																	'en-US',
																	{
																		year: 'numeric',
																		month: 'long',
																		day: 'numeric'
																	}
																)}
															</span>
														</div>
														<div>
															<span className='lg:text-muted-foreground text-white/70'>
																Channel:
															</span>
															<span className='lg:text-foreground ml-2 text-white'>
																{short.channelName}
															</span>
														</div>
														{short.recordingLocation && (
															<div>
																<span className='lg:text-muted-foreground text-white/70'>
																	Location:
																</span>
																<span className='lg:text-foreground ml-2 text-white'>
																	{short.recordingLocation}
																</span>
															</div>
														)}
													</div>
												</div>
											</div>
										</div>
									)}
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
