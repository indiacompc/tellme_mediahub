"use client"

import { useEffect } from "react"
import { X } from "lucide-react"
import type { YouTubeVideo } from "@/types/youtube"

interface PlayerModalProps {
  video: YouTubeVideo
  onClose: () => void
}

export default function PlayerModal({ video, onClose }: PlayerModalProps) {
  useEffect(() => {
    // Close on Escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-lg border border-border w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-background/80 hover:bg-background text-foreground transition-colors duration-200"
            aria-label="Close player"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Player Container */}
        <div className="w-full aspect-video bg-black">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>

        {/* Video Info */}
        <div className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-card-foreground mb-2">{video.title}</h2>
          <p className="text-sm text-muted-foreground mb-4">{video.channelName}</p>
          <p className="text-sm text-muted-foreground line-clamp-3">{video.description}</p>
          <a
            href={`https://www.youtube.com/watch?v=${video.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium transition-all duration-200 hover:bg-primary/90"
          >
            Watch on YouTube
          </a>
        </div>
      </div>
    </div>
  )
}
