import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: 'Product',
    plural: 'Products',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'price', 'isActive'],
    group: 'Shop Management',
  },
  access: {
    read: () => true, // Public read access for frontend
    create: ({ req: { user } }) => !!user, // Only authenticated users can create
    update: ({ req: { user } }) => !!user, // Only authenticated users can update
    delete: ({ req: { user } }) => !!user, // Only authenticated users can delete
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Product/Service Title',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'URL Slug',
      admin: {
        position: 'sidebar',
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
            return data
          },
        ],
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
    },
    {
      name: 'price',
      type: 'number',
      label: 'Price',
      required: true,
      min: 0,
    },
    {
      name: 'currency',
      type: 'select',
      label: 'Currency',
      defaultValue: 'USD',
      options: [
        { label: 'USD ($)', value: 'USD' },
        { label: 'EUR (€)', value: 'EUR' },
        { label: 'GBP (£)', value: 'GBP' },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      label: 'Product Image',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      label: 'Category',
      required: true,
      options: [
        { label: 'Phone Repair', value: 'phone-repair' },
        { label: 'Laptop Repair', value: 'laptop-repair' },
        { label: 'Tablet Repair', value: 'tablet-repair' },
        { label: 'Accessories', value: 'accessories' },
        { label: 'Battery Services', value: 'battery-services' },
        { label: 'Water Damage', value: 'water-damage' },
      ],
    },
    {
      name: 'serviceType',
      type: 'select',
      label: 'Service Type',
      required: true,
      options: [
        { label: 'Repair Service', value: 'service' },
        { label: 'Product Sale', value: 'product' },
      ],
    },
    {
      name: 'estimatedTime',
      type: 'text',
      label: 'Estimated Repair Time',
    },
    {
      name: 'warranty',
      type: 'text',
      label: 'Warranty Period',
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Active',
      defaultValue: true,
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      label: 'Featured Product',
      defaultValue: false,
    },
    {
      name: 'whatsappMessage',
      type: 'textarea',
      label: 'Custom WhatsApp Message',
    },
    {
      name: 'sortOrder',
      type: 'number',
      label: 'Sort Order',
      defaultValue: 0,
      admin: {
        description: 'Lower numbers appear first',
      },
    },
  ],
}

// Sample data for initial products (for seeding)
export const sampleProducts = [
  {
    title: 'iPhone Screen Repair',
    description: 'Professional iPhone screen replacement service with genuine parts',
    price: 99.99,
    currency: 'USD',
    category: 'phone-repair',
    serviceType: 'service',
    estimatedTime: '1-2 hours',
    warranty: '90 days',
    isActive: true,
    isFeatured: true,
    sortOrder: 1,
  },
  {
    title: 'Samsung Phone Repair',
    description: 'Expert Samsung device repair services',
    price: 79.99,
    currency: 'USD',
    category: 'phone-repair',
    serviceType: 'service',
    estimatedTime: '1-2 hours',
    warranty: '90 days',
    isActive: true,
    sortOrder: 2,
  },
  {
    title: 'Laptop Screen Repair',
    description: 'Professional laptop screen replacement and repair',
    price: 149.99,
    currency: 'USD',
    category: 'laptop-repair',
    serviceType: 'service',
    estimatedTime: 'Same day',
    warranty: '6 months',
    isActive: true,
    sortOrder: 3,
  },
  {
    title: 'iPad Tablet Repair',
    description: 'iPad and tablet repair services',
    price: 119.99,
    currency: 'USD',
    category: 'tablet-repair',
    serviceType: 'service',
    estimatedTime: '2-3 hours',
    warranty: '90 days',
    isActive: true,
    sortOrder: 4,
  },
  {
    title: 'Phone Battery Replacement',
    description: 'Battery replacement service for all phone models',
    price: 59.99,
    currency: 'USD',
    category: 'battery-services',
    serviceType: 'service',
    estimatedTime: '30 minutes',
    warranty: '6 months',
    isActive: true,
    sortOrder: 5,
  },
  {
    title: 'Phone Cases & Accessories',
    description: 'High-quality phone cases and accessories',
    price: 19.99,
    currency: 'USD',
    category: 'accessories',
    serviceType: 'product',
    warranty: '30 days',
    isActive: true,
    sortOrder: 6,
  },
  {
    title: 'Laptop Keyboard Repair',
    description: 'Laptop keyboard replacement and repair service',
    price: 89.99,
    currency: 'USD',
    category: 'laptop-repair',
    serviceType: 'service',
    estimatedTime: '1-2 hours',
    warranty: '90 days',
    isActive: true,
    sortOrder: 7,
  },
  {
    title: 'Phone Water Damage Repair',
    description: 'Water damage assessment and repair service',
    price: 99.99,
    currency: 'USD',
    category: 'water-damage',
    serviceType: 'service',
    estimatedTime: '24-48 hours',
    warranty: '60 days',
    isActive: true,
    sortOrder: 8,
  },
  {
    title: 'MacBook Repair Service',
    description: 'Comprehensive MacBook repair and maintenance',
    price: 199.99,
    currency: 'USD',
    category: 'laptop-repair',
    serviceType: 'service',
    estimatedTime: 'Same day',
    warranty: '6 months',
    isActive: true,
    isFeatured: true,
    sortOrder: 9,
  },
]