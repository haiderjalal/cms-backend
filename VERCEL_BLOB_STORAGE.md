# Vercel Blob Storage Integration

## Overview

This document explains how the CMS is configured to use Vercel Blob Storage for media uploads.

## Configuration

### 1. Environment Variables

The following environment variables are required:

```
BLOB_READ_WRITE_TOKEN="your_vercel_blob_token"
```

You can obtain this token from the Vercel dashboard under Storage > Blob > Connect.

### 2. Adapter Implementation

The Vercel Blob adapter is implemented in `src/adapters/vercelBlobAdapter.ts`. This adapter:

- Uses the `@vercel/blob` package to handle uploads and deletions
- Implements the Payload CMS adapter interface
- Handles file uploads with proper error handling

### 3. Media Collection Configuration

The Media collection in `src/collections/Media.ts` is configured to use the Vercel Blob adapter:

```typescript
import { vercelBlobAdapter } from '../adapters/vercelBlobAdapter'

// Create the adapter instance
const blobAdapterPromise = vercelBlobAdapter()

export const Media: CollectionConfig = {
  // ...
  upload: {
    adapter: blobAdapterPromise,
    // ...
  },
  // ...
}
```

**Important Note**: Since `vercelBlobAdapter()` returns a Promise, we need to create the adapter instance outside the collection configuration and then reference it. We cannot use `await` directly in the collection configuration.

### 4. Next.js Configuration

The `next.config.mjs` file is configured to allow images from Vercel Blob storage:

```javascript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '*.public.blob.vercel-storage.com',
    },
  ],
},
```

## How It Works

1. When a file is uploaded through the CMS, the Vercel Blob adapter handles the upload to Vercel's cloud storage.
2. The file URL is stored in the database and can be accessed through the Media collection.
3. The frontend can display these images using Next.js Image component with the stored URLs.

## Frontend Integration

To display images from Vercel Blob storage in your frontend:

```jsx
import Image from 'next/image'

// Example usage in a component
function MyComponent({ media }) {
  return (
    <Image
      src={media.url}
      alt={media.alt}
      width={media.width}
      height={media.height}
    />
  )
}
```

## Benefits

- **Scalability**: Vercel Blob storage scales automatically with your application
- **Performance**: Files are served from Vercel's global CDN
- **Security**: Secure access control with token-based authentication
- **Integration**: Seamless integration with Next.js and Vercel deployment

## Troubleshooting

- If uploads fail, check that your `BLOB_READ_WRITE_TOKEN` is correctly set
- Ensure the token has the necessary permissions (read/write)
- Check the server logs for detailed error messages from the adapter