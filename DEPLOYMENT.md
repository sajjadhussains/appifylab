# Quick Deployment Checklist

## Pre-Deployment

- [ ] Code is working locally
- [ ] All features tested
- [ ] Environment variables documented
- [ ] Git repository initialized

## MongoDB Atlas

- [ ] Create free account
- [ ] Create cluster (M0 free tier)
- [ ] Create database user
- [ ] Whitelist IP (0.0.0.0/0 for now)
- [ ] Copy connection string
- [ ] Replace `<password>` with actual password
- [ ] Add database name `/appifylab`

## Backend (Render)

- [ ] Add `"start": "node src/server.js"` to package.json
- [ ] Create `.gitignore` (exclude node_modules, .env)
- [ ] Push to GitHub
- [ ] Create Render account
- [ ] New Web Service → Connect GitHub repo
- [ ] Configure: Node, `npm install`, `npm start`
- [ ] Add environment variables:
  - NODE_ENV=production
  - PORT=5001
  - MONGODB_URI=[your Atlas connection string]
  - JWT_SECRET=[random 32+ chars]
  - JWT_EXPIRE=7d
  - FRONTEND_URL=[will update after Vercel]
- [ ] Deploy
- [ ] Copy backend URL: `https://xxx.onrender.com`

## Frontend (Vercel)

- [ ] Update `next.config.ts` with backend domain
- [ ] Create `.env.local` with production API URL
- [ ] Create `.gitignore` (exclude node_modules, .next, .env*)
- [ ] Push to GitHub
- [ ] Create Vercel account
- [ ] New Project → Import GitHub repo
- [ ] Add environment variable:
  - NEXT_PUBLIC_API_URL=https://xxx.onrender.com/api
- [ ] Deploy
- [ ] Copy frontend URL: `https://xxx.vercel.app`

## Post-Deployment

- [ ] Update Render FRONTEND_URL with Vercel URL
- [ ] Wait for Render redeploy
- [ ] Test registration
- [ ] Test login
- [ ] Test create post
- [ ] Test like/comment
- [ ] Test privacy settings
- [ ] Check browser console for errors
- [ ] Check Render logs for backend errors

## Done! 🎉

Your app is live:
- Frontend: https://xxx.vercel.app
- Backend: https://xxx.onrender.com
- Database: MongoDB Atlas

## Important Notes

⚠️ **Render Free Tier**: Service sleeps after 15 min inactivity
⚠️ **First Request**: May take 30 seconds to wake up
⚠️ **MongoDB Free Tier**: 512 MB storage limit
