import type { CollectionConfig } from 'payload'

// Using Vercel Blob adapter instead of local file storage

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Media',
    plural: 'Media',
  },
  upload: {
    // (optional) Image resizing
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'centre',
      },
      {
        name: 'tablet',
        width: 1024,
        height: undefined,
        position: 'centre',
      },
    ],

    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
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
