'use server';

import { put, del } from '@vercel/blob'

/**
 * Vercel Blob adapter for Payload CMS
 * This adapter handles file uploads to Vercel Blob storage
 */
export async function vercelBlobAdapter() {
  // Check if required environment variables are set
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.warn('BLOB_READ_WRITE_TOKEN is not set. Vercel Blob storage may not work correctly.')
  }

  return {
    upload: async ({
      file,
      filename,
    }: {
      file: { buffer: Buffer; size: number; mimetype: string }
      filename: string
    }) => {
      try {
        // Upload file to Vercel Blob
        const blob = await put(filename, file.buffer, {
          access: 'public',
          contentType: file.mimetype,
        })

        // Return the upload result
        return {
          filename,
          filesize: file.size,
          mimeType: file.mimetype,
          url: blob.url,
        }
      } catch (error) {
        console.error('Error uploading to Vercel Blob:', error)
        throw error
      }
    },
    delete: async (filenameOrUrl: string | string[]) => {
      try {
        // Delete file from Vercel Blob
        await del(filenameOrUrl)
        return
      } catch (error) {
        console.error('Error deleting from Vercel Blob:', error)
        throw error
      }
    },
  }
}
