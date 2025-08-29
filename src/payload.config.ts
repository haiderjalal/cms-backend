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
import { ContactSubmissions } from './collections/ContactSubmissions'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: '- Phone Repair CMS' },
  },

  // Enable debug mode to see more detailed error messages
  debug: process.env.NODE_ENV !== 'production',

  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000',

  cors: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3004',
    'https://phone-repair-rho.vercel.app',
    process.env.FRONTEND_URL,
  ].filter((url): url is string => Boolean(url)) as string[],

  csrf: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3004',
    'https://phone-repair-rho.vercel.app',
    process.env.FRONTEND_URL,
  ].filter((url): url is string => Boolean(url)) as string[],

  collections: [Users, Media, Blog, ServiceBookings, Products, ContactSubmissions],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'supersecret',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: mongooseAdapter({ url: process.env.DATABASE_URI || '' }),
  sharp,

  plugins: [payloadCloudPlugin()],
})
