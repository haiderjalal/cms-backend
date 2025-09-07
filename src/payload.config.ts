import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

// Collections
import Media from './collections/Media'
import { Users } from './collections/Users'
import { Blog } from './collections/Blog'
import ServiceBookings from './collections/ServiceBookings'
import { Services } from './collections/Services'
import { Products } from './collections/Products'
import { ContactSubmissions } from './collections/ContactSubmissions'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default buildConfig({
  admin: {
    user: 'users',
    meta: { titleSuffix: '- Phone Repair CMS' },
  },

  debug: process.env.NODE_ENV !== 'production',

  // Public server URL (for generating media URLs)
  serverURL:
    process.env.PAYLOAD_PUBLIC_SERVER_URL ||
    (process.env.NODE_ENV === 'production'
      ? 'https://your-vercel-app-url.vercel.app'
      : 'http://localhost:3000'),

  // Security
  cors: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://phone-repair-rho.vercel.app',
    process.env.FRONTEND_URL,
  ].filter(Boolean) as string[],

  csrf: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://phone-repair-rho.vercel.app',
    process.env.FRONTEND_URL,
  ].filter(Boolean) as string[],

  // Collections
  collections: [Users, Media, Blog, Services, ServiceBookings, Products, ContactSubmissions],

  // Rich text editor
  editor: lexicalEditor(),

  // Secrets & typing
  secret: process.env.PAYLOAD_SECRET || 'supersecret',
  typescript: { outputFile: path.resolve(__dirname, 'payload-types.ts') },

  // Database
  db: mongooseAdapter({ url: process.env.DATABASE_URI || '' }),
  sharp,

  // Global upload settings
  upload: {
    limits: { fileSize: 5_000_000 }, // 5MB
  },

  // Plugins
  plugins: [
    payloadCloudPlugin(),
    vercelBlobStorage({
      enabled: true,
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
})
