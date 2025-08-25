import type { CollectionConfig } from 'payload'

const ServiceBookings: CollectionConfig = {
  slug: 'service-bookings',
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'email', 'phone', 'serviceType', 'createdAt'],
    group: 'Customer Data',
  },
  access: {
    read: () => true,
    create: () => true,
    update: ({ req: { user } }) => {
      // Only authenticated users can update
      return Boolean(user);
    },
    delete: ({ req: { user } }) => {
      // Only authenticated users can delete
      return Boolean(user);
    },
  },
  fields: [
    {
      name: 'fullName',
      type: 'text',
      required: true,
      label: 'Full Name',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      label: 'Email Address',
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
      label: 'Phone Number',
      validate: (val: string | string[] | null | undefined) => {
        if (!val || (Array.isArray(val) && val.length === 0)) return 'Phone number is required';
        const phoneValue = Array.isArray(val) ? val[0] : val;
        if (typeof phoneValue !== 'string') return 'Phone number is required';
        // Basic phone validation
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(phoneValue.replace(/[\s\-\(\)]/g, ''))) {
          return 'Please enter a valid phone number';
        }
        return true;
      },
    },
    {
      name: 'serviceType',
      type: 'select',
      required: true,
      label: 'Service Type',
      options: [
        {
          label: 'Phone Repair',
          value: 'phone-repair',
        },
        {
          label: 'Laptop Repair',
          value: 'laptop-repair',
        },
        {
          label: 'Tablet Repair',
          value: 'tablet-repair',
        },
        {
          label: 'Console Repair',
          value: 'console-repair',
        },
        {
          label: 'Other',
          value: 'other',
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      label: 'Booking Status',
      defaultValue: 'pending',
      options: [
        {
          label: 'Pending',
          value: 'pending',
        },
        {
          label: 'Confirmed',
          value: 'confirmed',
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
          label: 'Cancelled',
          value: 'cancelled',
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Admin Notes',
      admin: {
        description: 'Internal notes for this booking',
        position: 'sidebar',
      },
    },
    {
      name: 'whatsappMessageSent',
      type: 'checkbox',
      label: 'WhatsApp Message Sent',
      defaultValue: false,
      admin: {
        description: 'Indicates if WhatsApp message was successfully sent',
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        // Set creation timestamp for new bookings
        if (operation === 'create') {
          data.createdAt = new Date();
        }
        return data;
      },
    ],
    afterChange: [
      ({ doc, operation }) => {
        // Log new bookings
        if (operation === 'create') {
          console.log(`New service booking created: ${doc.fullName} - ${doc.serviceType}`);
        }
      },
    ],
  },
};

export default ServiceBookings;

// Type definitions for the collection
export interface ServiceBooking {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  serviceType: 'phone-repair' | 'laptop-repair' | 'tablet-repair' | 'console-repair' | 'other';
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  notes?: string;
  whatsappMessageSent: boolean;
  createdAt: string;
  updatedAt: string;
}