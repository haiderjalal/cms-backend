# Blog API Integration Guide

This guide provides everything you need to integrate the Payload CMS blog API into your frontend project.

## 📁 Files to Copy to Your Frontend Project

### Core API Files
1. **`src/lib/api.ts`** - TypeScript API utilities (recommended)
2. **`src/app/lib/api.js`** - JavaScript API utilities (alternative)
3. **`src/types/blog.ts`** - TypeScript type definitions
4. **`src/components/blog-examples.tsx`** - React component examples

## 🔧 Environment Setup

Add these environment variables to your frontend project:

```env
# .env.local (for Next.js) or .env
NEXT_PUBLIC_CMS_URL=https://your-cms-domain.com
# or
REACT_APP_CMS_URL=https://your-cms-domain.com
```

## 📚 API Functions Reference

### Core Blog Functions

#### `getBlogs(limit?, page?, sort?)`
Fetch paginated list of published blogs
```typescript
const response = await getBlogs(10, 1, '-publishedDate')
// Returns: BlogResponse with docs, totalPages, etc.
```

#### `getBlogBySlug(slug)`
Fetch a single blog by its slug
```typescript
const blog = await getBlogBySlug('my-blog-post')
// Returns: BlogPost object
```

#### `getBlogById(id)`
Fetch a single blog by its ID
```typescript
const blog = await getBlogById('64f8a1b2c3d4e5f6a7b8c9d0')
// Returns: BlogPost object
```

#### `getFeaturedBlogs(limit?)`
Fetch featured blogs
```typescript
const featuredBlogs = await getFeaturedBlogs(5)
// Returns: BlogPost[]
```

### Filtering Functions

#### `getBlogsByCategory(category, limit?, page?)`
Fetch blogs by category
```typescript
const response = await getBlogsByCategory('Technology', 10, 1)
```

#### `getBlogsByTag(tag, limit?, page?)`
Fetch blogs by tag
```typescript
const response = await getBlogsByTag('React', 10, 1)
```

#### `searchBlogs(query, limit?, page?)`
Search blogs by title and content
```typescript
const response = await searchBlogs('Next.js tutorial', 10, 1)
```

### Utility Functions

#### `getUniqueCategories()`
Get all unique categories from published blogs
```typescript
const categories = await getUniqueCategories()
// Returns: string[]
```

#### `getUniqueTags()`
Get all unique tags from published blogs
```typescript
const tags = await getUniqueTags()
// Returns: string[]
```

#### `getUniqueAuthors()`
Get all unique authors from published blogs
```typescript
const authors = await getUniqueAuthors()
// Returns: Author[]
```

### Helper Functions

#### `getMediaURL(media)`
Get full URL for media files
```typescript
const imageUrl = getMediaURL(blog.featuredImage)
```

#### `getOptimizedMediaURL(media, width?, height?, quality?)`
Get optimized image URL (if your CMS supports it)
```typescript
const optimizedUrl = getOptimizedMediaURL(blog.featuredImage, 800, 400, 85)
```

#### `formatDate(dateString, locale?, options?)`
Format date strings
```typescript
const formattedDate = formatDate(blog.publishedDate)
// Returns: "January 15, 2024"
```

#### `getExcerpt(content, maxLength?)`
Extract text excerpt from rich text content
```typescript
const excerpt = getExcerpt(blog.content, 150)
```

#### `calculateReadingTime(content)`
Calculate estimated reading time
```typescript
const readTime = calculateReadingTime(blog.content)
// Returns: number (minutes)
```

#### `getBlogURL(blog)`
Generate blog URL
```typescript
const blogUrl = getBlogURL(blog)
// Returns: "/blog/my-blog-post"
```

#### `validateBlogData(blog)`
Validate blog data structure
```typescript
const isValid = validateBlogData(blog)
// Returns: boolean
```

## 🏗️ TypeScript Types

### BlogPost Interface
```typescript
interface BlogPost {
  id: string
  title: string
  slug: string
  content: any // Rich text content
  excerpt?: string
  featuredImage?: MediaItem
  author: Author
  publishedDate: string
  readTime?: number
  tags?: Tag[]
  categories?: Category[]
  status: 'draft' | 'published'
  featured?: boolean
  seo?: {
    title?: string
    description?: string
    keywords?: string
  }
  createdAt: string
  updatedAt: string
}
```

### BlogResponse Interface
```typescript
interface BlogResponse {
  docs: BlogPost[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number | null
  nextPage: number | null
}
```

## ⚛️ React Component Examples

### Basic Blog List
```tsx
import { useState, useEffect } from 'react'
import { getBlogs } from '../lib/api'
import type { BlogPost } from '../types/blog'

function BlogList() {
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const response = await getBlogs(10, 1)
        setBlogs(response.docs)
      } catch (error) {
        console.error('Error loading blogs:', error)
      } finally {
        setLoading(false)
      }
    }

    loadBlogs()
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <div>
      {blogs.map(blog => (
        <article key={blog.id}>
          <h2>{blog.title}</h2>
          <p>{blog.excerpt}</p>
          <a href={`/blog/${blog.slug}`}>Read more</a>
        </article>
      ))}
    </div>
  )
}
```

### Blog Detail Page
```tsx
import { useState, useEffect } from 'react'
import { getBlogBySlug } from '../lib/api'
import type { BlogPost } from '../types/blog'

function BlogDetail({ slug }: { slug: string }) {
  const [blog, setBlog] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadBlog = async () => {
      try {
        const blogData = await getBlogBySlug(slug)
        setBlog(blogData)
      } catch (error) {
        console.error('Error loading blog:', error)
      } finally {
        setLoading(false)
      }
    }

    loadBlog()
  }, [slug])

  if (loading) return <div>Loading...</div>
  if (!blog) return <div>Blog not found</div>

  return (
    <article>
      <h1>{blog.title}</h1>
      <div>{/* Render rich text content */}</div>
    </article>
  )
}
```

## 🚀 Next.js Integration

### App Router (app directory)

#### Blog List Page - `app/blog/page.tsx`
```tsx
import { getBlogs } from '@/lib/api'
import BlogCard from '@/components/BlogCard'

export default async function BlogPage() {
  const response = await getBlogs(10, 1)
  
  return (
    <div>
      <h1>Blog Posts</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {response.docs.map(blog => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    </div>
  )
}
```

#### Blog Detail Page - `app/blog/[slug]/page.tsx`
```tsx
import { getBlogBySlug } from '@/lib/api'
import { notFound } from 'next/navigation'

interface Props {
  params: { slug: string }
}

export default async function BlogDetailPage({ params }: Props) {
  try {
    const blog = await getBlogBySlug(params.slug)
    
    return (
      <article>
        <h1>{blog.title}</h1>
        {/* Render blog content */}
      </article>
    )
  } catch (error) {
    notFound()
  }
}
```

### Pages Router (pages directory)

#### Blog List Page - `pages/blog/index.tsx`
```tsx
import { GetStaticProps } from 'next'
import { getBlogs } from '@/lib/api'
import type { BlogPost } from '@/types/blog'

interface Props {
  blogs: BlogPost[]
}

export default function BlogPage({ blogs }: Props) {
  return (
    <div>
      <h1>Blog Posts</h1>
      {blogs.map(blog => (
        <article key={blog.id}>
          <h2>{blog.title}</h2>
          <p>{blog.excerpt}</p>
        </article>
      ))}
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const response = await getBlogs(10, 1)
  
  return {
    props: {
      blogs: response.docs
    },
    revalidate: 60 // Revalidate every minute
  }
}
```

## 🎨 Styling Examples

### Tailwind CSS Classes
```css
/* Blog card */
.blog-card {
  @apply bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow;
}

/* Blog grid */
.blog-grid {
  @apply grid gap-6 md:grid-cols-2 lg:grid-cols-3;
}

/* Blog content */
.blog-content {
  @apply prose prose-lg max-w-none;
}
```

## 🔍 Error Handling

### API Error Handling
```typescript
try {
  const blogs = await getBlogs()
  // Handle success
} catch (error) {
  if (error instanceof Error) {
    console.error('API Error:', error.message)
    // Handle specific error types
    if (error.message.includes('404')) {
      // Handle not found
    } else if (error.message.includes('500')) {
      // Handle server error
    }
  }
}
```

### React Error Boundaries
```tsx
class BlogErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong loading the blog.</div>
    }

    return this.props.children
  }
}
```

## 🔧 Customization

### Custom API Base URL
```typescript
// In your api.ts file, modify the API_URL
const API_URL = process.env.NEXT_PUBLIC_CUSTOM_CMS_URL || 'https://your-cms.com'
```

### Custom Date Formatting
```typescript
// Extend the formatDate function
export function formatDate(dateString: string, format: 'short' | 'long' = 'long') {
  const date = new Date(dateString)
  
  if (format === 'short') {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
```

## 🚨 Important Notes

1. **Environment Variables**: Make sure to set the correct CMS URL in your environment variables
2. **CORS**: Ensure your CMS backend allows requests from your frontend domain
3. **Rich Text Rendering**: You'll need to implement rich text rendering based on your CMS content structure
4. **Image Optimization**: The `getOptimizedMediaURL` function assumes your CMS supports image optimization
5. **Error Handling**: Always implement proper error handling for API calls
6. **Caching**: Consider implementing caching strategies for better performance
7. **SEO**: Use the blog's SEO fields for meta tags in your pages

## 📦 Dependencies

Make sure your frontend project has these dependencies:

```json
{
  "dependencies": {
    "react": "^18.0.0",
    "next": "^14.0.0" // if using Next.js
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "typescript": "^5.0.0"
  }
}
```

This guide provides everything you need to integrate the blog API into your frontend project. Copy the relevant files and follow the examples to get started quickly!