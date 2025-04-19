import { logger } from '@/lib/logger'
import { tryCatch } from '@/lib/errors'

// Logger instance for the Unsplash API
const unsplashLogger = logger.child('UnsplashAPI')

// Define the Unsplash API access key
// In a real application, this should be stored in an environment variable
const UNSPLASH_ACCESS_KEY = 'your_unsplash_access_key'

// Define the Unsplash API URL
const UNSPLASH_API_URL = 'https://api.unsplash.com'

// Define the Unsplash API endpoints
const ENDPOINTS = {
  RANDOM: '/photos/random',
  SEARCH: '/search/photos',
}

// Define the Unsplash photo interface
export interface UnsplashPhoto {
  id: string
  urls: {
    raw: string
    full: string
    regular: string
    small: string
    thumb: string
  }
  alt_description: string | null
  description: string | null
  user: {
    name: string
    username: string
  }
}

/**
 * Get a random photo from Unsplash
 * @param query Optional search query
 * @param count Number of photos to return (max 30)
 * @returns Array of Unsplash photos or null if error
 */
export async function getRandomPhotos(
  query?: string,
  count: number = 1
): Promise<UnsplashPhoto[] | null> {
  return await tryCatch<UnsplashPhoto[] | null>(async () => {
    const params = new URLSearchParams({
      client_id: UNSPLASH_ACCESS_KEY,
      count: count.toString(),
    })

    if (query) {
      params.append('query', query)
    }

    const response = await fetch(`${UNSPLASH_API_URL}${ENDPOINTS.RANDOM}?${params.toString()}`)

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return Array.isArray(data) ? data : [data]
  }, (error) => {
    unsplashLogger.error('Failed to get random photos from Unsplash', error)
    return null
  })
}

/**
 * Search for photos on Unsplash
 * @param query Search query
 * @param page Page number
 * @param perPage Number of photos per page (max 30)
 * @returns Object with results and pagination info or null if error
 */
export async function searchPhotos(
  query: string,
  page: number = 1,
  perPage: number = 10
): Promise<{ results: UnsplashPhoto[]; total: number; total_pages: number } | null> {
  return await tryCatch<{ results: UnsplashPhoto[]; total: number; total_pages: number } | null>(async () => {
    const params = new URLSearchParams({
      client_id: UNSPLASH_ACCESS_KEY,
      query,
      page: page.toString(),
      per_page: perPage.toString(),
    })

    const response = await fetch(`${UNSPLASH_API_URL}${ENDPOINTS.SEARCH}?${params.toString()}`)

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  }, (error) => {
    unsplashLogger.error('Failed to search photos on Unsplash', error)
    return null
  })
}

/**
 * Get a photo by ID from Unsplash
 * @param id Photo ID
 * @returns Unsplash photo or null if error
 */
export async function getPhotoById(id: string): Promise<UnsplashPhoto | null> {
  return await tryCatch<UnsplashPhoto | null>(async () => {
    const params = new URLSearchParams({
      client_id: UNSPLASH_ACCESS_KEY,
    })

    const response = await fetch(`${UNSPLASH_API_URL}/photos/${id}?${params.toString()}`)

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  }, (error) => {
    unsplashLogger.error('Failed to get photo by ID from Unsplash', error)
    return null
  })
}

/**
 * Create a placeholder image URL using a service like Placeholder.com
 * This is used as a fallback when Unsplash API is not available
 * @param width Image width
 * @param height Image height
 * @param text Optional text to display on the image
 * @returns Placeholder image URL
 */
export function getPlaceholderImage(
  width: number = 800,
  height: number = 600,
  text: string = 'Image'
): string {
  return `https://via.placeholder.com/${width}x${height}?text=${encodeURIComponent(text)}`
}
