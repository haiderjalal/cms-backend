# Using Turso with Payload CMS

This guide explains how to configure your Payload CMS project to use Turso (SQLite) instead of MongoDB.

## What is Turso?

Turso is a distributed database built on libSQL, which is a fork of SQLite. It's optimized for low query latency and is suitable for global applications. Using Turso with Payload CMS allows you to leverage the simplicity of SQLite with the power of a distributed database system.

## Prerequisites

1. The `@payloadcms/db-sqlite` package is already installed in your project
2. You have a Turso account and database set up
3. You have your Turso URL and authentication token

## Configuration Files

Two configuration files have been created to help you switch between MongoDB and Turso:

1. `src/payload.config.ts` - The original configuration using MongoDB
2. `src/payload.config.turso.ts` - The new configuration using Turso

## How to Switch to Turso

### Option 1: Run the Switch Script

A script has been created to help you switch to Turso:

```bash
node switch-to-turso.js
```

This script will:
- Update your `.env.local` file to use Turso
- Provide instructions for updating your `package.json`

### Option 2: Manual Configuration

1. Update your `.env.local` file:
   - Comment out the MongoDB connection string
   - Add `DATABASE_ADAPTER=sqlite`
   - Ensure `TURSO_URL` and `TURSO_AUTH_TOKEN` are set correctly

2. Update your `package.json` scripts to use the Turso configuration:
   ```json
   "dev": "cross-env PAYLOAD_CONFIG_PATH=src/payload.config.turso.ts payload dev"
   ```

3. Start your server:
   ```bash
   npm run dev
   ```

## Using Your Existing Payload Secret

Yes, you can use your existing Payload secret with Turso. The secret is used for authentication and session management, not for database connectivity. The `secret` field in the Payload configuration is set to use `process.env.PAYLOAD_SECRET` in both configurations.

If you have another project's Payload secret that you want to use, simply set the `PAYLOAD_SECRET` environment variable to that value in your `.env.local` file.

## Notes on Data Migration

- Switching database adapters does not automatically migrate your data
- If you need to migrate data from MongoDB to Turso, you'll need to create a migration script
- The existing migration scripts in this project are for migrating from Turso to MongoDB, not the other way around

## Limitations

- The Point Field is not yet supported in SQLite/Turso
- Some MongoDB-specific features may not be available in SQLite/Turso

## Additional Resources

- [Payload CMS SQLite Documentation](https://payloadcms.com/docs/database/sqlite)
- [How to set up Payload with SQLite and Turso](https://payloadcms.com/posts/guides/how-to-set-up-payload-with-sqlite-and-turso-for-deployment-on-vercel)
- [Turso Documentation](https://docs.turso.tech)