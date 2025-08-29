import type { CollectionConfig } from 'payload'

export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'status', 'submittedAt'],
    group: 'Forms',
  },
  access: {
    read: ({ req }) => Boolean(req.user), // Only authenticated users can read submissions
    create: () => true, // Anyone can create a contact submission
    update: ({ req }) => Boolean(req.user), // Only authenticated users can update
    delete: ({ req }) => Boolean(req.user), // Only authenticated users can delete
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Contact person name',
      },
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      admin: {
        description: 'Contact email address',
      },
    },
    {
      name: 'phoneNumber',
      type: 'text',
      required: true,
      admin: {
        description: 'Contact phone number',
      },
    },
    {
      name: 'company',
      type: 'text',
      admin: {
        description: 'Company name (if provided)',
      },
    },
    {
      name: 'message',
      type: 'textarea',
      admin: {
        description: 'Message content',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: [
        {
          label: 'New',
          value: 'new',
        },
        {
          label: 'In Progress',
          value: 'in-progress',
        },
        {
          label: 'Completed',
          value: 'completed',
        },
        {
          label: 'Archived',
          value: 'archived',
        },
      ],
      admin: {
        description: 'Current status of this contact submission',
      },
    },
    {
      name: 'submittedAt',
      type: 'date',
      required: true,
      admin: {
        description: 'Date and time of submission',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      hooks: {
        beforeChange: [({ operation }) => {
          if (operation === 'create') {
            return new Date();
          }
        }],
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Internal notes about this contact (not visible to customers)',
      },
    },
  ],
  timestamps: true,
}