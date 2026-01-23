'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/shadcn_data/components/ui/button';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import type { YouTubeVideo } from '@/types/youtube';

interface ShortsLayoutProps {
	video: YouTubeVideo;
	allShorts?: YouTubeVideo[];
}

export default function ShortsLayout({ video, allShorts = [] }: ShortsLayoutProps) {
	const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
	const [expandedShorts, setExpandedShorts] = useState<Set<string>>(new Set());
	const [showFullDescription, setShowFullDescription] = useState<Set<string>>(new Set());
	const containerRef = useRef<HTMLDivElement>(null);
	const videoRefs = useRef<(HTMLDivElement | null)[]>([]);
	
	// Use all shorts if provided, otherwise just show the current video
	const shortsList = allShorts.length > 0 ? allShorts : [video];
	
	// Find the index of the current video in the shorts list
	useEffect(() => {
		const index = shortsList.findIndex(s => s.id === video.id);
		if (index !== -1) {
			setCurrentVideoIndex(index);
		}
	}, [video.id, shortsList]);
	
	// Toggle expanded state for a specific short
	const toggleExpanded = (shortId: string) => {
		setExpandedShorts(prev => {
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
		setShowFullDescription(prev => {
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
						className="inline"
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
	
	// Scroll to current video when component mounts or video changes
	useEffect(() => {
		if (videoRefs.current[currentVideoIndex] && containerRef.current) {
			videoRefs.current[currentVideoIndex]?.scrollIntoView({ 
				behavior: 'smooth', 
				block: 'center' 
			});
		}
	}, [currentVideoIndex]);
	
	// Handle scroll to detect which video is in view
	const handleScroll = () => {
		if (!containerRef.current) return;
		
		// Check if we're on desktop (lg breakpoint is 1024px)
		const isDesktop = window.innerWidth >= 1024;
		
		// On desktop, if details are expanded, hide them when scrolling
		if (isDesktop && expandedShorts.size > 0) {
			setExpandedShorts(new Set());
		}
		
		const container = containerRef.current;
		const containerHeight = container.clientHeight;
		
		// Find which video is closest to center
		let closestIndex = 0;
		let closestDistance = Infinity;
		
		videoRefs.current.forEach((ref, index) => {
			if (ref) {
				const rect = ref.getBoundingClientRect();
				const containerRect = container.getBoundingClientRect();
				const videoCenter = rect.top - containerRect.top + rect.height / 2;
				const distance = Math.abs(videoCenter - containerHeight / 2);
				
				if (distance < closestDistance) {
					closestDistance = distance;
					closestIndex = index;
				}
			}
		});
		
		if (closestIndex !== currentVideoIndex) {
			setCurrentVideoIndex(closestIndex);
			// Update URL without navigation
			const newVideo = shortsList[closestIndex];
			if (newVideo) {
				window.history.replaceState(null, '', `/video/${newVideo.slug}`);
			}
		}
	};

	return (
		<div className="w-full mx-auto px-0 sm:px-4 md:px-6 lg:max-w-7xl lg:px-4 lg:pb-4">
			{/* Scrollable Shorts Feed */}
			<div 
				ref={containerRef}
				onScroll={handleScroll}
				className="h-screen lg:h-[calc(100vh-120px)] overflow-y-auto snap-y snap-mandatory scroll-smooth scrollbar-hide"
				style={{ 
					scrollbarWidth: 'none',
					msOverflowStyle: 'none'
				}}
			>
				<div className="flex flex-col items-center lg:gap-4 lg:pb-12">
					{shortsList.map((short, index) => {
						const isCurrent = index === currentVideoIndex;
						const shortTruncatedDesc = short.description ? short.description.substring(0, 150) : '';
						const shortHasMore = short.description && short.description.length > 150;
						const isExpanded = expandedShorts.has(short.id);
						
						return (
							<div
								key={short.id}
								ref={(el) => { videoRefs.current[index] = el; }}
								className="w-full relative snap-start min-h-screen lg:min-h-[calc(100vh-140px)] flex items-center justify-center lg:flex-row lg:items-center lg:justify-center lg:pt-0"
							>
								{/* Mobile: Full Screen Video */}
								<div className="absolute inset-0 w-full h-full bg-black lg:hidden">
									<iframe
										src={`https://www.youtube.com/embed/${short.id}?autoplay=${isCurrent ? 1 : 0}`}
										title={short.title}
										allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
										allowFullScreen
										className="w-full h-full border-0"
									/>
						</div>

								{/* Desktop: Video, Title and Details Group */}
								<div className="hidden lg:flex flex-row gap-4 sm:gap-5 lg:gap-4 xl:gap-5 items-end lg:justify-center w-full">
									{/* Desktop: Title (Bottom Left, Outside Video) */}
									<div className={`flex items-end pb-2 transition-all duration-300 ${
						!isExpanded ? 'w-72 xl:w-80 shrink-0' : 'w-0 overflow-hidden'
					}`}>
						{!isExpanded && (
							<button
												onClick={() => toggleExpanded(short.id)}
								className="text-left max-w-xs"
							>
								<h1 className="text-lg xl:text-xl font-bold text-foreground leading-tight">
													{short.title}
								</h1>
								<p className="text-xs text-muted-foreground mt-1">Click here</p>
							</button>
						)}
					</div>

									{/* Desktop: Video Player */}
									<div className="w-auto flex justify-center shrink-0">
										<div className="w-[calc(100vw-0.5rem)] sm:w-full sm:max-w-100 md:max-w-110 lg:w-105 xl:w-125 2xl:w-150 aspect-9/16 bg-black overflow-hidden rounded-lg">
							<iframe
												src={`https://www.youtube.com/embed/${short.id}?autoplay=${isCurrent ? 1 : 0}`}
												title={short.title}
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
								allowFullScreen
								className="w-full h-full border-0"
							/>
						</div>
					</div>

									{/* Desktop: Details Panel - Now part of the same flex row */}
									<div className={`transition-all duration-300 ${
										isExpanded
											? 'block w-80 xl:w-96 shrink-0 mr-4 xl:ml-6' 
											: 'hidden w-0'
									}`}>
										{isExpanded && (
											<div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
												{/* Channel Name */}
												<div className="animate-in fade-in slide-in-from-left-2 duration-300 delay-75">
													<p className="text-lg text-muted-foreground">{short.title}</p>
													<p className="text-sm text-muted-foreground">{short.channelName}</p>
												</div>

												{/* Video Description with View More/Less */}
												{short.description && (
													<div className="animate-in fade-in slide-in-from-left-2 duration-300 delay-150">
														<div className="text-sm text-muted-foreground">
															{showFullDescription.has(short.id) ? (
																<div>
																	{renderAnimatedDescription(short.description, 'whitespace-pre-wrap')}
																	<button
																		onClick={() => toggleFullDescription(short.id)}
																		className="text-primary hover:underline ml-1 font-semibold mt-2 inline-block"
																	>
																		View less
																	</button>
																</div>
															) : (
																<div>
																	{renderAnimatedDescription(shortTruncatedDesc)}
																	{shortHasMore && (
																		<button
																			onClick={() => toggleFullDescription(short.id)}
																			className="text-primary hover:underline ml-1 font-semibold"
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
												<div className="animate-in fade-in slide-in-from-left-2 duration-300 delay-225">
													<Link
														href={`/contact?subject=${encodeURIComponent(`Purchase request for video: https://www.youtube.com/watch?v=${short.id}`)}`}
													>
														<Button size="lg" className="text-lg px-8 py-6 font-semibold w-full lg:w-auto">
															Purchase Video
														</Button>
													</Link>
												</div>

												{/* Video Info */}
												<div className="border-t pt-6 animate-in fade-in slide-in-from-left-2 duration-300 delay-300">
													<div className="space-y-3 text-sm">
														<div>
															<span className="text-muted-foreground">Published:</span>
															<span className="ml-2 text-foreground">
																{new Date(short.publishedAt).toLocaleDateString('en-US', {
																	year: 'numeric',
																	month: 'long',
																	day: 'numeric',
																})}
															</span>
														</div>
														<div>
															<span className="text-muted-foreground">Channel:</span>
															<span className="ml-2 text-foreground">{short.channelName}</span>
														</div>
														{short.recordingLocation && (
															<div>
																<span className="text-muted-foreground">Location:</span>
																<span className="ml-2 text-foreground">{short.recordingLocation}</span>
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
									<div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-linear-to-t from-black/80 via-black/60 to-transparent pointer-events-none lg:hidden">
										<button
											onClick={() => toggleExpanded(short.id)}
											className="w-full text-left pointer-events-auto"
										>
											<h1 className="text-xs sm:text-sm font-semibold text-white leading-tight line-clamp-2">
												{short.title}
											</h1>
											<p className="text-[10px] sm:text-xs text-white/70 mt-1">Click here</p>
										</button>
									</div>
								)}

								{/* Description and Details Panel - Show When Expanded */}
								{/* Mobile: Bottom Sheet */}
								<div className={`lg:hidden absolute bottom-0 left-0 right-0 bg-black/95 transition-all duration-300 z-10 ${
									isExpanded
										? 'h-[60%]' 
										: 'h-0 overflow-hidden'
								}`}>
									{isExpanded && (
										<div className="h-full overflow-y-auto px-4 sm:px-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
											{/* Mobile: Close Button (X) */}
											<div className="flex justify-end pt-3 pb-2 sticky top-0 bg-black/95 z-20 animate-in fade-in duration-200">
												<button
													onClick={() => toggleExpanded(short.id)}
													className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
													aria-label="Close details"
												>
													<X className="w-5 h-5 text-white" />
												</button>
											</div>

											<div className="space-y-4 sm:space-y-6 pt-2">
												{/* Channel Name */}
												<div className="animate-in fade-in slide-in-from-bottom-2 duration-300 delay-75">
													<h2 className="text-sm sm:text-base font-semibold text-white">{short.title}</h2>
													<p className="text-xs sm:text-sm text-white/70">{short.channelName}</p>
												</div>

												{/* Video Description with View More/Less */}
												{short.description && (
													<div className="animate-in fade-in slide-in-from-bottom-2 duration-300 delay-150">
														<div className="text-xs sm:text-sm text-white/90 lg:text-muted-foreground">
															{showFullDescription.has(short.id) ? (
																<div>
																	{renderAnimatedDescription(short.description, 'whitespace-pre-wrap')}
																	<button
																		onClick={() => toggleFullDescription(short.id)}
																		className="text-primary lg:text-primary hover:underline ml-1 font-semibold mt-2 inline-block"
																	>
																		View less
																	</button>
																</div>
															) : (
																<div>
																	{renderAnimatedDescription(shortTruncatedDesc)}
																	{shortHasMore && (
																		<button
																			onClick={() => toggleFullDescription(short.id)}
																			className="text-primary lg:text-primary hover:underline ml-1 font-semibold"
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
												<div className="animate-in fade-in slide-in-from-bottom-2 duration-300 delay-225">
													<Link
														href={`/contact?subject=${encodeURIComponent(`Purchase request for video: https://www.youtube.com/watch?v=${short.id}`)}`}
													>
														<Button size="lg" className="text-sm sm:text-base lg:text-lg px-6 sm:px-8 py-4 sm:py-6 font-semibold w-full lg:w-auto bg-primary hover:bg-primary/90">
															Purchase Video
														</Button>
													</Link>
												</div>

												{/* Video Info */}
												<div className="border-t border-white/20 lg:border-border pt-4 sm:pt-6 animate-in fade-in slide-in-from-bottom-2 duration-300 delay-300">
													<div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
														<div>
															<span className="text-white/70 lg:text-muted-foreground">Published:</span>
															<span className="ml-2 text-white lg:text-foreground">
																{new Date(short.publishedAt).toLocaleDateString('en-US', {
																	year: 'numeric',
																	month: 'long',
																	day: 'numeric',
																})}
															</span>
														</div>
														<div>
															<span className="text-white/70 lg:text-muted-foreground">Channel:</span>
															<span className="ml-2 text-white lg:text-foreground">{short.channelName}</span>
														</div>
														{short.recordingLocation && (
															<div>
																<span className="text-white/70 lg:text-muted-foreground">Location:</span>
																<span className="ml-2 text-white lg:text-foreground">{short.recordingLocation}</span>
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
