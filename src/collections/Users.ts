import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true, // Enables login
  access: {
    read: ({ req }) => {
      // Everyone can read themselves, admins can read all
      if (req.user?.role === 'admin') return true
      return {
        id: {
          equals: req.user?.id,
        },
      }
    },
    create: ({ req }) => {
      // For debugging purposes, temporarily allow all authenticated users to create
      // This helps identify if there's an issue with role-based permissions
      return Boolean(req.user) // Any authenticated user can create
    },
    update: ({ req }) => {
      // Admins can update anyone, users can update themselves
      if (req.user?.role === 'admin') return true
      return {
        id: {
          equals: req.user?.id,
        },
      }
    },
    delete: ({ req }) => {
      // Only admins can delete
      return req.user?.role === 'admin'
    },
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'user',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
      ],
    },
  ],
}
