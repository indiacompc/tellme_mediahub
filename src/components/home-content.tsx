"use client"

import { useState } from "react"
import VideoGrid from "@/components/video-grid"
import PlayerModal from "@/components/player-modal"
import type { YouTubeVideo } from "@/types/youtube"

export default function HomeContent() {
	const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null)

	return (
		<>
			
			{/* Main Content */ }
			< div className = "max-w-7xl mx-auto px-4 sm:px-4 py-6 sm:py-8 lg:py-12" >
				<VideoGrid onVideoSelect={setSelectedVideo} />
			</div >

		{/* Player Modal */ }
	{ selectedVideo && <PlayerModal video={selectedVideo} onClose={() => setSelectedVideo(null)} /> }
		</>
	)
}
