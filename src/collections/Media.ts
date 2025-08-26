import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Media',
    plural: 'Media',
  },
  upload: true,
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Alt Text',
      required: true,
      admin: {
        description: 'Alternative text for accessibility and SEO',
      },
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Caption',
      admin: {
        description: 'Optional caption for the image',
      },
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
  access: {
    read: () => true, // Public read access
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  admin: {
    group: 'Media Management',
  },
}
