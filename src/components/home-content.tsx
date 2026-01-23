"use client"

import { Suspense } from "react"
import VideoGrid from "@/components/video-grid"
import VideoSkeleton from "./video-skeleton"

export default function HomeContent() {
	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-4 py-6 sm:py-8 lg:py-12">
			<Suspense fallback={
				<div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
						{Array.from({ length: 12 }).map((_, i) => (
							<VideoSkeleton key={i} />
						))}
					</div>
				</div>
			}>
				<VideoGrid />
			</Suspense>
		</div>
	)
}
