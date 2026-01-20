import { getVideoBySlug } from '@/lib/actions'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Navbar from '@/components/Navbar'
import tellme_logo from '@/assets/images/tellme_logo.png'
import { Button } from '@/shadcn_data/components/ui/button'

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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Videos
        </Link>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Main Content */}
        <main className="w-full lg:w-2/3">
          {/* Video Player */}
          <div className="w-full aspect-video bg-black rounded-xl overflow-hidden mb-6">
            <iframe
              src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full border-0"
            />
          </div>

          {/* Video Title */}
          <div className="mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              {video.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              {video.channelName}
            </p>
          </div>

          {/* Video Description */}
          {video.description && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {video.description}
              </div>
            </div>
          )}

          {/* Purchase Button */}
          <div className="mb-6">
            <Link
              href={`/contact?subject=${encodeURIComponent(`Purchase request for video: https://www.youtube.com/watch?v=${video.id}`)}`}
            >
              <Button size="lg" className="text-lg px-8 py-6 font-semibold">
                Purchase Video
              </Button>
            </Link>
          </div>

          {/* Video Info */}
          <div className="border-t pt-6">
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
      </div>
    </>
  )
}
