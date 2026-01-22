"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import VideoCard from "./video-card"
import VideoSkeleton from "./video-skeleton"
import ErrorState from "./error-state"
import SearchBar from "./search-bar"
import { loadVideosFromJSON, searchVideosInDatabase } from "@/lib/actions"
import type { YouTubeVideo } from "@/types/youtube"

interface VideoGridProps {
  onVideoSelect?: (video: YouTubeVideo) => void
}

export default function VideoGrid({ onVideoSelect }: VideoGridProps) {
  const router = useRouter()
  const [videos, setVideos] = useState<YouTubeVideo[]>([])
  const [searchResults, setSearchResults] = useState<YouTubeVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const handleVideoSelect = (video: YouTubeVideo) => {
    router.push(`/video/${video.slug}`)
    onVideoSelect?.(video)
  }

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
  
  // Separate videos into regular videos and shorts
  const regularVideos = sortedVideos.filter(video => !video.isShort)
  const shorts = sortedVideos.filter(video => video.isShort)

  if (loading) {
    return (
      <div>
        <SearchBar onSearch={handleSearch} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <VideoSkeleton key={i} />
          ))}
        </div>
      ) : sortedVideos.length === 0 && isSearching ? (
        <ErrorState message={`No videos found for "${searchQuery}"`} />
      ) : (
        <>
          {/* Regular Videos Section */}
          {regularVideos.length > 0 && (
            <div className="mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-6 sm:mb-8">
                Videos
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {regularVideos.map((video) => (
                  <VideoCard key={video.id} video={video} onClick={() => handleVideoSelect(video)} />
                ))}
              </div>
            </div>
          )}

          {/* Shorts Section */}
          {shorts.length > 0 && (
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-6 sm:mb-8">
                Shorts
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {shorts.map((video) => (
                  <VideoCard key={video.id} video={video} onClick={() => handleVideoSelect(video)} />
                ))}
              </div>
            </div>
          )}

          {/* Show message if no videos in either category when not searching */}
          {!isSearching && regularVideos.length === 0 && shorts.length === 0 && (
            <ErrorState message="No videos found" />
          )}
        </>
      )}
    </div>
  )
}
