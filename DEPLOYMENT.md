# Video Proctoring System - Deployment Guide (Render + Vercel)

This guide will help you deploy the Video Proctoring System to production using Render for the backend and Vercel for the frontend.

## Architecture

- **Frontend**: Next.js app deployed to Vercel
- **Backend**: Node.js/Express API deployed to Render
- **Database**: MongoDB Atlas (cloud database)

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Render Account**: Sign up at [render.com](https://render.com)
3. **MongoDB Atlas Account**: Sign up at [mongodb.com/atlas](https://mongodb.com/atlas)
4. **GitHub Account**: For code repository

## Step 1: Set up MongoDB Atlas

1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a new cluster (choose the free M0 tier)
3. Create a database user with read/write permissions
4. Get your connection string (it will look like: `mongodb+srv://username:password@cluster.mongodb.net/video-proctoring`)
5. Whitelist IP addresses (use `0.0.0.0/0` for all IPs, or add specific IPs)

## Step 2: Deploy Backend to Render

1. Go to [render.com](https://render.com)
2. Sign up and connect your GitHub account
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure the service:
   - **Name**: `video-proctoring-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

6. Add Environment Variables:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/video-proctoring
   JWT_SECRET=your-super-secret-jwt-key
   NODE_ENV=production
   PORT=10000
   FRONTEND_URL=https://your-app-name.vercel.app
   ```

7. Click "Create Web Service"
8. Wait for deployment to complete
9. Note your Render URL (e.g., `https://video-proctoring-backend.onrender.com`)

## Step 3: Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up and connect your GitHub account
3. Click "New Project"
4. Import your GitHub repository
5. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

6. Add Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://video-proctoring-backend.onrender.com
   ```

7. Click "Deploy"
8. Wait for deployment to complete
9. Note your Vercel URL (e.g., `https://video-proctoring.vercel.app`)

## Step 4: Update Backend CORS Settings

1. Go back to your Render dashboard
2. Open your backend service
3. Go to "Environment" tab
4. Update the `FRONTEND_URL` environment variable with your Vercel URL:
   ```
   FRONTEND_URL=https://video-proctoring.vercel.app
   ```
5. Click "Save Changes"
6. The service will automatically redeploy

## Step 5: Test Your Deployment

1. Visit your Vercel URL
2. Try registering a new interviewer account
3. Create an interview session
4. Test the candidate join flow
5. Verify that the video calling works

## Environment Variables Summary

### Backend (Render)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/video-proctoring
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://your-app-name.vercel.app
```

### Frontend (Vercel)
```
NEXT_PUBLIC_API_URL=https://video-proctoring-backend.onrender.com
```

## Render Free Tier Limits

- **750 hours/month** of usage
- **512MB RAM** per service
- **1GB disk space**
- **100GB bandwidth/month**
- **Services sleep after 15 minutes** of inactivity (free tier)

## Troubleshooting

### Common Issues

1. **CORS Errors**: 
   - Make sure `FRONTEND_URL` in Render matches your Vercel URL exactly
   - Check that the URL includes `https://`

2. **Database Connection**: 
   - Verify your MongoDB Atlas connection string
   - Check that your IP is whitelisted in MongoDB Atlas

3. **Environment Variables**: 
   - Double-check all environment variables are set correctly
   - Make sure there are no extra spaces or quotes

4. **Build Failures**: 
   - Check the build logs in Render dashboard
   - Ensure all dependencies are in package.json

### Logs

- **Frontend**: Check Vercel function logs in the Vercel dashboard
- **Backend**: Check Render deployment logs
- **Database**: Check MongoDB Atlas logs

## Security Considerations

1. **JWT Secret**: Use a strong, random JWT secret (at least 32 characters)
2. **Database**: Use strong passwords and enable IP whitelisting
3. **HTTPS**: Both Vercel and Render provide HTTPS by default
4. **Environment Variables**: Never commit sensitive data to version control

## Scaling

- **Frontend**: Vercel automatically scales
- **Backend**: Render can scale based on usage (paid plans)
- **Database**: MongoDB Atlas can be scaled as needed

## Monitoring

- Use Vercel Analytics for frontend monitoring
- Use Render metrics for backend monitoring
- Use MongoDB Atlas monitoring for database performance

## Cost

- **Vercel**: Free for personal projects
- **Render**: Free tier available (750 hours/month)
- **MongoDB Atlas**: Free M0 tier (512MB storage)

## Next Steps

1. Set up monitoring and alerts
2. Configure custom domains (optional)
3. Set up CI/CD for automatic deployments
4. Consider upgrading to paid plans as your usage grows
