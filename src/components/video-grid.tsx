"use client"

import { useEffect, useState } from "react"
import VideoCard from "./video-card"
import VideoSkeleton from "./video-skeleton"
import ErrorState from "./error-state"
import SearchBar from "./search-bar"
import { loadVideosFromJSON, searchVideosInDatabase } from "@/lib/actions"
import type { YouTubeVideo } from "@/types/youtube"

interface VideoGridProps {
  onVideoSelect: (video: YouTubeVideo) => void
}

export default function VideoGrid({ onVideoSelect }: VideoGridProps) {
  const [videos, setVideos] = useState<YouTubeVideo[]>([])
  const [searchResults, setSearchResults] = useState<YouTubeVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const loadVideos = async () => {
      try {
        setLoading(true)
        setError(null)

        const data = await loadVideosFromJSON()
        setVideos(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load videos")
      } finally {
        setLoading(false)
      }
    }

    loadVideos()
  }, [])

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    
    if (!query || query.trim().length === 0) {
      setSearchResults([])
      setSearching(false)
      return
    }

    try {
      setSearching(true)
      setError(null)
      const results = await searchVideosInDatabase(query)
      setSearchResults(results)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to search videos")
      setSearchResults([])
    } finally {
      setSearching(false)
    }
  }

  const getSortedVideos = () => {
    // If searching, return search results
    if (searchQuery.trim().length > 0) {
      return searchResults
    }
    
    // Otherwise, return regular videos sorted by published date (newest first)
    const videosCopy = [...videos]
    return videosCopy.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  }

  const sortedVideos = getSortedVideos()
  const isSearching = searchQuery.trim().length > 0

  if (loading) {
    return (
      <div>
        <SearchBar onSearch={handleSearch} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <VideoSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return <ErrorState message={error} />
  }

  if (videos.length === 0 && !isSearching) {
    return (
      <div>
        <SearchBar onSearch={handleSearch} />
        <ErrorState message="No videos found" />
      </div>
    )
  }

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      
      {isSearching && (
        <div className="mb-4 text-sm text-muted-foreground">
          {searching ? (
            "Searching..."
          ) : (
            `Found ${searchResults.length} result${searchResults.length !== 1 ? 's' : ''} for "${searchQuery}"`
          )}
        </div>
      )}


      {searching ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <VideoSkeleton key={i} />
          ))}
        </div>
      ) : sortedVideos.length === 0 && isSearching ? (
        <ErrorState message={`No videos found for "${searchQuery}"`} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {sortedVideos.map((video) => (
            <VideoCard key={video.id} video={video} onClick={() => onVideoSelect(video)} />
          ))}
        </div>
      )}
    </div>
  )
}
