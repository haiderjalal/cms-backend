import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'serviceType', 'slug', 'updatedAt'],
  },
  access: {
    read: () => true, // Public read access
  },
  fields: [
    // Basic page information
    {
      name: 'pageTitle',
      type: 'text',
      required: true,
      admin: {
        description: 'The title of the service page (for SEO)',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly identifier for the service page',
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
      name: 'serviceType',
      type: 'select',
      required: true,
      options: [
        { label: 'Phone Repair', value: 'phone' },
        { label: 'Laptop Repair', value: 'laptop' },
        { label: 'Tablet Repair', value: 'tablet' },
        { label: 'Console Repair', value: 'console' },
        { label: 'Data Recovery', value: 'data-recovery' },
      ],
      admin: {
        description: 'Type of repair service',
      },
    },
    
    // Header section
    {
      name: 'headerImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Hero image for the service page',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Main heading for the service page',
      },
    },
    {
      name: 'subtitle',
      type: 'text',
      required: false,
      admin: {
        description: 'Subheading for the service page',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Main description of the service',
      },
    },
    
    // Features section
    {
      name: 'features',
      type: 'array',
      required: true,
      admin: {
        description: 'List of service features or benefits',
      },
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
        },
        {
          name: 'icon',
          type: 'text',
          required: false,
          admin: {
            description: 'Optional icon class for this feature',
          },
        },
      ],
    },
    
    // Service details section
    {
      name: 'serviceDetails',
      type: 'array',
      required: true,
      admin: {
        description: 'Detailed information about the service',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: {
            description: 'Image for this service detail',
          },
        },
        {
          name: 'icon',
          type: 'text',
          required: true,
          admin: {
            description: 'Icon class for this service detail',
          },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: {
            description: 'Title for this service detail',
          },
        },
        {
          name: 'description',
          type: 'richText',
          required: true,
          editor: lexicalEditor({
            features: ({ defaultFeatures }) => [
              ...defaultFeatures,
            ],
          }),
          admin: {
            description: 'Description for this service detail',
          },
        },
      ],
    },
    
    // FAQ section
    {
      name: 'faqs',
      type: 'array',
      required: false,
      admin: {
        description: 'Frequently asked questions about the service',
      },
      fields: [
        {
          name: 'question',
          type: 'text',
          required: true,
          admin: {
            description: 'The question',
          },
        },
        {
          name: 'answer',
          type: 'richText',
          required: true,
          editor: lexicalEditor({
            features: ({ defaultFeatures }) => [
              ...defaultFeatures,
            ],
          }),
          admin: {
            description: 'The answer to the question',
          },
        },
      ],
    },
    
    // Testimonials section
    {
      name: 'testimonials',
      type: 'array',
      required: false,
      admin: {
        description: 'Customer testimonials specific to this service',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: {
            description: 'Customer name',
          },
        },
        {
          name: 'occupation',
          type: 'text',
          required: false,
          admin: {
            description: 'Customer occupation or location',
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: false,
          admin: {
            description: 'Customer image',
          },
        },
        {
          name: 'rating',
          type: 'number',
          required: true,
          min: 1,
          max: 5,
          admin: {
            description: 'Rating from 1-5 stars',
          },
        },
        {
          name: 'text',
          type: 'textarea',
          required: true,
          admin: {
            description: 'Testimonial text',
          },
        },
        {
          name: 'date',
          type: 'date',
          required: false,
          admin: {
            description: 'Date of the testimonial',
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
      ],
    },
    
    // Related services
    {
      name: 'relatedServices',
      type: 'array',
      required: false,
      admin: {
        description: 'Related services to show at the bottom of the page',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: {
            description: 'Title of the related service',
          },
        },
        {
          name: 'slug',
          type: 'text',
          required: true,
          admin: {
            description: 'Slug of the related service page',
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: false,
          admin: {
            description: 'Image for the related service',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          required: false,
          admin: {
            description: 'Brief description of the related service',
          },
        },
      ],
    },
    
    // SEO metadata
    {
      name: 'seo',
      type: 'group',
      required: false,
      admin: {
        description: 'SEO metadata for the service page',
      },
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          required: false,
          admin: {
            description: 'Meta title for SEO (defaults to page title if not provided)',
          },
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          required: false,
          admin: {
            description: 'Meta description for SEO',
          },
        },
        {
          name: 'keywords',
          type: 'array',
          required: false,
          admin: {
            description: 'Keywords for SEO',
          },
          fields: [
            {
              name: 'keyword',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Any data transformations before saving
        return data
      },
    ],
  },
  timestamps: true,
}