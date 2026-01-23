'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/shadcn_data/components/ui/button';
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
		<div className="w-full mx-auto px-1 sm:px-4 md:px-6 lg:max-w-7xl">
			{/* Scrollable Shorts Feed */}
			<div 
				ref={containerRef}
				onScroll={handleScroll}
				className="h-[calc(100vh-200px)] sm:h-[calc(100vh-150px)] overflow-y-auto snap-y snap-mandatory scroll-smooth scrollbar-hide"
				style={{ 
					scrollbarWidth: 'none',
					msOverflowStyle: 'none'
				}}
			>
				<div className="flex flex-col items-center gap-4 pb-4">
					{shortsList.map((short, index) => {
						const isCurrent = index === currentVideoIndex;
						const shortTruncatedDesc = short.description ? short.description.substring(0, 150) : '';
						const shortHasMore = short.description && short.description.length > 150;
						
						return (
							<div
								key={short.id}
								ref={(el) => { videoRefs.current[index] = el; }}
								className="w-full flex flex-col lg:flex-row gap-4 sm:gap-5 lg:gap-6 xl:gap-8 items-start lg:items-end lg:justify-center snap-start min-h-[calc(100vh-200px)] sm:min-h-[calc(100vh-150px)]"
							>
								{/* Title and Video Group */}
								<div className="flex flex-col lg:flex-row gap-4 sm:gap-5 lg:gap-6 items-start lg:items-end w-full lg:w-auto">
									{/* Mobile: Title on Top */}
									{!expandedShorts.has(short.id) && (
										<div className="w-full lg:hidden flex justify-center">
											<button
												onClick={() => toggleExpanded(short.id)}
												className="w-full max-w-85 sm:max-w-87.5 md:max-w-sm text-left"
											>
												<h1 className="text-lg sm:text-xl font-bold text-foreground leading-tight">
													{short.title}
												</h1>
												<p className="text-xs text-muted-foreground mt-1">Click here</p>
											</button>
										</div>
									)}

									{/* Title (Desktop - Bottom Left, Outside Video) */}
									<div className={`hidden lg:flex items-end pb-2 transition-all duration-300 ${
										!expandedShorts.has(short.id) ? 'w-72 xl:w-80 shrink-0' : 'w-0 overflow-hidden'
									}`}>
										{!expandedShorts.has(short.id) && (
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

									{/* Video Player - Vertical/Portrait Aspect Ratio for Shorts */}
									<div className="w-full lg:w-auto flex justify-center">
										<div className="w-[calc(100vw-0.5rem)] sm:w-full sm:max-w-100 md:max-w-110 lg:w-70 xl:w-100 2xl:w-120 aspect-9/16 bg-black overflow-hidden rounded-lg">
											<iframe
												src={`https://www.youtube.com/embed/${short.id}?autoplay=${isCurrent ? 1 : 0}`}
												title={short.title}
												allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
												allowFullScreen
												className="w-full h-full border-0"
											/>
										</div>
									</div>
								</div>

								{/* Description and Details Panel - Show When Expanded (Mobile & Desktop) */}
								<div className={`w-full transition-all duration-300 ${
									expandedShorts.has(short.id)
										? 'block px-4 sm:px-6 lg:block lg:px-4 xl:px-6 lg:w-82 xl:w-100 lg:shrink-0' 
										: 'hidden lg:hidden'
								}`}>
									{expandedShorts.has(short.id) && (
										<div className="space-y-6">
											{/* Channel Name */}
											<p className="text-lg text-muted-foreground">{short.title}</p>
											<p className="text-sm text-muted-foreground">{short.channelName}</p>

											{/* Video Description with View More/Less */}
											{short.description && (
												<div>
													<div className="text-sm text-muted-foreground">
														{showFullDescription.has(short.id) ? (
															<div>
																<div className="whitespace-pre-wrap">{short.description}</div>
																<button
																	onClick={() => toggleFullDescription(short.id)}
																	className="text-primary hover:underline ml-1 font-semibold mt-2 inline-block"
																>
																	View less
																</button>
															</div>
														) : (
															<div>
																{shortTruncatedDesc}
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
											<div>
												<Link
													href={`/contact?subject=${encodeURIComponent(`Purchase request for video: https://www.youtube.com/watch?v=${short.id}`)}`}
												>
													<Button size="lg" className="text-lg px-8 py-6 font-semibold w-full lg:w-auto">
														Purchase Video
													</Button>
												</Link>
											</div>

											{/* Video Info */}
											<div className="border-t pt-6">
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
						);
					})}
				</div>
			</div>
		</div>
	);
}
