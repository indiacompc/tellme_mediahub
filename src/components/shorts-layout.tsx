'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/shadcn_data/components/ui/button';
import type { YouTubeVideo } from '@/types/youtube';

interface ShortsLayoutProps {
	video: YouTubeVideo;
}

export default function ShortsLayout({ video }: ShortsLayoutProps) {
	const [isExpanded, setIsExpanded] = useState(false);
	const [showFullDescription, setShowFullDescription] = useState(false);
	
	// Truncate description to first 150 characters
	const truncatedDescription = video.description ? video.description.substring(0, 150) : '';
	const hasMoreContent = video.description && video.description.length > 150;

	return (
		<div className="w-full mx-auto px-1 sm:px-4 md:px-6 lg:max-w-7xl">
			<div className="flex flex-col lg:flex-row gap-4 sm:gap-5 lg:gap-6 xl:gap-8 items-start lg:items-end lg:justify-center">
				{/* Title and Video Group - Centered Together */}
				<div className="flex flex-col lg:flex-row gap-4 sm:gap-5 lg:gap-6 items-start lg:items-end w-full lg:w-auto">
					{/* Mobile: Title on Top */}
					{!isExpanded && (
						<div className="w-full lg:hidden flex justify-center">
							<button
								onClick={() => setIsExpanded(!isExpanded)}
								className="w-full max-w-85 sm:max-w-[350px] md:max-w-sm text-left"
							>
								<h1 className="text-lg sm:text-xl font-bold text-foreground leading-tight">
									{video.title}
								</h1>
							</button>
						</div>
					)}

					{/* Title (Desktop - Bottom Left, Outside Video) */}
					<div className={`hidden lg:flex items-end pb-2 transition-all duration-300 ${
						!isExpanded ? 'w-72 xl:w-80 shrink-0' : 'w-0 overflow-hidden'
					}`}>
						{!isExpanded && (
							<button
								onClick={() => setIsExpanded(true)}
								className="text-left max-w-xs"
							>
								<h1 className="text-lg xl:text-xl font-bold text-foreground leading-tight">
									{video.title}
								</h1>
							</button>
						)}
					</div>

					{/* Video Player - Vertical/Portrait Aspect Ratio for Shorts */}
					<div className="w-full lg:w-auto flex justify-center">
						<div className="w-[calc(100vw-0.5rem)] sm:w-full sm:max-w-100 md:max-w-110 lg:w-70 xl:w-100 2xl:w-120 aspect-9/16 bg-black overflow-hidden">
							<iframe
								src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
								title={video.title}
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
								allowFullScreen
								className="w-full h-full border-0"
							/>
						</div>
					</div>
				</div>

				{/* Description and Details Panel - Show When Expanded (Mobile & Desktop) */}
				<div className={`w-full transition-all duration-300 ${
					isExpanded 
						? 'block px-4 sm:px-6 lg:block lg:px-4 xl:px-6 lg:w-82 xl:w-100 lg:shrink-0' 
						: 'hidden lg:hidden'
				}`}>
					{isExpanded && (
						<div className="space-y-6">
							{/* Channel Name */}
							<p className="text-lg text-muted-foreground">{video.title}</p>
							<p className="text-sm text-muted-foreground">{video.channelName}</p>

							{/* Video Description with View More/Less */}
							{video.description && (
								<div>
									<div className="text-sm text-muted-foreground">
										{showFullDescription ? (
											<div>
												<div className="whitespace-pre-wrap">{video.description}</div>
												<button
													onClick={() => setShowFullDescription(false)}
													className="text-primary hover:underline ml-1 font-semibold mt-2 inline-block"
												>
													View less
												</button>
											</div>
										) : (
											<div>
												{truncatedDescription}
												{hasMoreContent && (
													<button
														onClick={() => setShowFullDescription(true)}
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
									href={`/contact?subject=${encodeURIComponent(`Purchase request for video: https://www.youtube.com/watch?v=${video.id}`)}`}
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
											{new Date(video.publishedAt).toLocaleDateString('en-US', {
												year: 'numeric',
												month: 'long',
												day: 'numeric',
											})}
										</span>
									</div>
									<div>
										<span className="text-muted-foreground">Channel:</span>
										<span className="ml-2 text-foreground">{video.channelName}</span>
									</div>
									{video.recordingLocation && (
										<div>
											<span className="text-muted-foreground">Location:</span>
											<span className="ml-2 text-foreground">{video.recordingLocation}</span>
										</div>
									)}
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
