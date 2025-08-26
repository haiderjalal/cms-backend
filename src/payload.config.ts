// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'


import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Blog } from './collections/Blog'
import ServiceBookings from './collections/ServiceBookings'
import { Products } from './collections/Products'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '- Phone Repair CMS'
    },
  },

  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3001',
  
  cors: [
    'http://localhost:3000',             // Next.js development server
    'http://localhost:3001',             // local backend
    'http://localhost:3004',             // frontend port
    'https://phone-repair-rho.vercel.app',  // production frontend domain
    process.env.FRONTEND_URL             // environment variable for frontend URL
  ].filter((url): url is string => Boolean(url)),
  
  csrf: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3004',
    'https://phone-repair-rho.vercel.app',
    process.env.FRONTEND_URL
  ].filter((url): url is string => Boolean(url)),

  collections: [Users, Media, Blog, ServiceBookings, Products],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  
  // File Upload Configuration
  upload: {
    limits: {
      fileSize: 5000000 // 5MB
    }
  },
  

  
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
})
