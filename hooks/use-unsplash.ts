'use client'

import { useState, useEffect, useCallback } from 'react'
import { getRandomPhotos, searchPhotos, UnsplashPhoto, getPlaceholderImage } from '@/lib/unsplash-api'
import { logger } from '@/lib/logger'

// Logger instance for the useUnsplash hook
const unsplashHookLogger = logger.child('useUnsplash')

interface UseUnsplashOptions {
  query?: string
  count?: number
  initialLoading?: boolean
}

/**
 * Hook for fetching random photos from Unsplash
 */
export function useRandomUnsplash({
  query,
  count = 1,
  initialLoading = true,
}: UseUnsplashOptions = {}) {
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([])
  const [loading, setLoading] = useState(initialLoading)
  const [error, setError] = useState<Error | null>(null)

  const fetchPhotos = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await getRandomPhotos(query, count)
      
      if (result) {
        setPhotos(result)
      } else {
        // If API fails, create placeholder photos
        const placeholders = Array.from({ length: count }, (_, i) => ({
          id: `placeholder-${i}`,
          urls: {
            raw: getPlaceholderImage(1200, 800, query || 'Image'),
            full: getPlaceholderImage(1200, 800, query || 'Image'),
            regular: getPlaceholderImage(800, 600, query || 'Image'),
            small: getPlaceholderImage(400, 300, query || 'Image'),
            thumb: getPlaceholderImage(200, 150, query || 'Image'),
          },
          alt_description: query || 'Placeholder image',
          description: query || 'Placeholder image',
          user: {
            name: 'Placeholder',
            username: 'placeholder',
          },
        })) as UnsplashPhoto[]
        
        setPhotos(placeholders)
        setError(new Error('Failed to fetch photos from Unsplash API'))
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred')
      unsplashHookLogger.error('Error fetching random photos', error)
      setError(error)
    } finally {
      setLoading(false)
    }
  }, [query, count])

  useEffect(() => {
    if (initialLoading) {
      fetchPhotos()
    }
  }, [fetchPhotos, initialLoading])

  return { photos, loading, error, refetch: fetchPhotos }
}

interface UseSearchUnsplashOptions {
  query: string
  page?: number
  perPage?: number
  initialLoading?: boolean
}

/**
 * Hook for searching photos on Unsplash
 */
export function useSearchUnsplash({
  query,
  page = 1,
  perPage = 10,
  initialLoading = true,
}: UseSearchUnsplashOptions) {
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([])
  const [loading, setLoading] = useState(initialLoading)
  const [error, setError] = useState<Error | null>(null)
  const [totalPages, setTotalPages] = useState(0)
  const [totalResults, setTotalResults] = useState(0)

  const fetchPhotos = useCallback(async () => {
    if (!query) {
      setPhotos([])
      setTotalPages(0)
      setTotalResults(0)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await searchPhotos(query, page, perPage)
      
      if (result) {
        setPhotos(result.results)
        setTotalPages(result.total_pages)
        setTotalResults(result.total)
      } else {
        // If API fails, create placeholder photos
        const placeholders = Array.from({ length: perPage }, (_, i) => ({
          id: `placeholder-${i}`,
          urls: {
            raw: getPlaceholderImage(1200, 800, query),
            full: getPlaceholderImage(1200, 800, query),
            regular: getPlaceholderImage(800, 600, query),
            small: getPlaceholderImage(400, 300, query),
            thumb: getPlaceholderImage(200, 150, query),
          },
          alt_description: query,
          description: query,
          user: {
            name: 'Placeholder',
            username: 'placeholder',
          },
        })) as UnsplashPhoto[]
        
        setPhotos(placeholders)
        setTotalPages(1)
        setTotalResults(perPage)
        setError(new Error('Failed to fetch photos from Unsplash API'))
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred')
      unsplashHookLogger.error('Error searching photos', error)
      setError(error)
    } finally {
      setLoading(false)
    }
  }, [query, page, perPage])

  useEffect(() => {
    if (initialLoading && query) {
      fetchPhotos()
    }
  }, [fetchPhotos, initialLoading, query])

  return {
    photos,
    loading,
    error,
    totalPages,
    totalResults,
    refetch: fetchPhotos,
  }
}
