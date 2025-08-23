// TypeScript interfaces for Blog API
export interface BlogPost {
  id: string
  title: string
  slug: string
  content: {
    root: {
      type: string
      children: {
        type: string
        version: number
        [k: string]: unknown
      }[]
      direction: ('ltr' | 'rtl') | null
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | ''
      indent: number
      version: number
    }
    [k: string]: unknown
  }
  excerpt?: string | null
  featuredImage?: string | MediaItem | null
  author: {
    name: string
    email?: string | null
    bio?: string | null
  }
  publishedDate?: string | null
  readTime?: number | null
  tags?: {
    tag: string
    id?: string | null
  }[] | null
  categories?: {
    category: string
    id?: string | null
  }[] | null
  status: 'draft' | 'published' | 'archived'
  seo?: {
    metaTitle?: string | null
    metaDescription?: string | null
    keywords?: string | null
  }
  updatedAt: string
  createdAt: string
}

export interface MediaItem {
  id: string
  alt: string
  url?: string | null
  thumbnailURL?: string | null
  filename?: string | null
  mimeType?: string | null
  filesize?: number | null
  width?: number | null
  height?: number | null
  focalX?: number | null
  focalY?: number | null
  updatedAt: string
  createdAt: string
}

export interface BlogResponse {
  docs: BlogPost[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage?: number | null
  nextPage?: number | null
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  updatedAt: string
  createdAt: string
}

export interface Tag {
  id: string
  name: string
  slug: string
  description?: string
  updatedAt: string
  createdAt: string
}

export interface Author {
  id: string
  name: string
  email?: string
  bio?: string
  avatar?: MediaItem
  updatedAt: string
  createdAt: string
}

export interface SearchParams {
  query?: string
  category?: string
  tag?: string
  author?: string
  status?: 'draft' | 'published' | 'archived'
  limit?: number
  page?: number
  sort?: string
}

export interface APIError {
  message: string
  status: number
  errors?: any[]
}