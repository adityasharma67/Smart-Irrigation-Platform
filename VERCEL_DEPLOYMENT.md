# Vercel Deployment Guide

This guide explains how to deploy your Smart Irrigation Platform to Vercel and resolve the NOT_FOUND error.

## Understanding the NOT_FOUND Error

The NOT_FOUND error occurs when:
1. **Hardcoded API URLs**: Frontend components were calling `http://localhost:4000` which doesn't exist in production
2. **Missing Vercel Configuration**: No `vercel.json` to tell Vercel how to route requests
3. **Backend Not Configured**: Express backend wasn't set up as Vercel serverless functions
4. **CORS Issues**: Backend CORS was hardcoded to localhost

## What Was Fixed

### 1. Created `vercel.json`
- Configures Vercel to build the frontend and deploy backend as serverless functions
- Routes `/api/*` requests to the serverless function handler
- Routes all other requests to the frontend

### 2. Created `api/index.js`
- Wraps your Express backend as a Vercel serverless function
- Handles all API routes through a single entry point
- Updated CORS to work in production

### 3. Updated Frontend Components
- Created `frontend/src/config/api.js` for centralized API URL configuration
- Updated all components to use environment variables instead of hardcoded URLs
- Components now use `REACT_APP_API_URL` environment variable

### 4. Updated Backend CORS
- Made CORS configuration dynamic based on environment variables
- Supports both development and production URLs

## Deployment Steps

### Step 1: Set Up Environment Variables in Vercel

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add the following variables:

**For Frontend:**
- `REACT_APP_API_URL` = `https://your-project.vercel.app` (or your API URL)

**For Backend (API):**
- `MONGODB_URI` = Your MongoDB connection string (optional)
- `JWT_SECRET` = A secure random string (generate one!)
- `FRONTEND_URL` = `https://your-project.vercel.app`
- `NODE_ENV` = `production`

### Step 2: Update Build Settings

In Vercel project settings:
- **Root Directory**: Leave empty (or set to project root)
- **Build Command**: `cd frontend && npm run build`
- **Output Directory**: `frontend/build`
- **Install Command**: `npm install` (runs in root, then installs frontend and backend deps)

### Step 3: Deploy

1. Push your code to GitHub/GitLab/Bitbucket
2. Connect the repository to Vercel
3. Vercel will automatically detect the `vercel.json` configuration
4. The deployment will:
   - Build the frontend React app
   - Set up the backend as serverless functions
   - Configure routing

### Step 4: Verify Deployment

After deployment:
1. Visit `https://your-project.vercel.app`
2. Check the browser console for any errors
3. Test API endpoints: `https://your-project.vercel.app/api/health`
4. Try logging in/registering to verify API connectivity

## Alternative: Separate Backend Deployment

If you prefer to deploy the backend separately (e.g., on Railway, Render, or Heroku):

1. Deploy backend to a separate service
2. Set `REACT_APP_API_URL` in Vercel to your backend URL
3. Update backend `FRONTEND_URL` to your Vercel frontend URL
4. Remove the `api/index.js` file and update `vercel.json` to only build the frontend

## Troubleshooting

### Still Getting NOT_FOUND?

1. **Check Environment Variables**: Ensure `REACT_APP_API_URL` is set correctly
2. **Check Build Logs**: Look for errors in Vercel deployment logs
3. **Check API Routes**: Visit `/api/health` to verify backend is working
4. **Check CORS**: Ensure `FRONTEND_URL` matches your actual frontend URL

### API Calls Failing?

1. **Network Tab**: Check browser DevTools Network tab for actual request URLs
2. **CORS Errors**: Update `FRONTEND_URL` in backend environment variables
3. **API Base URL**: Verify `REACT_APP_API_URL` is set correctly

### Build Failing?

1. **Dependencies**: Ensure all dependencies are in `package.json`
2. **Build Command**: Verify build command works locally
3. **Node Version**: Check Vercel is using the correct Node.js version

## Local Development

For local development, create `.env` files:

**`frontend/.env`:**
```
REACT_APP_API_URL=http://localhost:4000
```

**`backend/.env`:**
```
MONGODB_URI=mongodb://localhost:27017/smart-irrigation
JWT_SECRET=your-secret-key
PORT=4000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

Then run:
```bash
# Terminal 1 - Backend
cd backend
npm install
npm start

# Terminal 2 - Frontend
cd frontend
npm install
npm start
```

## Key Concepts

### Why Serverless Functions?

Vercel uses serverless functions instead of traditional servers. Your Express app is wrapped in a serverless function that:
- Starts on first request (cold start)
- Handles requests and routes them through Express
- Scales automatically
- Only runs when needed (cost-effective)

### Environment Variables

- **Frontend**: `REACT_APP_*` prefix is required for React to access them
- **Backend**: Any variable can be accessed via `process.env.*`
- **Build Time**: Frontend env vars are baked into the build
- **Runtime**: Backend env vars are available at runtime

### CORS Configuration

CORS (Cross-Origin Resource Sharing) controls which domains can access your API:
- Development: Allow localhost
- Production: Only allow your frontend domain
- The updated CORS config checks the `Origin` header and allows requests from configured domains

