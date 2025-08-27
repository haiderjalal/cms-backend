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
    read: () => true, // ✅ public can view products
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      admin: { position: 'sidebar' },
      hooks: {
        beforeValidate: [
          ({ value, data, operation }) => {
            if (
              (operation === 'create' || operation === 'update') &&
              (!value || value.trim() === '') &&
              data?.title
            ) {
              return data.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-') // replace spaces & special chars
                .replace(/(^-|-$)/g, '') // remove leading/trailing dashes
            }
            return value
          },
        ],
      },
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'currency',
      type: 'select',
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
      relationTo: 'media',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
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
      required: true,
      options: [
        { label: 'Repair Service', value: 'service' },
        { label: 'Product Sale', value: 'product' },
      ],
    },
    { name: 'estimatedTime', type: 'text' },
    { name: 'warranty', type: 'text' },
    { name: 'isActive', type: 'checkbox', defaultValue: true },
    { name: 'isFeatured', type: 'checkbox', defaultValue: false },
    { name: 'whatsappMessage', type: 'textarea' },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
  ],
}
