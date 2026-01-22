"use client"

export default function VideoSkeleton() {
  return (
    <div className="rounded-lg overflow-hidden bg-card border border-border h-full flex flex-col animate-pulse">
      {/* Thumbnail Skeleton */}
      <div className="w-full aspect-video bg-muted" />

      {/* Content Skeleton */}
      <div className="p-4 flex flex-col flex-1">
        <div className="h-4 bg-muted rounded w-3/4 mb-3" />
        <div className="h-4 bg-muted rounded w-1/2" />
        <div className="h-3 bg-muted rounded w-2/3 mt-auto" />
      </div>

      {/* Button Skeleton */}
      <div className="px-4 pb-4">
        <div className="w-full h-9 bg-muted rounded-md" />
      </div>
    </div>
  )
}
