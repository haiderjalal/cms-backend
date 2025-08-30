import type { BlogPost, BlogResponse, MediaItem } from '../types/blog'

// Use production URL by default, fallback to localhost for development
const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || 
                process.env.NEXT_PUBLIC_CMS_URL || 
                'https://cms-backend-v26v.onrender.com'

interface FetchOptions extends RequestInit {
  cache?: RequestCache
}

interface BlogQueryOptions {
  status?: 'draft' | 'published' | 'archived'
  sort?: string
  depth?: number
}

// Generic API fetch function with improved error handling
async function fetchAPI<T = any>(endpoint: string, options: FetchOptions = {}): Promise<T | null> {
  const url = `${API_URL}/api${endpoint}`
  
  const config: FetchOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
    // Add cache control for better performance
    cache: 'no-store', // For dynamic content
    ...options,
  }

  try {
    const response = await fetch(url, config)
    
    if (!response.ok) {
      console.warn(`CMS Backend Error: ${response.status} ${response.statusText} - URL: ${url}`)
      
      if (response.status === 404) {
        console.warn('Resource not found. Check if the endpoint exists.')
        return null
      }
      
      if (response.status === 500) {
        console.warn('CMS Backend is experiencing internal server errors. Please check backend deployment and environment variables.')
      }
      
      // Try to get error details from response
      let errorDetails = ''
      try {
        const errorData = await response.json()
        errorDetails = errorData.message || errorData.error || ''
      } catch (e) {
        // Ignore JSON parsing errors
      }
      
      throw new Error(`API Error: ${response.status} ${response.statusText}${errorDetails ? ` - ${errorDetails}` : ''}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('API fetch error:', error)
    
    // For network errors, return null instead of empty data structure
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.info('Network error: CMS backend is unreachable')
      return null
    }
    
    // Re-throw other errors
    throw error
  }
}

// Fetch all published blogs with improved query parameters
export async function getBlogs(
  limit: number = 10, 
  page: number = 1, 
  options: BlogQueryOptions = {}
): Promise<BlogResponse> {
  try {
    const {
      status = 'published',
      sort = '-publishedDate',
      depth = 1
    } = options
    
    const queryParams = new URLSearchParams({
      'where[status][equals]': status,
      limit: limit.toString(),
      page: page.toString(),
      sort,
      depth: depth.toString()
    })
    
    const data = await fetchAPI<BlogResponse>(`/blog?${queryParams.toString()}`)
    
    if (!data) {
      return { 
        docs: [], 
        totalDocs: 0, 
        totalPages: 0, 
        page: 1, 
        limit,
        pagingCounter: 1,
        hasPrevPage: false,
        hasNextPage: false,
        prevPage: null,
        nextPage: null
      }
    }
    
    return data
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return { 
      docs: [], 
      totalDocs: 0, 
      totalPages: 0, 
      page: 1, 
      limit,
      pagingCounter: 1,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null
    }
  }
}

// Fetch a single blog by slug
export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  try {
    if (!slug) {
      console.warn('getBlogBySlug: slug parameter is required')
      return null
    }
    
    const queryParams = new URLSearchParams({
      'where[slug][equals]': slug,
      'where[status][equals]': 'published',
      depth: '2'
    })
    
    const data = await fetchAPI<BlogResponse>(`/blog?${queryParams.toString()}`)
    
    if (!data || !data.docs || data.docs.length === 0) {
      return null
    }
    
    return data.docs[0]
  } catch (error) {
    console.error('Error fetching blog by slug:', error)
    return null
  }
}

// Fetch a single blog by ID
export async function getBlogById(id: string): Promise<BlogPost | null> {
  try {
    if (!id) {
      console.warn('getBlogById: id parameter is required')
      return null
    }
    
    const data = await fetchAPI<BlogPost>(`/blog/${id}?depth=2`)
    return data
  } catch (error) {
    console.error('Error fetching blog by ID:', error)
    return null
  }
}

// Fetch featured blogs for homepage
export async function getFeaturedBlogs(limit: number = 3): Promise<BlogPost[]> {
  try {
    const queryParams = new URLSearchParams({
      'where[status][equals]': 'published',
      limit: limit.toString(),
      sort: '-publishedDate',
      depth: '2'
    })
    
    const data = await fetchAPI<BlogResponse>(`/blog?${queryParams.toString()}`)
    
    if (!data || !data.docs) {
      return []
    }
    
    return data.docs
  } catch (error) {
    console.error('Error fetching featured blogs:', error)
    return []
  }
}

// Fetch blogs by category
export async function getBlogsByCategory(
  categorySlug: string, 
  limit: number = 10, 
  page: number = 1
): Promise<BlogResponse> {
  try {
    if (!categorySlug) {
      console.warn('getBlogsByCategory: categorySlug parameter is required')
      return { 
        docs: [], 
        totalDocs: 0, 
        totalPages: 0, 
        page: 1, 
        limit,
        pagingCounter: 1,
        hasPrevPage: false,
        hasNextPage: false,
        prevPage: null,
        nextPage: null
      }
    }
    
    const queryParams = new URLSearchParams({
      'where[categories.category][equals]': categorySlug,
      'where[status][equals]': 'published',
      limit: limit.toString(),
      page: page.toString(),
      sort: '-publishedDate',
      depth: '2'
    })
    
    const data = await fetchAPI<BlogResponse>(`/blog?${queryParams.toString()}`)
    
    if (!data) {
      return { 
        docs: [], 
        totalDocs: 0, 
        totalPages: 0, 
        page: 1, 
        limit,
        pagingCounter: 1,
        hasPrevPage: false,
        hasNextPage: false,
        prevPage: null,
        nextPage: null
      }
    }
    
    return data
  } catch (error) {
    console.error('Error fetching blogs by category:', error)
    return { 
      docs: [], 
      totalDocs: 0, 
      totalPages: 0, 
      page: 1, 
      limit,
      pagingCounter: 1,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null
    }
  }
}

// Fetch blogs by tag
export async function getBlogsByTag(
  tagSlug: string, 
  limit: number = 10, 
  page: number = 1
): Promise<BlogResponse> {
  try {
    if (!tagSlug) {
      console.warn('getBlogsByTag: tagSlug parameter is required')
      return { 
        docs: [], 
        totalDocs: 0, 
        totalPages: 0, 
        page: 1, 
        limit,
        pagingCounter: 1,
        hasPrevPage: false,
        hasNextPage: false,
        prevPage: null,
        nextPage: null
      }
    }
    
    const queryParams = new URLSearchParams({
      'where[tags.tag][equals]': tagSlug,
      'where[status][equals]': 'published',
      limit: limit.toString(),
      page: page.toString(),
      sort: '-publishedDate',
      depth: '2'
    })
    
    const data = await fetchAPI<BlogResponse>(`/blog?${queryParams.toString()}`)
    
    if (!data) {
      return { 
        docs: [], 
        totalDocs: 0, 
        totalPages: 0, 
        page: 1, 
        limit,
        pagingCounter: 1,
        hasPrevPage: false,
        hasNextPage: false,
        prevPage: null,
        nextPage: null
      }
    }
    
    return data
  } catch (error) {
    console.error('Error fetching blogs by tag:', error)
    return { 
      docs: [], 
      totalDocs: 0, 
      totalPages: 0, 
      page: 1, 
      limit,
      pagingCounter: 1,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null
    }
  }
}

// Search blogs with query
export async function searchBlogs(
  query: string, 
  limit: number = 10, 
  page: number = 1
): Promise<BlogResponse> {
  try {
    if (!query || query.trim() === '') {
      console.warn('searchBlogs: query parameter is required')
      return { 
        docs: [], 
        totalDocs: 0, 
        totalPages: 0, 
        page: 1, 
        limit,
        pagingCounter: 1,
        hasPrevPage: false,
        hasNextPage: false,
        prevPage: null,
        nextPage: null
      }
    }
    
    const queryParams = new URLSearchParams({
      'where[or][0][title][contains]': query,
      'where[or][1][excerpt][contains]': query,
      'where[status][equals]': 'published',
      limit: limit.toString(),
      page: page.toString(),
      sort: '-publishedDate',
      depth: '1'
    })
    
    const data = await fetchAPI<BlogResponse>(`/blog?${queryParams.toString()}`)
    
    if (!data) {
      return { 
        docs: [], 
        totalDocs: 0, 
        totalPages: 0, 
        page: 1, 
        limit,
        pagingCounter: 1,
        hasPrevPage: false,
        hasNextPage: false,
        prevPage: null,
        nextPage: null
      }
    }
    
    return data
  } catch (error) {
    console.error('Error searching blogs:', error)
    return { 
      docs: [], 
      totalDocs: 0, 
      totalPages: 0, 
      page: 1, 
      limit,
      pagingCounter: 1,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null
    }
  }
}

// Get unique categories from blog posts
export async function getUniqueCategories(): Promise<string[]> {
  try {
    const data = await fetchAPI<BlogResponse>('/blog?where[status][equals]=published&limit=1000')
    
    if (!data || !data.docs) {
      return []
    }
    
    const categories = new Set<string>()
    data.docs.forEach(blog => {
      if (blog.categories && Array.isArray(blog.categories)) {
        blog.categories.forEach(cat => {
          if (cat.category) {
            categories.add(cat.category)
          }
        })
      }
    })
    
    return Array.from(categories).sort()
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

// Get unique tags from blog posts
export async function getUniqueTags(): Promise<string[]> {
  try {
    const data = await fetchAPI<BlogResponse>('/blog?where[status][equals]=published&limit=1000')
    
    if (!data || !data.docs) {
      return []
    }
    
    const tags = new Set<string>()
    data.docs.forEach(blog => {
      if (blog.tags && Array.isArray(blog.tags)) {
        blog.tags.forEach(tag => {
          if (tag.tag) {
            tags.add(tag.tag)
          }
        })
      }
    })
    
    return Array.from(tags).sort()
  } catch (error) {
    console.error('Error fetching tags:', error)
    return []
  }
}

// Get unique authors from blog posts
export async function getUniqueAuthors(): Promise<string[]> {
  try {
    const data = await fetchAPI<BlogResponse>('/blog?where[status][equals]=published&limit=1000')
    
    if (!data || !data.docs) {
      return []
    }
    
    const authors = new Set<string>()
    data.docs.forEach(blog => {
      if (blog.author && blog.author.name) {
        authors.add(blog.author.name)
      }
    })
    
    return Array.from(authors).sort()
  } catch (error) {
    console.error('Error fetching authors:', error)
    return []
  }
}

// Helper function to get media URL with better handling
export function getMediaURL(media: string | MediaItem | null | undefined): string | null {
  if (!media) return null
  
  // Handle string URLs (media ID or direct URL)
  if (typeof media === 'string') {
    // If it's already a full URL, return as is
    if (media.startsWith('http')) {
      return media
    }
    // If it starts with /, it's a relative path
    if (media.startsWith('/')) {
      return `${API_URL}${media}`
    }
    // Otherwise, assume it's a media ID and construct the URL
    return `${API_URL}/media/${media}`
  }
  
  // Handle media object
  if (typeof media === 'object' && media.url) {
    return media.url.startsWith('http') ? media.url : `${API_URL}${media.url}`
  }
  
  return null
}

// Helper function to get optimized media URL with size parameters
export function getOptimizedMediaURL(
  media: string | MediaItem | null | undefined, 
  width: number | null = null, 
  height: number | null = null, 
  quality: number = 80
): string | null {
  const baseUrl = getMediaURL(media)
  if (!baseUrl) return null
  
  // If it's an external URL, return as is
  if (baseUrl.startsWith('http') && !baseUrl.includes(API_URL)) {
    return baseUrl
  }
  
  // Add optimization parameters for internal media
  const params = new URLSearchParams()
  if (width) params.append('width', width.toString())
  if (height) params.append('height', height.toString())
  if (quality !== 80) params.append('quality', quality.toString())
  
  const queryString = params.toString()
  return queryString ? `${baseUrl}?${queryString}` : baseUrl
}

// Helper function to format date
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return ''
  
  // Use a fixed format that will be consistent between server and client
  // to avoid React hydration errors
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ][date.getMonth()]
  const day = date.getDate()
  
  return `${month} ${day}, ${year}`
}

// Helper function to get excerpt from rich text content with improved text extraction
export function getExcerpt(content: any, maxLength: number = 150): string {
  if (!content) return ''
  
  // If content is rich text (Lexical), extract plain text
  if (typeof content === 'object' && content.root) {
    const extractText = (node: any): string => {
      if (node.type === 'text') {
        return node.text || ''
      }
      if (node.type === 'paragraph' && node.children) {
        return node.children.map(extractText).join('') + ' '
      }
      if (node.children) {
        return node.children.map(extractText).join('')
      }
      return ''
    }
    
    const plainText = content.root.children.map(extractText).join(' ')
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim()
    
    return plainText.length > maxLength 
      ? plainText.substring(0, maxLength).trim() + '...' 
      : plainText
  }
  
  // If content is plain text
  if (typeof content === 'string') {
    const cleanText = content.replace(/\s+/g, ' ').trim()
    return cleanText.length > maxLength 
      ? cleanText.substring(0, maxLength).trim() + '...' 
      : cleanText
  }
  
  return ''
}

// Helper function to calculate reading time
export function calculateReadingTime(content: any): number {
  if (!content) return 1
  
  const text = getExcerpt(content, 10000) // Get full text
  const wordsPerMinute = 200
  const wordCount = text.split(/\s+/).length
  const readingTime = Math.ceil(wordCount / wordsPerMinute)
  
  return Math.max(1, readingTime) // Minimum 1 minute
}

// Helper function to validate blog data
export function validateBlogData(blog: any): blog is BlogPost {
  if (!blog || typeof blog !== 'object') {
    return false
  }
  
  const requiredFields = ['id', 'title', 'slug', 'content', 'status']
  return requiredFields.every(field => 
    blog.hasOwnProperty(field) && 
    blog[field] !== null && 
    blog[field] !== undefined
  )
}

// Helper function to get blog URL
export function getBlogURL(blog: BlogPost | { slug?: string } | null): string {
  if (!blog || !blog.slug) {
    return '#'
  }
  
  return `/blog/${blog.slug}`
}

// Export API_URL for external use
export { API_URL }