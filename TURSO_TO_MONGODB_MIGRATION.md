# Turso to MongoDB Migration Guide

## Overview

This document provides instructions for migrating blog data and media files from a Turso database to MongoDB for use with Payload CMS. The migration process preserves all blog posts and media from the Turso database and maps them to the appropriate schema in MongoDB.

## Prerequisites

1. Node.js installed (v18.x or higher)
2. Access to your Turso database (URL and authentication token)
3. Access to your MongoDB database (connection string)
4. Payload CMS project set up with MongoDB

## Setup

### 1. Install Required Dependencies

First, install the required dependencies for the migration scripts:

```bash
pnpm add @libsql/client mongoose dotenv @vercel/blob
```

### 2. Configure Environment Variables

Create or update your `.env` file with the following variables:

```
# Existing MongoDB connection string
DATABASE_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# Turso database connection details
TURSO_URL=libsql://your-database-name.turso.io
TURSO_AUTH_TOKEN=your-auth-token

# Vercel Blob storage for media files
BLOB_READ_WRITE_TOKEN=your-vercel-blob-token
```

## Migration Process

### 1. Understanding the Data Mapping

#### Blog Posts Mapping

The migration script maps fields from the Turso `posts` collection to the MongoDB `blog` collection:

| Turso (posts)      | MongoDB (blog)           | Notes                                    |
|--------------------|--------------------------|------------------------------------------|
| title              | title                    |                                          |
| slug               | slug                     | Generated from title if not available    |
| content            | content                  | Converted to Lexical editor format       |
| excerpt            | excerpt                  |                                          |
| author_name        | author.name              | Defaults to "Admin" if not available     |
| author_email       | author.email             |                                          |
| author_bio         | author.bio               |                                          |
| published_date     | publishedDate            | Converted to Date object                 |
| read_time          | readTime                 | Defaults to 5 minutes if not available   |
| tags               | tags                     | Converted to array of objects            |
| categories         | categories               | Converted to array of objects            |
| status             | status                   | Mapped to draft/published/archived       |
| meta_title         | seo.metaTitle            |                                          |
| meta_description   | seo.metaDescription      |                                          |
| keywords           | seo.keywords             |                                          |

#### Media Files Mapping

The media migration script maps fields from the Turso `media` collection to the MongoDB `media` collection:

| Turso (media)      | MongoDB (media)         | Notes                                    |
|--------------------|-------------------------|------------------------------------------|
| filename           | filename                |                                          |
| mime_type          | mimeType                |                                          |
| filesize           | filesize                |                                          |
| width              | width                   |                                          |
| height             | height                  |                                          |
| alt                | alt                     | Default to filename if not available     |
| caption            | caption                 |                                          |
| category           | category                | Mapped to Payload categories             |
| url                | url                     | New URL after uploading to Vercel Blob   |
| file_data          | N/A                     | Binary data uploaded to Vercel Blob      |

### 2. Running the Migration

#### Option 1: Automated Migration (Recommended)

For convenience, an automated migration script is provided that runs all the necessary steps in sequence. You can run it using the npm script:

```bash
pnpm run migrate:turso
```

Or directly with Node:

```bash
node scripts/run-migration.js
```

This script will:
1. Run the blog posts migration
2. Run the media files migration
3. Update blog media references
4. Log the results of each step

#### Option 2: Manual Step-by-Step Migration

If you prefer to run each step manually or need more control over the process, you can execute each script individually:

##### Step 1: Blog Posts Migration

Execute the blog posts migration script:

```bash
node scripts/migrate-turso-to-mongodb.js
```

The script will:
1. Connect to both databases
2. Fetch all posts from Turso
3. Map and transform the data to match the MongoDB schema
4. Create new documents or update existing ones in MongoDB
5. Log the results of the migration

##### Step 2: Media Files Migration

Execute the media files migration script:

```bash
node scripts/migrate-turso-media.js
```

The script will:
1. Connect to both databases
2. Fetch all media files from Turso
3. Download the media files from Turso
4. Upload the files to Vercel Blob storage
5. Create new media documents or update existing ones in MongoDB
6. Log the results of the migration

##### Step 3: Update Blog Media References

After migrating both blog posts and media files, run the script to update media references in blog posts:

```bash
node scripts/update-blog-media-references.js
```

The script will:
1. Connect to MongoDB
2. Update featured image references in blog posts to point to the correct media IDs
3. Update media references in Lexical content (images embedded in blog content)
4. Log the results of the update process

## Troubleshooting

### Common Issues

1. **Connection Errors**:
   - Verify your Turso URL and authentication token
   - Check that your MongoDB connection string is correct
   - Ensure network connectivity to both databases

2. **Schema Mapping Errors**:
   - If the script fails on specific posts, check the console output for details
   - You may need to adjust the mapping functions in the script to handle special cases

3. **Content Format Issues**:
   - The script attempts to convert content to Lexical editor format
   - If you encounter issues with content rendering, you may need to manually adjust some posts

4. **Media Migration Issues**:
   - Verify that `BLOB_READ_WRITE_TOKEN` is correctly set for Vercel Blob storage
   - Check how media files are stored in your Turso database (as binary data, URLs, or file paths)
   - Adjust the `downloadMediaFromTurso` function in the media migration script accordingly

## Backup Strategy

Before running the migration in production:

1. **Backup your Turso database**:
   ```bash
   turso db dump your-database-name > turso_backup.sql
   ```

2. **Backup your MongoDB database**:
   - Use MongoDB Atlas backup features if available
   - Or use mongodump:
     ```bash
     mongodump --uri="your-mongodb-connection-string"
     ```

## Post-Migration Verification

After migration, verify that:

1. All posts from Turso are present in MongoDB
2. Content is correctly formatted and displays properly in the Payload CMS admin panel
3. Images and media references are working correctly
4. Media files have been successfully uploaded to Vercel Blob storage

## Additional Notes

- The migration scripts are idempotent - running them multiple times will update existing records rather than creating duplicates
- Posts are matched by slug, so ensure slugs are unique in your Turso database
- Media files are uploaded to Vercel Blob storage and referenced in the MongoDB media collection
- The `update-blog-media-references.js` script automatically updates references to media files in blog posts
- The migration process should be run in this order:
  1. `migrate-turso-to-mongodb.js` - Migrate blog posts
  2. `migrate-turso-media.js` - Migrate media files
  3. `update-blog-media-references.js` - Update media references in blog posts