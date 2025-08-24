'use client'

import React, { useState, useEffect } from 'react'
import { 
  getBlogs, 
  getBlogBySlug, 
  getFeaturedBlogs,
  getBlogsByCategory,
  getBlogsByTag,
  searchBlogs,
  getUniqueCategories,
  getUniqueTags,
  getMediaURL,
  getOptimizedMediaURL,
  formatDate,
  getExcerpt,
  calculateReadingTime,
  getBlogURL
} from '../lib/api'
import type { BlogPost, BlogResponse } from '../types/blog'

// Blog List Component
export function BlogList() {
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    loadBlogs()
    loadCategories()
  }, [currentPage, selectedCategory])

  const loadBlogs = async () => {
    try {
      setLoading(true)
      let response: BlogResponse
      
      if (searchQuery) {
        response = await searchBlogs(searchQuery, 10, currentPage)
      } else if (selectedCategory) {
        response = await getBlogsByCategory(selectedCategory, 10, currentPage)
      } else {
        response = await getBlogs(10, currentPage)
      }
      
      setBlogs(response.docs)
      setTotalPages(response.totalPages)
      setError(null)
    } catch (err) {
      setError('Failed to load blogs')
      console.error('Error loading blogs:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const cats = await getUniqueCategories()
      setCategories(cats)
    } catch (err) {
      console.error('Error loading categories:', err)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    await loadBlogs()
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setCurrentPage(1)
    setSearchQuery('')
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-800">{error}</p>
        <button 
          onClick={loadBlogs}
          className="mt-2 text-red-600 hover:text-red-800 underline"
        >
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Search and Filter */}
      <div className="mb-8 space-y-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search blogs..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleCategoryChange('')}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedCategory === '' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedCategory === category 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>

      {blogs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No blogs found.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          
          <span className="px-4 py-2 text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

// Blog Card Component
export function BlogCard({ blog }: { blog: BlogPost }) {
  const featuredImageUrl = getOptimizedMediaURL(blog.featuredImage, 400, 250, 85)
  const excerpt = blog.excerpt || getExcerpt(blog.content, 120)
  const readingTime = blog.readTime || calculateReadingTime(blog.content)
  const blogUrl = getBlogURL(blog)

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {featuredImageUrl && (
        <div className="aspect-video overflow-hidden">
          <img
            src={featuredImageUrl}
            alt={blog.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <span>{formatDate(blog.publishedDate)}</span>
          <span className="mx-2">•</span>
          <span>{readingTime} min read</span>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
          <a href={blogUrl} className="hover:text-blue-600 transition-colors">
            {blog.title}
          </a>
        </h3>
        
        {excerpt && (
          <p className="text-gray-600 mb-4 line-clamp-3">{excerpt}</p>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-sm text-gray-700">{blog.author.name}</span>
          </div>
          
          <a
            href={blogUrl}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
          >
            Read more →
          </a>
        </div>
        
        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-4">
            {blog.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                {tag.tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}

// Featured Blogs Component
export function FeaturedBlogs() {
  const [featuredBlogs, setFeaturedBlogs] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFeaturedBlogs()
  }, [])

  const loadFeaturedBlogs = async () => {
    try {
      const blogs = await getFeaturedBlogs(3)
      setFeaturedBlogs(blogs)
    } catch (err) {
      console.error('Error loading featured blogs:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-200 h-64 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold text-center mb-8">Featured Posts</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {featuredBlogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    </section>
  )
}

// Single Blog Component
export function BlogDetail({ slug }: { slug: string }) {
  const [blog, setBlog] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadBlog()
  }, [slug])

  const loadBlog = async () => {
    try {
      setLoading(true)
      const blogData = await getBlogBySlug(slug)
      setBlog(blogData)
      setError(null)
    } catch (err) {
      setError('Failed to load blog post')
      console.error('Error loading blog:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error || !blog) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error || 'Blog post not found'}</p>
        </div>
      </div>
    )
  }

  const featuredImageUrl = getOptimizedMediaURL(blog.featuredImage, 800, 400, 90)
  const readingTime = blog.readTime || calculateReadingTime(blog.content)

  return (
    <article className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{blog.title}</h1>
        
        <div className="flex items-center text-gray-600 mb-6">
          <span>{blog.author.name}</span>
          <span className="mx-2">•</span>
          <span>{formatDate(blog.publishedDate)}</span>
          <span className="mx-2">•</span>
          <span>{readingTime} min read</span>
        </div>
        
        {featuredImageUrl && (
          <div className="aspect-video overflow-hidden rounded-lg mb-6">
            <img
              src={featuredImageUrl}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </header>

      {/* Content */}
      <div className="prose prose-lg max-w-none">
        {/* Note: You'll need to implement rich text rendering based on your content structure */}
        <div dangerouslySetInnerHTML={{ __html: getExcerpt(blog.content, 5000) }} />
      </div>

      {/* Tags and Categories */}
      <footer className="mt-12 pt-8 border-t border-gray-200">
        {blog.tags && blog.tags.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  {tag.tag}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {blog.categories && blog.categories.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Categories:</h3>
            <div className="flex flex-wrap gap-2">
              {blog.categories.map((category, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                >
                  {category.category}
                </span>
              ))}
            </div>
          </div>
        )}
      </footer>
    </article>
  )
}

// Blog Search Component
export function BlogSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setHasSearched(true)
    
    try {
      const response = await searchBlogs(query.trim())
      setResults(response.docs)
    } catch (err) {
      console.error('Search error:', err)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for blog posts..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {hasSearched && (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            {results.length > 0 
              ? `Found ${results.length} result${results.length === 1 ? '' : 's'} for "${query}"`
              : `No results found for "${query}"`
            }
          </h2>
          
          <div className="space-y-4">
            {results.map((blog) => (
              <div key={blog.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold mb-2">
                  <a href={getBlogURL(blog)} className="text-blue-600 hover:text-blue-800">
                    {blog.title}
                  </a>
                </h3>
                <p className="text-gray-600 mb-2">
                  {blog.excerpt || getExcerpt(blog.content, 150)}
                </p>
                <div className="text-sm text-gray-500">
                  {formatDate(blog.publishedDate)} • {blog.author.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}