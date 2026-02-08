# 🔧 Vercel Frontend Fix - Complete Guide

## 🔍 Problem Identified

Your frontend at https://aiblog.scalezix.com is trying to connect to:
- ❌ `https://YOUR_RENDER_URL.onrender.com/api` (placeholder)
- ❌ `https://ai-automation-production-c35e.up.railway.app/api` (old Railway)

**Should connect to:**
- ✅ `https://blogapi.scalezix.com/api` (your AWS backend)

---

## ✅ COMPLETE FIX - Follow These Steps

### Step 1: Update Vercel Environment Variables

1. **Go to Vercel Dashboard:**
   - Open: https://vercel.com/dashboard
   - Login with your account

2. **Select Your Project:**
   - Find and click on your project (likely named `aibloggen` or `aiblogfinal`)

3. **Go to Settings:**
   - Click **Settings** tab
   - Click **Environment Variables** in the left sidebar

4. **Add/Update Environment Variable:**
   - **Key:** `VITE_API_URL`
   - **Value:** `https://blogapi.scalezix.com/api`
   - **Environment:** Check all three: Production, Preview, Development
   - Click **Save**

5. **Screenshot for reference:**
   ```
   Key: VITE_API_URL
   Value: https://blogapi.scalezix.com/api
   ☑ Production
   ☑ Preview  
   ☑ Development
   ```

---

### Step 2: Redeploy Frontend

1. **Go to Deployments Tab:**
   - Click **Deployments** at the top

2. **Find Latest Deployment:**
   - Click the **"..."** menu on the latest deployment
   - Click **"Redeploy"**

3. **IMPORTANT - Uncheck Cache:**
   - **UNCHECK** "Use existing Build Cache"
   - This forces a fresh build with new environment variables

4. **Click "Redeploy"**

5. **Wait for Deployment:**
   - Takes 1-2 minutes
   - Watch for "Deployment Completed" message

---

### Step 3: Verify Fix

1. **Open Your Website:**
   - Go to: https://aiblog.scalezix.com

2. **Open Browser Console:**
   - Press `F12` or right-click → Inspect
   - Go to **Console** tab

3. **Check API URL:**
   - Look for log message: `[API] Using API URL: https://blogapi.scalezix.com/api`
   - Should NOT show Railway or Render URLs

4. **Test Sign Up:**
   - Try to create an account
   - Should work without CORS errors

---

## 🔧 Alternative: Manual Build & Deploy

If Vercel redeploy doesn't work, build locally and push:

### Option A: Build Locally

```bash
# 1. Make sure .env.production is correct
cat .env.production
# Should show: VITE_API_URL=https://blogapi.scalezix.com/api

# 2. Build for production
npm run build

# 3. Test the build locally
npm run preview
# Open http://localhost:4173 and test

# 4. If it works, commit and push
git add .
git commit -m "Fix: Update API URL to AWS backend"
git push origin main
```

### Option B: Force Vercel Rebuild

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Link to your project
vercel link

# Set environment variable
vercel env add VITE_API_URL production
# Enter: https://blogapi.scalezix.com/api

# Trigger deployment
vercel --prod
```

---

## 🎯 Troubleshooting

### Issue: Still showing old API URL after redeploy

**Solution 1: Clear Vercel Cache**
1. Go to Vercel Dashboard
2. Settings → General
3. Scroll to "Build & Development Settings"
4. Click "Clear Cache"
5. Redeploy again

**Solution 2: Delete and Recreate Environment Variable**
1. Delete existing `VITE_API_URL` variable
2. Wait 30 seconds
3. Add it again with correct value
4. Redeploy

**Solution 3: Check if variable is actually set**
1. Go to Deployments
2. Click on latest deployment
3. Click "View Function Logs"
4. Look for environment variables in build logs

### Issue: CORS errors still happening

**This means backend is not configured correctly. Fix on AWS:**

```bash
# SSH into AWS
ssh ec2-user@your-aws-ip

# Navigate to project
cd /home/ec2-user/apps/aibloggen

# Pull latest code
git pull origin main

# Check CORS configuration
cd server
grep -A 15 "allowedOrigins" server.js

# Should show:
# const allowedOrigins = [
#   'https://aiblog.scalezix.com',
#   'https://blogapi.scalezix.com'
# ];

# If not, update server.js and restart PM2
pm2 restart aibloggen-backend
```

### Issue: Affiliate/SuperAdmin pages not loading

**Check routes in App.jsx:**

The routes should be:
- `/affiliate/apply` - Affiliate application
- `/affiliate/login` - Affiliate login
- `/affiliate/dashboard` - Affiliate dashboard
- `/superadmin/login` - SuperAdmin login
- `/superadmin/dashboard` - SuperAdmin dashboard

**If pages are blank, check browser console for errors.**

---

## 📊 Verification Checklist

After fixing, verify:

- [ ] Open https://aiblog.scalezix.com
- [ ] Press F12, check Console
- [ ] Should see: `[API] Using API URL: https://blogapi.scalezix.com/api`
- [ ] Should NOT see Railway or Render URLs
- [ ] Try to sign up - should work
- [ ] Try to login - should work
- [ ] Check https://aiblog.scalezix.com/affiliate/ - should load
- [ ] Check https://aiblog.scalezix.com/superadmin/login - should load
- [ ] No CORS errors in console

---

## 🎯 Expected Console Output (Correct)

```
[API] Environment: production PROD: true
[API] Using API URL: https://blogapi.scalezix.com/api
```

## ❌ Wrong Console Output (Needs Fix)

```
[API] Using API URL: https://YOUR_RENDER_URL.onrender.com/api
[API] Using API URL: https://ai-automation-production-c35e.up.railway.app/api
```

---

## 📞 Quick Commands

```bash
# Check current environment variables on Vercel
vercel env ls

# Pull environment variables
vercel env pull

# Add new environment variable
vercel env add VITE_API_URL production

# Deploy to production
vercel --prod

# Check deployment logs
vercel logs
```

---

## 🔐 Security Note

Make sure your AWS backend has CORS configured for:
- `https://aiblog.scalezix.com` (your main domain)
- `https://blogapi.scalezix.com` (your API domain)

**File:** `server/server.js`
```javascript
const allowedOrigins = [
  'https://aiblog.scalezix.com',
  'https://blogapi.scalezix.com'
];
```

---

## ✅ Success Criteria

Your fix is complete when:

1. ✅ Console shows correct API URL (blogapi.scalezix.com)
2. ✅ No CORS errors
3. ✅ Can sign up/login successfully
4. ✅ Affiliate page loads: https://aiblog.scalezix.com/affiliate/
5. ✅ SuperAdmin page loads: https://aiblog.scalezix.com/superadmin/login
6. ✅ Content generation works (2-4 min, 85-95% human)

---

**Last Updated:** February 7, 2026  
**Frontend:** https://aiblog.scalezix.com  
**Backend:** https://blogapi.scalezix.com/api  
**Repository:** https://github.com/UtarshM/aibloggen
