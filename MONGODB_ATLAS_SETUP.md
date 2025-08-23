# MongoDB Atlas Setup for Production Deployment

## Step 1: Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account or log in
3. Create a new project (e.g., "Payload CMS")

## Step 2: Create a Database Cluster
1. Click "Build a Database"
2. Choose "M0 Sandbox" (Free tier) or a paid tier based on your needs
3. Select your preferred cloud provider and region
4. Name your cluster (e.g., "payload-cms-cluster")
5. Click "Create Cluster"

## Step 3: Configure Database Access
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create a username and strong password
5. Set database user privileges to "Read and write to any database"
6. Click "Add User"

## Step 4: Configure Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Choose "Allow Access from Anywhere" (0.0.0.0/0) for Render deployment
4. Click "Confirm"

## Step 5: Get Connection String
1. Go to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js" and version "4.1 or later"
5. Copy the connection string
6. Replace `<password>` with your database user password
7. Replace `<database>` with your database name (e.g., "payload-cms")

## Step 6: Configure Environment Variables in Render
1. In your Render dashboard, go to your service
2. Go to "Environment" tab
3. Add the following environment variables:
   - `DATABASE_URI`: Your MongoDB Atlas connection string
   - `PAYLOAD_SECRET`: A secure random string (32+ characters)
   - `NODE_ENV`: production

## Example Connection String Format
```
mongodb+srv://username:password@cluster.mongodb.net/payload-cms?retryWrites=true&w=majority
```

## Security Best Practices
- Use a strong, unique password for your database user
- Generate a secure PAYLOAD_SECRET (use a password generator)
- Regularly rotate your database credentials
- Monitor your database usage and set up alerts

## Troubleshooting
- Ensure your IP address is whitelisted in Network Access
- Verify your username and password are correct
- Check that your connection string format is correct
- Make sure your cluster is running and accessible