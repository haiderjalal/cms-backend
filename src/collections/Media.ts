import type { CollectionConfig } from 'payload'

const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Media',
    plural: 'Media',
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  upload: {
    // Optimized image sizes for different use cases
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
        formatOptions: {
          format: 'webp',
          options: { quality: 85 },
        },
      },
      {
        name: 'small',
        width: 800,
        height: 600,
        position: 'centre',
        formatOptions: {
          format: 'webp',
          options: { quality: 85 },
        },
      },
      {
        name: 'medium',
        width: 1200,
        height: 900,
        position: 'centre',
        formatOptions: {
          format: 'webp',
          options: { quality: 80 },
        },
      },
      {
        name: 'large',
        width: 1600,
        height: 1200,
        position: 'centre',
        formatOptions: {
          format: 'webp',
          options: { quality: 75 },
        },
      },
      {
        name: 'hero',
        width: 2400,
        height: 1600,
        position: 'centre',
        formatOptions: {
          format: 'webp',
          options: { quality: 70 },
        },
      },
      {
        name: 'blog-card',
        width: 768,
        height: 432, // 16:9 aspect ratio
        position: 'centre',
        formatOptions: {
          format: 'webp',
          options: { quality: 85 },
        },
      },
      {
        name: 'blog-feature',
        width: 1200,
        height: 675, // 16:9 aspect ratio
        position: 'centre',
        formatOptions: {
          format: 'webp',
          options: { quality: 80 },
        },
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Alt Text',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Caption',
    },
    {
      name: 'credit',
      type: 'text',
      label: 'Credit',
    },
    {
      name: 'category',
      type: 'select',
      label: 'Image Category',
      options: [
        { label: 'Product Images', value: 'products' },
        { label: 'Service Images', value: 'services' },
        { label: 'Gallery', value: 'gallery' },
        { label: 'Blog Images', value: 'blog' },
        { label: 'General', value: 'general' },
      ],
      defaultValue: 'general',
    },
  ],
  admin: {
    group: 'Media Management',
  },
}

export default Media
