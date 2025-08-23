# Render Deployment Guide for Payload CMS

This guide will walk you through deploying your Payload CMS application to Render.

## Prerequisites

- [x] MongoDB Atlas account and cluster set up
- [x] GitHub repository with your code
- [x] Render account (free tier available)

## Step 1: Prepare Your Repository

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

2. **Verify deployment files are in place**:
   - ✅ `render.yaml` - Render service configuration
   - ✅ `.env.production` - Environment variables template
   - ✅ `MONGODB_ATLAS_SETUP.md` - Database setup guide
   - ✅ Updated `package.json` with production scripts

## Step 2: Set Up MongoDB Atlas

Follow the instructions in `MONGODB_ATLAS_SETUP.md` to:
1. Create a MongoDB Atlas cluster
2. Configure database access and network settings
3. Get your connection string

## Step 3: Deploy to Render

### Option A: Using render.yaml (Recommended)

1. **Connect your repository**:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Blueprint"
   - Connect your GitHub repository
   - Select the repository containing your Payload CMS code

2. **Configure the deployment**:
   - Render will automatically detect the `render.yaml` file
   - Review the configuration:
     - **Service Name**: `payload-cms`
     - **Environment**: `node`
     - **Build Command**: `pnpm install && pnpm build`
     - **Start Command**: `pnpm start`

3. **Set environment variables**:
   - `DATABASE_URI`: Your MongoDB Atlas connection string
   - `PAYLOAD_SECRET`: Generate a secure 32+ character string
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (automatically set by Render)

### Option B: Manual Web Service Creation

1. **Create a new Web Service**:
   - Go to Render Dashboard
   - Click "New" → "Web Service"
   - Connect your GitHub repository

2. **Configure the service**:
   - **Name**: `payload-cms`
   - **Environment**: `Node`
   - **Build Command**: `pnpm install && pnpm build`
   - **Start Command**: `pnpm start`
   - **Node Version**: `20.x` (or latest LTS)

3. **Set environment variables** (same as Option A)

## Step 4: Configure Environment Variables

In your Render service dashboard, add these environment variables:

```bash
# Required
DATABASE_URI=mongodb+srv://username:password@cluster.mongodb.net/database
PAYLOAD_SECRET=your-super-secure-32-character-secret-key
NODE_ENV=production

# Optional (for custom domain)
PAYLOAD_PUBLIC_SERVER_URL=https://your-app.onrender.com
```

### Generate a Secure PAYLOAD_SECRET

Use one of these methods:

```bash
# Method 1: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Method 2: Using OpenSSL
openssl rand -hex 32

# Method 3: Online generator
# Visit: https://generate-secret.vercel.app/32
```

## Step 5: Deploy and Verify

1. **Trigger deployment**:
   - Click "Deploy" in your Render dashboard
   - Monitor the build logs for any errors
   - Build should complete in 2-5 minutes

2. **Verify deployment**:
   - Once deployed, visit your app URL (e.g., `https://your-app.onrender.com`)
   - Navigate to `/admin` to access the Payload admin panel
   - Create your first admin user
   - Test creating a blog post

3. **Test API endpoints**:
   - `GET /api/blogs` - List all blogs
   - `GET /api/blogs/:id` - Get specific blog
   - `GET /api/media` - List media files

## Step 6: Custom Domain (Optional)

1. **Add custom domain in Render**:
   - Go to your service settings
   - Click "Custom Domains"
   - Add your domain
   - Configure DNS records as instructed

2. **Update environment variables**:
   - Set `PAYLOAD_PUBLIC_SERVER_URL` to your custom domain
   - Redeploy the service

## Troubleshooting

### Common Issues

1. **Build fails with memory errors**:
   - Upgrade to a paid Render plan with more memory
   - Or optimize your build process

2. **Database connection errors**:
   - Verify your MongoDB Atlas connection string
   - Ensure IP whitelist includes `0.0.0.0/0`
   - Check username/password are correct

3. **Environment variable issues**:
   - Ensure all required variables are set
   - Check for typos in variable names
   - Verify PAYLOAD_SECRET is 32+ characters

4. **Admin panel not accessible**:
   - Check if `/admin` route is working
   - Verify build completed successfully
   - Check service logs for errors

### Useful Commands

```bash
# Test production build locally
pnpm build:prod
pnpm start:prod

# Check logs in Render dashboard
# Go to your service → Logs tab

# Force redeploy
# Go to your service → Manual Deploy → Deploy Latest Commit
```

## Performance Optimization

1. **Enable caching**:
   - Render automatically caches static assets
   - Consider adding Redis for session storage

2. **Database optimization**:
   - Use MongoDB Atlas indexes for better performance
   - Monitor database usage and upgrade if needed

3. **CDN for media**:
   - Consider using AWS S3 + CloudFront for media files
   - Configure in your Payload config

## Security Checklist

- ✅ Strong PAYLOAD_SECRET (32+ characters)
- ✅ Secure MongoDB Atlas credentials
- ✅ HTTPS enabled (automatic on Render)
- ✅ Environment variables properly set
- ✅ No secrets committed to repository

## Support

- **Render Documentation**: https://render.com/docs
- **Payload CMS Documentation**: https://payloadcms.com/docs
- **MongoDB Atlas Documentation**: https://docs.atlas.mongodb.com

---

🎉 **Congratulations!** Your Payload CMS is now deployed and ready for production use!