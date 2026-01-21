'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/shadcn_data/components/ui/button';
import { ChevronDown } from 'lucide-react';
import type { YouTubeVideo } from '@/types/youtube';

interface VideoDetailsCollapsibleProps {
	video: YouTubeVideo;
}

export default function VideoDetailsCollapsible({
	video,
}: VideoDetailsCollapsibleProps) {
	const [isExpanded, setIsExpanded] = useState(false);

	return (
		<>
			{/* Video Title - Clickable (Left Side) */}
			<button
				onClick={() => setIsExpanded(!isExpanded)}
				className="w-full text-left"
			>
				<div className="flex items-start justify-between gap-2">
					<h1 className="text-xl lg:text-2xl font-bold text-foreground leading-tight">
						{video.title}
					</h1>
					<ChevronDown
						className={`w-4 h-4 lg:w-5 lg:h-5 text-muted-foreground transition-transform shrink-0 mt-1 ${
							isExpanded ? 'rotate-180' : ''
						}`}
					/>
				</div>
			</button>

			{/* Information Panel (Right Side) - Only Show When Expanded */}
			{isExpanded && (
				<div className="fixed lg:relative right-0 top-0 lg:top-auto w-full lg:w-80 h-screen lg:h-auto bg-background lg:bg-transparent border-l lg:border-l-0 border-border p-6 lg:p-0 overflow-y-auto z-50 lg:z-auto">
					<div className="space-y-6">
						{/* Channel Name */}
						<p className="text-sm text-muted-foreground">{video.channelName}</p>

						{/* Video Description */}
						{video.description && (
							<div>
								<h2 className="text-lg font-semibold mb-2">Description</h2>
								<div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
									{video.description}
								</div>
							</div>
						)}

						{/* Purchase Button */}
						<div>
							<Link
								href={`/contact?subject=${encodeURIComponent(`Purchase request for video: https://www.youtube.com/watch?v=${video.id}`)}`}
							>
								<Button size="lg" className="text-lg px-8 py-6 font-semibold w-full">
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
				</div>
			)}
		</>
	);
}
