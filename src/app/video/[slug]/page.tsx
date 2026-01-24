import { getVideoBySlug, loadPlaylistFromJSON, loadShortsFromJSON } from '@/lib/actions'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Navbar from '@/components/Navbar'
import IframeClient from '@/components/IframeClient'
import tellme_logo from '@/assets/images/tellme_logo.png'
import ShortsLayout from '@/components/shorts-layout'
import VideoDetailsFull from '@/components/video-details-full'

type ParamsType = {
  params: Promise<{
    slug: string
  }>
  searchParams: Promise<{
    filter?: string
  }>
}

export async function generateMetadata({ params }: ParamsType) {
  const { slug } = await params
  const video = await getVideoBySlug(decodeURIComponent(slug))
  
  if (!video) {
    return {
      title: 'Video Not Found',
    }
  }

  return {
    title: video.title,
    description: video.description,
    openGraph: {
      title: video.title,
      description: video.description || undefined,
      images: [video.thumbnail],
    },
    twitter: {
      title: video.title,
      description: video.description || undefined,
      images: [video.thumbnail],
    },
  }
}

export default async function VideoPage({ params, searchParams }: ParamsType) {
  const { slug } = await params
  const { filter } = await searchParams
  const video = await getVideoBySlug(decodeURIComponent(slug))

  if (!video) {
    notFound()
  }

  // Determine back button destination based on filter param or video type
  const backFilter = filter === "shorts" ? "shorts" : (video.isShort ? "shorts" : "videos")
  const backHref = `/?filter=${backFilter}`
  const backText = backFilter === "shorts" ? "Back to Shorts" : "Back to Videos"
  const playlistVideos = video.playlistId ? await loadPlaylistFromJSON(video.playlistId) : []
  const embedSrc = video.embedUrl ?? `https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`

  // Load all shorts if this is a short
  let allShorts: Awaited<ReturnType<typeof loadShortsFromJSON>> = []
  if (video.isShort) {
    try {
      allShorts = await loadShortsFromJSON()
    } catch (error) {
      console.error('Error loading shorts:', error)
    }
  }

  return (
    <>
      <Navbar tellme_logo={tellme_logo} />
      <div className={`w-full ${video.isShort ? 'p-0' : 'max-w-6xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-6 sm:py-8 lg:py-10'}`}>
        {/* Back Button */}
        <div className={`${video.isShort ? 'absolute top-24 left-4 z-30 lg:static lg:top-auto lg:left-auto lg:z-auto mb-4 lg:mb-6 lg:ml-6 lg:mt-6' : 'mb-6 sm:mb-8'}`}>
          <Link
            href={backHref}
            className={`inline-flex items-center gap-2 text-sm sm:text-base transition-colors ${
              video.isShort 
                ? 'text-white bg-black/50 hover:bg-black/70 px-3 py-2 rounded-lg backdrop-blur-sm lg:bg-transparent lg:text-muted-foreground lg:hover:text-foreground lg:px-0 lg:py-0 lg:backdrop-blur-none' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            {backText}
          </Link>
        </div>

      {video.isShort ? (
        <ShortsLayout video={video} allShorts={allShorts} />
      ) : (
        <>
          <div
            className={
              playlistVideos.length > 1
                ? 'lg:grid lg:grid-cols-[minmax(0,1fr)_90px] lg:gap-6'
                : 'lg:grid lg:grid-cols-1'
            }
          >
            <div>
              {/* Video Player */}
              <div className="w-full aspect-5/4 sm:aspect-16/10 md:aspect-video bg-black overflow-hidden mb-6 sm:mb-8 lg:mb-10">
                <IframeClient
                  src={embedSrc}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="w-full h-full border-0"
                  frameBorder="0"
                />
              </div>

              {/* Full Video Details - For Regular Videos */}
              <VideoDetailsFull video={video} />
            </div>

            {playlistVideos.length > 1 && (
              <aside className="mt-8 lg:mt-0">
                <div className="rounded-lg border border-border bg-card">
                  <div className="px-4 py-3 border-b border-border">
                    <h3 className="text-sm font-semibold text-foreground">Playlist</h3>
                    <p className="text-xs text-muted-foreground">{playlistVideos.length} videos</p>
                  </div>
                  <div className="max-h-[60vh] overflow-y-auto">
                    {playlistVideos.map((item) => {
                      const isCurrent = item.id === video.id
                      return (
                        <Link
                          key={item.id}
                          href={`/video/${item.slug}?filter=${backFilter}`}
                          className={`flex gap-3 px-4 py-3 border-b border-border last:border-b-0 transition-colors ${
                            isCurrent ? 'bg-muted' : 'hover:bg-muted/60'
                          }`}
                        >
                          <div className="w-16 h-10 rounded bg-black overflow-hidden shrink-0">
                            <img
                              src={item.thumbnail}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className={`text-xs font-medium line-clamp-2 ${isCurrent ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {item.title}
                            </p>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </aside>
            )}
          </div>
        </>
      )}
      </div>
    </>
  )
}
