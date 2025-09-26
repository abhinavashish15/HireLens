# Video Proctoring System - Deployment Guide

This guide will help you deploy the Video Proctoring System to production.

## Architecture

- **Frontend**: Next.js app deployed to Vercel
- **Backend**: Node.js/Express API deployed to Railway/Render/Vercel
- **Database**: MongoDB Atlas (cloud database)

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **MongoDB Atlas Account**: Sign up at [mongodb.com/atlas](https://mongodb.com/atlas)
3. **Railway Account** (for backend): Sign up at [railway.app](https://railway.app)

## Step 1: Set up MongoDB Atlas

1. Create a new cluster on MongoDB Atlas
2. Create a database user
3. Get your connection string
4. Whitelist your IP addresses (or use 0.0.0.0/0 for all IPs)

## Step 2: Deploy Backend to Railway

1. Go to [railway.app](https://railway.app)
2. Create a new project
3. Connect your GitHub repository
4. Select the `backend` folder as the root directory
5. Add environment variables:
   ```
   MONGODB_URI=your-mongodb-connection-string
   JWT_SECRET=your-jwt-secret-key
   NODE_ENV=production
   PORT=5000
   ```
6. Deploy the backend

## Step 3: Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Select the `frontend` folder as the root directory
4. Add environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
   ```
5. Deploy the frontend

## Step 4: Update CORS Settings

Update the backend CORS settings to allow your Vercel domain:

```typescript
// In backend/src/server.ts
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://your-app-name.vercel.app'
  ],
  credentials: true,
};
```

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/video-proctoring
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=production
PORT=5000
```

### Frontend (Vercel Environment Variables)
```
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
```

## Testing the Deployment

1. Visit your Vercel URL
2. Try registering a new interviewer account
3. Create an interview session
4. Test the candidate join flow

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure your backend CORS settings include your Vercel domain
2. **Database Connection**: Verify your MongoDB Atlas connection string
3. **Environment Variables**: Double-check all environment variables are set correctly

### Logs

- **Frontend**: Check Vercel function logs in the Vercel dashboard
- **Backend**: Check Railway deployment logs
- **Database**: Check MongoDB Atlas logs

## Security Considerations

1. **JWT Secret**: Use a strong, random JWT secret
2. **Database**: Use strong passwords and enable IP whitelisting
3. **HTTPS**: Both Vercel and Railway provide HTTPS by default
4. **Environment Variables**: Never commit sensitive data to version control

## Scaling

- **Frontend**: Vercel automatically scales
- **Backend**: Railway can scale based on usage
- **Database**: MongoDB Atlas can be scaled as needed

## Monitoring

- Use Vercel Analytics for frontend monitoring
- Use Railway metrics for backend monitoring
- Use MongoDB Atlas monitoring for database performance
