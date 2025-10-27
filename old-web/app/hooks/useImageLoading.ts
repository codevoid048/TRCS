"use client"

import { useState, useEffect } from "react"

export function useImageLoading(imageSrc: string) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (!imageSrc) {
      setIsLoading(false)
      return
    }

    const img = new Image()
    img.crossOrigin = "anonymous"

    img.onload = () => {
      setIsLoading(false)
      setHasError(false)
    }

    img.onerror = () => {
      setIsLoading(false)
      setHasError(true)
    }

    img.src = imageSrc
  }, [imageSrc])

  return { isLoading, hasError }
}
