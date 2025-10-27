import axios, { AxiosResponse } from 'axios'

interface ApiResponse<T> {
  message: string
  data?: T
  socialPost?: T
  socialPosts?: T[]
  deletedSocialPost?: T
  totalPosts?: number
  filter?: string
}

export interface SocialPost {
  _id: string
  type: 'youtube' | 'instagram' | 'facebook'
  url: string
  embedUrl?: string
  videoId?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateSocialPostData {
  type: 'youtube' | 'instagram' | 'facebook'
  url: string
  embedUrl?: string
  videoId?: string
  isActive?: boolean
}

export interface UpdateSocialPostData {
  type?: 'youtube' | 'instagram' | 'facebook'
  url?: string
  embedUrl?: string
  videoId?: string
  isActive?: boolean
}

export interface GetSocialPostsParams {
  type?: 'youtube' | 'instagram' | 'facebook'
}

class SocialPostsAPI {
  private baseURL: string
  private authToken: string | null = null

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || ''
  }

  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token')
    }
    return this.authToken
  }

  private getAuthHeaders() {
    const token = this.getAuthToken()
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  }

  // Get all social posts
  async getSocialPosts(params?: GetSocialPostsParams): Promise<{
    socialPosts: SocialPost[]
    totalPosts: number
    filter: string
  }> {
    try {
      const queryParams = new URLSearchParams()
      
      if (params?.type) {
        queryParams.append('type', params.type)
      }

      const url = `/api/admin/social-posts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      
      const response: AxiosResponse<ApiResponse<{
        socialPosts: SocialPost[]
        totalPosts: number
        filter: string
      }>> = await axios.get(`${this.baseURL}${url}`, {
        headers: this.getAuthHeaders(),
      })

      return response.data.data!
    } catch (error) {
      console.error('Error fetching social posts:', error)
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || 'Failed to fetch social posts')
      }
      throw new Error('Failed to fetch social posts')
    }
  }

  // Get social post by ID
  async getSocialPostById(id: string): Promise<SocialPost> {
    try {
      const response: AxiosResponse<ApiResponse<SocialPost>> = await axios.get(
        `${this.baseURL}/api/admin/social-posts/${id}`,
        {
          headers: this.getAuthHeaders(),
        }
      )

      return response.data.data!
    } catch (error) {
      console.error('Error fetching social post:', error)
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || 'Failed to fetch social post')
      }
      throw new Error('Failed to fetch social post')
    }
  }

  // Create new social post
  async createSocialPost(data: CreateSocialPostData): Promise<SocialPost> {
    try {
      const response: AxiosResponse<ApiResponse<SocialPost>> = await axios.post(
        `${this.baseURL}/api/admin/social-posts`,
        data,
        {
          headers: this.getAuthHeaders(),
        }
      )

      return response.data.socialPost!
    } catch (error) {
      console.error('Error creating social post:', error)
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || 'Failed to create social post')
      }
      throw new Error('Failed to create social post')
    }
  }

  // Update social post
  async updateSocialPost(id: string, data: UpdateSocialPostData): Promise<SocialPost> {
    try {
      const response: AxiosResponse<ApiResponse<SocialPost>> = await axios.put(
        `${this.baseURL}/api/admin/social-posts/${id}`,
        data,
        {
          headers: this.getAuthHeaders(),
        }
      )

      return response.data.socialPost!
    } catch (error) {
      console.error('Error updating social post:', error)
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || 'Failed to update social post')
      }
      throw new Error('Failed to update social post')
    }
  }

  // Delete social post
  async deleteSocialPost(id: string): Promise<{ _id: string; type: string; url: string }> {
    try {
      const response: AxiosResponse<ApiResponse<{ _id: string; type: string; url: string }>> = await axios.delete(
        `${this.baseURL}/api/admin/social-posts/${id}`,
        {
          headers: this.getAuthHeaders(),
        }
      )

      return response.data.deletedSocialPost!
    } catch (error) {
      console.error('Error deleting social post:', error)
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || 'Failed to delete social post')
      }
      throw new Error('Failed to delete social post')
    }
  }

  // Toggle social post status
  async toggleSocialPostStatus(id: string): Promise<SocialPost> {
    try {
      const response: AxiosResponse<ApiResponse<SocialPost>> = await axios.put(
        `${this.baseURL}/api/admin/social-posts/${id}/toggle-status`,
        {},
        {
          headers: this.getAuthHeaders(),
        }
      )

      return response.data.socialPost!
    } catch (error) {
      console.error('Error toggling social post status:', error)
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || 'Failed to toggle status')
      }
      throw new Error('Failed to toggle status')
    }
  }
}

// Create and export singleton instance
export const socialPostsAPI = new SocialPostsAPI()

// Public API utility functions
export const PublicSocialPostsAPI = {
  // Get public social posts (active only)
  async getPublicSocialPosts(params?: GetSocialPostsParams): Promise<{
    socialPosts: SocialPost[]
    totalPosts: number
    filter: string
  }> {
    try {
      const queryParams = new URLSearchParams()
      
      if (params?.type) {
        queryParams.append('type', params.type)
      }

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''
      const url = `/public/social-posts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      
      const response: AxiosResponse<ApiResponse<{
        socialPosts: SocialPost[]
        totalPosts: number
        filter: string
      }>> = await axios.get(`${API_BASE_URL}${url}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      return response.data.data!
    } catch (error) {
      console.error('Error fetching public social posts:', error)
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || 'Failed to fetch social posts')
      }
      throw new Error('Failed to fetch social posts')
    }
  }
}

// Export utility functions for easier use
export const SocialPostsAPIUtils = {
  // Platform URL validation patterns
  urlPatterns: {
    youtube: [
      /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+/,
      /^https?:\/\/youtu\.be\/[\w-]+/,
      /^https?:\/\/(www\.)?youtube\.com\/embed\/[\w-]+/
    ],
    instagram: [
      /^https?:\/\/(www\.)?instagram\.com\/p\/[\w-]+/,
      /^https?:\/\/(www\.)?instagram\.com\/reel\/[\w-]+/,
      /^https?:\/\/(www\.)?instagram\.com\/tv\/[\w-]+/
    ],
    facebook: [
      /^https?:\/\/(www\.)?facebook\.com\/[\w.]+\/(posts|videos|reel)\/[\w.]+/,
      /^https?:\/\/(www\.)?facebook\.com\/reel\/[\w.]+/
    ]
  },

  // Validate URL for specific platform
  validatePlatformUrl(type: string, url: string): boolean {
    const patterns = this.urlPatterns[type as keyof typeof this.urlPatterns]
    if (!patterns) return false
    return patterns.some(pattern => pattern.test(url))
  },

  // Extract YouTube video ID from URL
  extractYouTubeVideoId(url: string): string {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
    ]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) return match[1]
    }
    return ''
  },

  // Generate embed URL for YouTube
  generateYouTubeEmbedUrl(url: string): string {
    const videoId = this.extractYouTubeVideoId(url)
    return videoId ? `https://www.youtube.com/embed/${videoId}` : ''
  },

  // Get platform display name
  getPlatformDisplayName(type: string): string {
    const names = {
      youtube: 'YouTube',
      instagram: 'Instagram',
      facebook: 'Facebook'
    }
    return names[type as keyof typeof names] || type
  },

  // Get platform color classes
  getPlatformColors(type: string) {
    const colors = {
      youtube: {
        text: 'text-red-500',
        bg: 'bg-red-50',
        badge: 'bg-red-100 text-red-800',
        border: 'border-red-200'
      },
      instagram: {
        text: 'text-pink-500',
        bg: 'bg-pink-50',
        badge: 'bg-pink-100 text-pink-800',
        border: 'border-pink-200'
      },
      facebook: {
        text: 'text-blue-500',
        bg: 'bg-blue-50',
        badge: 'bg-blue-100 text-blue-800',
        border: 'border-blue-200'
      }
    }
    return colors[type as keyof typeof colors] || {
      text: 'text-gray-500',
      bg: 'bg-gray-50',
      badge: 'bg-gray-100 text-gray-800',
      border: 'border-gray-200'
    }
  }
}

export default socialPostsAPI