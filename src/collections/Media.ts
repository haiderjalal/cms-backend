import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Media',
    plural: 'Media',
  },
  upload: true,
  access: {
    read: () => true, // ✅ anyone can read (needed for frontend)
    
    // For debugging purposes, explicitly check authentication but allow any authenticated user
    create: ({ req }) => {
      // Log authentication info for debugging
      console.log('Media create access check:')
      console.log('- User authenticated:', Boolean(req.user))
      console.log('- User role:', req.user?.role)
      console.log('- User ID:', req.user?.id)
      
      // Allow any authenticated user to create
      return Boolean(req.user)
    },
    
    // For debugging purposes, explicitly check authentication but allow any authenticated user
    update: ({ req }) => {
      // Allow any authenticated user to update
      return Boolean(req.user)
    },
    
    // For debugging purposes, explicitly check authentication but allow any authenticated user
    delete: ({ req }) => {
      // Allow any authenticated user to delete
      return Boolean(req.user)
    },
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
