import { getVideoBySlug, loadShortsFromJSON } from '@/lib/actions'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Navbar from '@/components/Navbar'
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
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 py-6 sm:py-8 lg:py-10 xl:py-12">
        {/* Back Button */}
        <div className="mb-6 sm:mb-8">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            {backText}
          </Link>
        </div>

      {video.isShort ? (
        <ShortsLayout video={video} allShorts={allShorts} />
      ) : (
        <>
          {/* Video Player */}
          <div className="w-full aspect-5/4 sm:aspect-16/10 md:aspect-video bg-black overflow-hidden mb-6 sm:mb-8 lg:mb-10">
            <iframe
              src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full border-0"
            />
          </div>

          {/* Full Video Details - For Regular Videos */}
          <VideoDetailsFull video={video} />
        </>
      )}
      </div>
    </>
  )
}
