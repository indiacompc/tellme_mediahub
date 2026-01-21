import Link from 'next/link';
import { Button } from '@/shadcn_data/components/ui/button';
import type { YouTubeVideo } from '@/types/youtube';

interface VideoDetailsFullProps {
	video: YouTubeVideo;
}

export default function VideoDetailsFull({ video }: VideoDetailsFullProps) {
	return (
		<div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
			{/* Main Content */}
			<main className="w-full lg:w-2/3">
				{/* Video Title */}
				<div className="mb-4 px-4 sm:px-0">
					<h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
						{video.title}
					</h1>
					<p className="text-sm text-muted-foreground">{video.channelName}</p>
				</div>

				{/* Video Description */}
				{video.description && (
					<div className="mb-6 px-4 sm:px-0">
						<h2 className="text-lg font-semibold mb-2">Description</h2>
						<div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
							{video.description}
						</div>
					</div>
				)}

				{/* Purchase Button */}
				<div className="mb-6 px-4 sm:px-0">
					<Link
						href={`/contact?subject=${encodeURIComponent(`Purchase request for video: https://www.youtube.com/watch?v=${video.id}`)}`}
					>
						<Button size="lg" className="text-lg px-8 py-6 font-semibold">
							Purchase Video
						</Button>
					</Link>
				</div>

				{/* Video Info */}
				<div className="border-t pt-6 px-4 sm:px-0">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
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
			<aside className="w-full lg:w-1/3">
				<div className="bg-card border border-border rounded-lg p-4 sm:p-6">
					<h3 className="text-lg font-semibold mb-4">Video Details</h3>
					<div className="space-y-3 text-sm">
						<div>
							<span className="text-muted-foreground block mb-1">Channel</span>
							<span className="text-foreground font-medium">{video.channelName}</span>
						</div>
						<div>
							<span className="text-muted-foreground block mb-1">Published</span>
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
								<span className="text-muted-foreground block mb-1">Location</span>
								<span className="text-foreground">{video.recordingLocation}</span>
							</div>
						)}
					</div>
				</div>
			</aside>
		</div>
	);
}
