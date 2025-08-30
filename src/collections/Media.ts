import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Media',
    plural: 'Media',
  },
  upload: {
    // ✅ Only `staticDir` is valid in Payload v3
    staticDir: 'media',
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
    read: () => true, // ✅ anyone can read (needed for frontend)

    create: ({ req }) => {
      console.log('========== MEDIA UPLOAD DEBUG INFO ==========')
      console.log('- User authenticated:', Boolean(req.user))
      console.log('- User role:', req.user?.role)
      console.log('- User ID:', req.user?.id)
      console.log('- Request method:', req.method)
      console.log('- Environment:', process.env.NODE_ENV)
      console.log('=============================================')

      return Boolean(req.user)
    },

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
