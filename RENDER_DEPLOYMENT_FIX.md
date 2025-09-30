# 🔧 Render Deployment Fix

## Issue
Render deployment failing with "nodemon: not found" error because it's trying to run the `dev` script instead of `start`.

## Root Cause
- Render was somehow running `npm run dev` instead of `npm start`
- `nodemon` is only in devDependencies, not available in production
- Missing production dependencies for TypeScript execution

## ✅ Fixes Applied

### 1. Updated package.json
- Moved `ts-node` and `tsconfig-paths` from devDependencies to dependencies
- Added `start:prod` script for explicit production mode
- Kept `nodemon` in devDependencies (only needed for local development)

### 2. Updated render.yaml
- Added explicit `rootDir: backend`
- Changed build command to `npm ci --production=false` (installs all deps)
- Kept start command as `npm start`

### 3. Added Procfile
- Created `backend/Procfile` with `web: npm start` as backup

## 🚀 Deployment Steps (Updated)

### Option 1: Use render.yaml (Recommended)
1. Push your changes to GitHub
2. In Render dashboard, create new web service
3. Connect your repository
4. Render should automatically detect `render.yaml`
5. Verify settings:
   - Root Directory: `backend`
   - Build Command: `npm ci --production=false`
   - Start Command: `npm start`

### Option 2: Manual Configuration
If render.yaml doesn't work, configure manually:
1. Root Directory: `backend`
2. Environment: `Node`
3. Build Command: `npm ci --production=false`
4. Start Command: `npm start`
5. Plan: `Free`

### Environment Variables
Add these in Render dashboard:
```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/video-proctoring
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters
FRONTEND_URL=https://placeholder.vercel.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🔍 Troubleshooting

### If still getting "nodemon not found":
1. Check that Render is using the correct root directory (`backend`)
2. Verify the start command is `npm start` not `npm run dev`
3. Clear Render's build cache and redeploy
4. Check the deployment logs for the exact command being run

### If TypeScript errors occur:
- The required dependencies (`ts-node`, `tsconfig-paths`) are now in dependencies
- The build command installs all dependencies including dev dependencies

### If CORS errors:
- Update `FRONTEND_URL` with your actual Vercel URL after frontend deployment

## 📝 Key Changes Made
1. **backend/package.json**: Moved production-required packages to dependencies
2. **backend/render.yaml**: Added explicit configuration and improved build command
3. **backend/Procfile**: Added as backup configuration method

The deployment should now work correctly! 🎉
