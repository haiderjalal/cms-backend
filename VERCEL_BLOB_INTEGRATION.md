# Vercel Blob Storage Integration

## Overview

This project uses Vercel Blob Storage for media uploads in Payload CMS. The integration allows for storing and serving media files through Vercel's Blob service instead of using local file storage.

## Configuration

### Environment Variables

The following environment variable is required for the Vercel Blob integration:

```
BLOB_READ_WRITE_TOKEN="your_vercel_blob_token"
```

You can obtain this token from the Vercel dashboard under your project's settings.

### Payload Configuration

The Vercel Blob storage is configured as a plugin in `payload.config.ts`:

```typescript
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'

export default buildConfig({
  // ... other config
  plugins: [
    // ... other plugins
    vercelBlobStorage({
      enabled: true,
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
})
```

### Media Collection

The Media collection is configured to use the Vercel Blob storage adapter:

```typescript
export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    // Image resizing configuration
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      // ... other sizes
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
  },
  // ... other configuration
}
```

## Version Compatibility

It's important to ensure that the version of `@payloadcms/storage-vercel-blob` matches the version of other Payload packages in your project. If you encounter version mismatch errors, you can install the correct version:

```bash
pnpm add @payloadcms/storage-vercel-blob@<matching_version>
```

## Import Map Generation

After installing or updating the Vercel Blob storage package, you should regenerate the import map:

```bash
npx payload generate:importmap
```

This ensures that the client-side components for the Vercel Blob storage are properly registered.

## Testing the Integration

You can test the integration by uploading files through:

1. The Payload CMS admin interface
2. Direct API calls to `/api/media`

When uploading via the API, remember to include:
- The file in a `multipart/form-data` request
- An `alt` field which is required for media uploads
- Proper authentication (JWT token) if required by your access control settings

## Troubleshooting

### Common Issues

1. **Version Mismatch**: Ensure all Payload packages have matching versions
2. **Missing Import Map**: Run `npx payload generate:importmap` after package installation
3. **Authentication Errors**: Check that you're properly authenticated for API uploads
4. **Missing Required Fields**: Ensure all required fields (like `alt`) are included in upload requests
5. **Invalid Token**: Verify your `BLOB_READ_WRITE_TOKEN` is correct and has proper permissions

### Debugging

Check the server logs for detailed error messages. The Payload CMS debug mode can be enabled in `payload.config.ts` by setting `debug: true`.