import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const Blog: CollectionConfig = {
  slug: 'blog',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'publishedDate', 'status'],
  },
  access: {
    read: () => true, // Public read access
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'The main title of the blog post',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly version of the title (used in URLs)',
      },
      hooks: {
        beforeValidate: [
          ({ data, operation }) => {
            if (operation === 'create' || operation === 'update') {
              if (data?.title && !data?.slug) {
                data.slug = data.title
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, '-')
                  .replace(/(^-|-$)/g, '')
              }
            }
            return data?.slug
          },
        ],
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
        ],
      }),
      admin: {
        description: 'The main content of the blog post',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: false,
      admin: {
        description: 'Short summary of the blog post (used in previews)',
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description: 'Main image for the blog post',
      },
    },
    {
      name: 'author',
      type: 'group',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          defaultValue: 'Admin',
        },
        {
          name: 'email',
          type: 'email',
          required: false,
        },
        {
          name: 'bio',
          type: 'textarea',
          required: false,
        },
      ],
      admin: {
        description: 'Author information',
      },
    },
    {
      name: 'publishedDate',
      type: 'date',
      required: false,
      defaultValue: () => new Date(),
      admin: {
        description: 'When the blog post was published',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'readTime',
      type: 'number',
      required: false,
      defaultValue: 5,
      admin: {
        description: 'Estimated reading time in minutes',
        step: 1,
      },
    },
    {
      name: 'tags',
      type: 'array',
      required: false,
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
        },
      ],
      admin: {
        description: 'Tags for categorizing the blog post',
      },
    },
    {
      name: 'categories',
      type: 'array',
      required: false,
      fields: [
        {
          name: 'category',
          type: 'text',
          required: true,
        },
      ],
      admin: {
        description: 'Categories for organizing blog posts',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        {
          label: 'Draft',
          value: 'draft',
        },
        {
          label: 'Published',
          value: 'published',
        },
        {
          label: 'Archived',
          value: 'archived',
        },
      ],
      admin: {
        description: 'Publication status of the blog post',
      },
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          required: false,
          admin: {
            description: 'SEO title (if different from main title)',
          },
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          required: false,
          admin: {
            description: 'SEO meta description',
          },
        },
        {
          name: 'keywords',
          type: 'text',
          required: false,
          admin: {
            description: 'SEO keywords (comma-separated)',
          },
        },
      ],
      admin: {
        description: 'SEO settings for the blog post',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        // Auto-generate excerpt from content if not provided
        if (operation === 'create' || operation === 'update') {
          if (!data?.excerpt && data?.content) {
            // Extract text from rich text content for excerpt
            let textContent = ''
            if (typeof data.content === 'object' && data.content.root) {
              const extractText = (node: any): string => {
                if (node.type === 'text') {
                  return node.text || ''
                }
                if (node.children) {
                  return node.children.map(extractText).join('')
                }
                return ''
              }
              textContent = data.content.root.children?.map(extractText).join(' ') || ''
            }
            
            if (textContent) {
              data.excerpt = textContent.substring(0, 200) + (textContent.length > 200 ? '...' : '')
            }
          }
        }
        return data
      },
    ],
  },
  timestamps: true,
}