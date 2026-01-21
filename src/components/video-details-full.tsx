import Link from 'next/link';
import { Button } from '@/shadcn_data/components/ui/button';
import type { YouTubeVideo } from '@/types/youtube';

interface VideoDetailsFullProps {
	video: YouTubeVideo;
}

export default function VideoDetailsFull({ video }: VideoDetailsFullProps) {
	return (
		<div className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-10 xl:gap-12">
			{/* Main Content */}
			<main className="w-full lg:w-2/3 xl:w-[65%] 2xl:w-[70%]">
				{/* Video Title */}
				<div className="mb-4 sm:mb-6">
					<h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-2 sm:mb-3">
						{video.title}
					</h1>
					<p className="text-sm sm:text-base text-muted-foreground">{video.channelName}</p>
				</div>

				{/* Video Description */}
				{video.description && (
					<div className="mb-6 sm:mb-8 lg:mb-10">
						<h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4">Description</h2>
						<div className="text-sm sm:text-base text-muted-foreground whitespace-pre-wrap leading-relaxed">
							{video.description}
						</div>
					</div>
				)}

				{/* Purchase Button */}
				<div className="mb-6 sm:mb-8 lg:mb-10">
					<Link
						href={`/contact?subject=${encodeURIComponent(`Purchase request for video: https://www.youtube.com/watch?v=${video.id}`)}`}
					>
						<Button size="lg" className="text-base sm:text-lg lg:text-xl px-6 sm:px-8 lg:px-10 py-5 sm:py-6 lg:py-7 font-semibold">
							Purchase Video
						</Button>
					</Link>
				</div>

				{/* Video Info */}
				<div className="border-t pt-6 sm:pt-8">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-sm sm:text-base">
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
					</div>
				</div>
			</main>

			{/* Sidebar */}
			<aside className="w-full lg:w-1/3 xl:w-[35%] 2xl:w-[30%]">
				<div className="bg-card border border-border rounded-lg p-4 sm:p-6 lg:p-8">
					<h3 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 sm:mb-6">Video Details</h3>
					<div className="space-y-3 sm:space-y-4 text-sm sm:text-base">
						<div>
							<span className="text-muted-foreground block mb-1 sm:mb-2">Channel</span>
							<span className="text-foreground font-medium">{video.channelName}</span>
						</div>
						<div>
							<span className="text-muted-foreground block mb-1 sm:mb-2">Published</span>
							<span className="text-foreground">
								{new Date(video.publishedAt).toLocaleDateString('en-US', {
									year: 'numeric',
									month: 'long',
									day: 'numeric',
								})}
							</span>
						</div>
						{video.recordingLocation && (
							<div>
								<span className="text-muted-foreground block mb-1 sm:mb-2">Location</span>
								<span className="text-foreground">{video.recordingLocation}</span>
							</div>
						)}
					</div>
				</div>
			</aside>
		</div>
	);
}
