# 🚀 QUICK FIX - Scalezix Production Issues

## 🔴 CRITICAL ISSUES IDENTIFIED

### Issue 1: Frontend Console Error
```
[API] Using API URL: https://YOUR_RENDER_URL.onrender.com/api
```
**Problem:** Frontend is using placeholder URL instead of AWS backend

### Issue 2: CORS Error
```
Access to XMLHttpRequest at 'https://ai-automation-production-c35e.up.railway.app/api/auth/signup' 
from origin 'https://aiblog.scalezix.com' has been blocked by CORS policy
```
**Problem:** Frontend is calling old Railway URL, not AWS

### Issue 3: PM2 Not Running
```
[PM2][ERROR] Process or Namespace aibloggen not found
```
**Problem:** Backend server not running on AWS

### Issue 4: Affiliate & SuperAdmin Pages Not Loading
- https://aiblog.scalezix.com/affiliate/ ❌
- https://aiblog.scalezix.com/superadmin/login ❌

---

## ✅ COMPLETE SOLUTION (5 STEPS)

### STEP 1: Fix Vercel Environment Variable (CRITICAL)

**The Problem:**
Your Vercel deployment doesn't have the `VITE_API_URL` environment variable set, so it's using the fallback placeholder URL from the code.

**The Fix:**

1. **Go to Vercel Dashboard:**
   - Open: https://vercel.com/dashboard
   - Find your project (likely named `aiblogfinal` or `aibloggen`)

2. **Add Environment Variable:**
   - Click on your project
   - Go to **Settings** tab
   - Click **Environment Variables** in left sidebar
   - Click **Add New**
   - Enter:
     ```
     Name: VITE_API_URL
     Value: https://blogapi.scalezix.com/api
     ```
   - Select: **Production**, **Preview**, **Development** (all three)
   - Click **Save**

3. **Force Rebuild:**
   - Go to **Deployments** tab
   - Find the latest deployment
   - Click the **three dots (...)** menu
   - Click **Redeploy**
   - **IMPORTANT:** UNCHECK "Use existing Build Cache"
   - Click **Redeploy**

4. **Wait 2-3 minutes** for deployment to complete

5. **Verify Fix:**
   - Open: https://aiblog.scalezix.com
   - Press F12 (open console)
   - Refresh page
   - Should now see: `[API] Using API URL: https://blogapi.scalezix.com/api`

---

### STEP 2: Start Backend on AWS

**SSH into your AWS server:**
```bash
ssh ec2-user@your-aws-ip
```

**Navigate to project:**
```bash
cd /home/ec2-user/apps/aibloggen
```

**Pull latest code:**
```bash
git pull origin main
```

**Install dependencies:**
```bash
cd server
npm install
```

**Start with PM2:**
```bash
pm2 start server.js --name aibloggen-backend
pm2 save
pm2 logs aibloggen-backend --lines 50
```

**Expected Output:**
```
✅ Server running on http://localhost:3001
✅ MongoDB Atlas connected
✅ AI Services initialized
```

---

### STEP 3: Verify Backend is Running

**Test from AWS server:**
```bash
curl http://localhost:3001/api/health
```

**Expected Response:**
```json
{"status":"ok","timestamp":"2026-02-08T..."}
```

**Test from your computer:**
```bash
curl https://blogapi.scalezix.com/api/health
```

**If this fails, check Nginx configuration (see Step 4)**

---

### STEP 4: Check Nginx Configuration (If Using)

**Check if Nginx is running:**
```bash
sudo systemctl status nginx
```

**If Nginx is running, verify configuration:**
```bash
sudo cat /etc/nginx/sites-available/default | grep -A 20 "blogapi.scalezix.com"
```

**Should see:**
```nginx
server {
    server_name blogapi.scalezix.com;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**If missing or wrong, update it:**
```bash
sudo nano /etc/nginx/sites-available/default
```

**Then restart Nginx:**
```bash
sudo systemctl restart nginx
```

---

### STEP 5: Test Everything

**1. Test Backend Health:**
```bash
curl https://blogapi.scalezix.com/api/health
```

**2. Test Frontend:**
- Open: https://aiblog.scalezix.com
- Press F12 (console)
- Should see: `[API] Using API URL: https://blogapi.scalezix.com/api`

**3. Test Signup:**
- Click "Sign Up"
- Enter email and password
- Should work without CORS errors

**4. Test Affiliate Page:**
- Open: https://aiblog.scalezix.com/affiliate/
- Should load without errors

**5. Test SuperAdmin Page:**
- Open: https://aiblog.scalezix.com/superadmin/login
- Should load without errors

---

## 🔧 Troubleshooting

### Problem: Vercel still showing wrong URL after redeploy

**Solution:**
1. Go to Vercel dashboard
2. Settings → Environment Variables
3. Delete the old `VITE_API_URL` variable
4. Add it again with correct value
5. Redeploy with cache disabled

### Problem: PM2 process crashes immediately

**Check logs:**
```bash
pm2 logs aibloggen-backend --lines 100
```

**Common issues:**

**A. Port 3001 already in use:**
```bash
sudo lsof -i :3001
sudo kill -9 <PID>
pm2 restart aibloggen-backend
```

**B. Missing environment variables:**
```bash
cd /home/ec2-user/apps/aibloggen/server
nano .env
```

Make sure you have:
```bash
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://aiblog.scalezix.com
JWT_SECRET=your-production-secret-here
MONGODB_URI=your-mongodb-connection-string
GOOGLE_AI_KEY=your-google-ai-key
```

**C. Missing dependencies:**
```bash
cd /home/ec2-user/apps/aibloggen/server
rm -rf node_modules
npm install
pm2 restart aibloggen-backend
```

### Problem: CORS errors still happening

**Update CORS in server.js:**
```bash
cd /home/ec2-user/apps/aibloggen/server
nano server.js
```

**Find line ~150 and verify:**
```javascript
const allowedOrigins = [
  'https://aiblog.scalezix.com',
  'https://aiblogfinal.vercel.app',
  'https://blogapi.scalezix.com'
];
```

**Save and restart:**
```bash
pm2 restart aibloggen-backend
```

### Problem: Affiliate/SuperAdmin pages show 404

**This is a Vercel routing issue. Fix with vercel.json:**

The project already has `vercel.json` configured correctly. If pages still don't work:

1. Check Vercel dashboard → Settings → General
2. Verify "Framework Preset" is set to "Vite"
3. Verify "Build Command" is `npm run build`
4. Verify "Output Directory" is `dist`
5. Redeploy

---

## 📋 Quick Commands Cheat Sheet

```bash
# SSH into AWS
ssh ec2-user@your-aws-ip

# Navigate to project
cd /home/ec2-user/apps/aibloggen

# Pull latest code
git pull origin main

# Install dependencies
cd server && npm install

# Start backend
pm2 start server.js --name aibloggen-backend
pm2 save

# Check status
pm2 status

# View logs
pm2 logs aibloggen-backend

# Restart
pm2 restart aibloggen-backend

# Stop
pm2 stop aibloggen-backend

# Delete and start fresh
pm2 delete aibloggen-backend
pm2 start server.js --name aibloggen-backend
pm2 save

# Test backend
curl http://localhost:3001/api/health
curl https://blogapi.scalezix.com/api/health

# Check Nginx
sudo systemctl status nginx
sudo systemctl restart nginx

# Check port usage
sudo lsof -i :3001
```

---

## ✅ Success Checklist

After completing all steps, verify:

- [ ] Vercel environment variable set: `VITE_API_URL=https://blogapi.scalezix.com/api`
- [ ] Vercel redeployed with cache disabled
- [ ] Frontend console shows: `[API] Using API URL: https://blogapi.scalezix.com/api`
- [ ] PM2 shows backend as "online": `pm2 status`
- [ ] Backend health check works: `curl https://blogapi.scalezix.com/api/health`
- [ ] No CORS errors in browser console
- [ ] Can sign up successfully
- [ ] Can login successfully
- [ ] Affiliate page loads: https://aiblog.scalezix.com/affiliate/
- [ ] SuperAdmin page loads: https://aiblog.scalezix.com/superadmin/login
- [ ] Can generate content (2-4 min, 85-95% human)

---

## 🎯 Root Cause Analysis

### Why was the frontend using wrong URL?

**The Code Logic (src/api/client.js):**
```javascript
const API_BASE = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? 'https://blogapi.scalezix.com/api' : 'http://localhost:3001/api');
```

**What happened:**
1. Vercel didn't have `VITE_API_URL` environment variable set
2. Code fell back to the hardcoded production URL
3. BUT the console log was showing a placeholder from an old version
4. The actual requests were going to Railway (old deployment)

**The Fix:**
- Set `VITE_API_URL` in Vercel environment variables
- Rebuild with cache disabled to pick up new variable
- Now frontend will use correct AWS backend URL

---

## 📞 Need Help?

If you're still having issues after following all steps:

1. **Check PM2 logs:**
   ```bash
   pm2 logs aibloggen-backend --lines 100
   ```

2. **Check browser console:**
   - Press F12
   - Look for errors in Console tab
   - Look for failed requests in Network tab

3. **Verify environment variables:**
   - Vercel: Settings → Environment Variables
   - AWS: `cat /home/ec2-user/apps/aibloggen/server/.env`

4. **Test each component:**
   - Backend: `curl https://blogapi.scalezix.com/api/health`
   - Frontend: Open https://aiblog.scalezix.com
   - Database: Check MongoDB Atlas dashboard

---

**Last Updated:** February 8, 2026  
**Status:** Ready to deploy  
**Estimated Fix Time:** 10-15 minutes
