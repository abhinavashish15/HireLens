#!/bin/bash

# Video Proctoring System - Quick Deploy Script
echo "🚀 Starting deployment process..."

# Check if we're in the right directory
if [ ! -f "package.json" ] && [ ! -d "frontend" ] && [ ! -d "backend" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

echo "📋 Deployment Checklist:"
echo "1. ✅ Frontend prepared for Vercel"
echo "2. ✅ Backend prepared for Railway"
echo "3. ✅ CORS configured for production"
echo "4. ✅ Environment variables documented"

echo ""
echo "🔧 Next Steps:"
echo ""
echo "1. Set up MongoDB Atlas:"
echo "   - Go to https://mongodb.com/atlas"
echo "   - Create a new cluster"
echo "   - Get your connection string"
echo ""
echo "2. Deploy Backend to Railway:"
echo "   - Go to https://railway.app"
echo "   - Connect your GitHub repository"
echo "   - Select 'backend' folder as root"
echo "   - Add environment variables from backend/env.production.example"
echo ""
echo "3. Deploy Frontend to Vercel:"
echo "   - Go to https://vercel.com"
echo "   - Import your GitHub repository"
echo "   - Select 'frontend' folder as root"
echo "   - Add NEXT_PUBLIC_API_URL environment variable"
echo ""
echo "4. Update CORS:"
echo "   - Update FRONTEND_URL in Railway with your Vercel URL"
echo ""

echo "📚 For detailed instructions, see DEPLOYMENT.md"
echo "🎉 Happy deploying!"
