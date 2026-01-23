"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import VideoCard from "./video-card"
import VideoSkeleton from "./video-skeleton"
import ErrorState from "./error-state"
import SearchBar from "./search-bar"
import { loadShortsFromJSON, loadVideosFromJSON, searchVideosInDatabase } from "@/lib/actions"
import type { YouTubeVideo } from "@/types/youtube"

interface VideoGridProps {
  onVideoSelect?: (video: YouTubeVideo) => void
}

type FilterType = "videos" | "shorts"

export default function VideoGrid({ onVideoSelect }: VideoGridProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [videos, setVideos] = useState<YouTubeVideo[]>([])
  const [shorts, setShorts] = useState<YouTubeVideo[]>([])
  const [searchResults, setSearchResults] = useState<YouTubeVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  
  // Initialize filter from URL params, default to "videos"
  const urlFilter = searchParams.get("filter") as FilterType | null
  const [filter, setFilter] = useState<FilterType>(urlFilter === "shorts" ? "shorts" : "videos")
  
  // Update filter when URL param changes
  useEffect(() => {
    const urlFilter = searchParams.get("filter") as FilterType | null
    if (urlFilter === "shorts" || urlFilter === "videos") {
      setFilter(urlFilter)
    }
  }, [searchParams])

  const handleVideoSelect = (video: YouTubeVideo) => {
    // Include filter in URL so back button knows where to return
    const filterParam = filter === "shorts" ? "?filter=shorts" : "?filter=videos"
    router.push(`/video/${video.slug}${filterParam}`)
    onVideoSelect?.(video)
  }

  useEffect(() => {
    const loadVideos = async () => {
      try {
        setLoading(true)
        setError(null)

        // Load regular videos and shorts separately
        const [videosData, shortsData] = await Promise.all([
          loadVideosFromJSON(),
          loadShortsFromJSON()
        ])
        
        setVideos(videosData)
        setShorts(shortsData)
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

  const isSearching = searchQuery.trim().length > 0
  
  // When searching, filter results based on current filter selection
  // If filter is "videos", only show videos from search results
  // If filter is "shorts", only show shorts from search results
  let filteredSearchResults: YouTubeVideo[] = []
  if (isSearching) {
    if (filter === "videos") {
      filteredSearchResults = searchResults.filter(video => !video.isShort)
    } else if (filter === "shorts") {
      filteredSearchResults = searchResults.filter(video => video.isShort)
    }
  }
  
  // When searching, use filtered search results; otherwise use loaded videos
  const allRegularVideos = isSearching 
    ? filteredSearchResults
    : videos.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  
  const allShorts = isSearching
    ? filteredSearchResults
    : shorts

  // Apply filter to determine what to display
  const regularVideos = filter === "videos" ? allRegularVideos : []
  const displayedShorts = filter === "shorts" ? allShorts : []

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
      
      {/* Modern Segmented Control */}
      <div className="flex justify-center mb-6 sm:mb-8">
        <div className="inline-flex items-center bg-muted/50 p-1 rounded-lg border border-border shadow-sm">
          <button
            onClick={() => setFilter("videos")}
            className={`
              relative px-6 sm:px-8 py-2 sm:py-2.5 rounded-md text-sm sm:text-base font-medium transition-all duration-200
              ${filter === "videos" 
                ? "bg-primary text-primary-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
              }
            `}
          >
            Videos
          </button>
          <button
            onClick={() => setFilter("shorts")}
            className={`
              relative px-6 sm:px-8 py-2 sm:py-2.5 rounded-md text-sm sm:text-base font-medium transition-all duration-200
              ${filter === "shorts" 
                ? "bg-primary text-primary-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
              }
            `}
          >
            Shorts
          </button>
        </div>
      </div>
      
      {isSearching && (
        <div className="mb-4 text-sm text-muted-foreground">
          {searching ? (
            "Searching..."
          ) : (
            `Found ${filteredSearchResults.length} ${filter === "videos" ? "video" : "short"}${filteredSearchResults.length !== 1 ? 's' : ''} for "${searchQuery}"`
          )}
        </div>
      )}


      {searching ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <VideoSkeleton key={i} />
          ))}
        </div>
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

          {/* Shorts Section - Show when not searching (main page) or when search has shorts */}
          {displayedShorts.length > 0 && (
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-6 sm:mb-8">
                Shorts
              </h2>
              <div className="overflow-x-auto pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6">
                <div className="flex gap-3 sm:gap-4 min-w-max">
                  {displayedShorts.map((video) => (
                    <div key={video.id} className="w-[160px] sm:w-[180px] md:w-[200px] flex-shrink-0">
                      <VideoCard video={video} onClick={() => handleVideoSelect(video)} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Show message if no videos found */}
          {regularVideos.length === 0 && displayedShorts.length === 0 && (
            <ErrorState message={isSearching ? `No videos found for "${searchQuery}"` : "No videos found"} />
          )}
        </>
      )}
    </div>
  )
}
