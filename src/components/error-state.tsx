"use client"

import { AlertCircle } from "lucide-react"

interface ErrorStateProps {
  message: string
}

export default function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 sm:py-16 lg:py-20">
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 sm:p-8 max-w-md w-full text-center">
        <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-destructive mx-auto mb-4" />
        <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">Unable to Load Videos</h3>
        <p className="text-sm sm:text-base text-muted-foreground">{message}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium transition-all duration-200 hover:bg-primary/90"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}
