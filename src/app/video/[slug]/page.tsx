import { getVideoBySlug } from '@/lib/actions'
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

export default async function VideoPage({ params }: ParamsType) {
  const { slug } = await params
  const video = await getVideoBySlug(decodeURIComponent(slug))

  if (!video) {
    notFound()
  }

  return (
    <>
      <Navbar tellme_logo={tellme_logo} />
      <div className="container mx-auto px-0 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Back Button */}
        <div className="px-4 sm:px-0">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Videos
          </Link>
        </div>

      {video.isShort ? (
        <ShortsLayout video={video} />
      ) : (
        <>
          {/* Video Player */}
          <div className="w-full aspect-5/4 sm:aspect-16/10 lg:aspect-video bg-black overflow-hidden mb-6">
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
