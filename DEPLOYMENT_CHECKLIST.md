# ✅ Scalezix Deployment Checklist

## 🎯 Quick Overview

Your website: **https://aiblog.scalezix.com**  
Your backend: **https://blogapi.scalezix.com/api**  
GitHub repo: **https://github.com/UtarshM/aibloggen**

---

## 📋 Pre-Deployment Checklist

- [x] Code updated with fixes
- [x] Affiliate route redirect added
- [x] Documentation created
- [ ] Code pushed to GitHub
- [ ] AWS backend deployed
- [ ] Vercel environment variable set
- [ ] Everything tested

---

## 🚀 Deployment Steps (Follow in Order)

### ✅ STEP 1: Push to GitHub (5 seconds)

**Run this command:**
```bash
deploy-complete.bat
```

**Or manually:**
```bash
git add .
git commit -m "Fix: Production deployment issues"
git push origin main
```

**Expected Result:**
```
✅ Code pushed to GitHub successfully!
```

---

### ✅ STEP 2: Deploy to AWS (2 minutes)

**Open your AWS terminal and run:**

```bash
# SSH into AWS
ssh ec2-user@your-aws-ip

# Navigate to project
cd /home/ec2-user/apps/aibloggen

# Pull latest code
git pull origin main

# Install dependencies
cd server
npm install

# Start/restart backend
pm2 restart aibloggen-backend || pm2 start server.js --name aibloggen-backend
pm2 save

# Check logs (should see "Server running on port 3001")
pm2 logs aibloggen-backend --lines 50
```

**Expected Output:**
```
✅ Server running on http://localhost:3001
✅ MongoDB Atlas connected
✅ AI Services initialized
✅ Enhanced Chaos Engine v2.0 loaded
```

**Test backend:**
```bash
curl http://localhost:3001/api/health
```

**Should return:**
```json
{"status":"ok","timestamp":"2026-02-08T..."}
```

---

### ✅ STEP 3: Update Vercel (3 minutes)

**1. Open Vercel Dashboard:**
- Go to: https://vercel.com/dashboard
- Find your project (likely named `aiblogfinal` or `aibloggen`)

**2. Add Environment Variable:**
- Click on your project
- Go to **Settings** tab
- Click **Environment Variables** in left sidebar
- Click **Add New**

**3. Enter Variable:**
```
Name: VITE_API_URL
Value: https://blogapi.scalezix.com/api
```

**4. Select Environments:**
- ✅ Production
- ✅ Preview
- ✅ Development

**5. Save and Redeploy:**
- Click **Save**
- Go to **Deployments** tab
- Click **...** (three dots) on latest deployment
- Click **Redeploy**
- ⚠️ **IMPORTANT:** UNCHECK "Use existing Build Cache"
- Click **Redeploy**

**6. Wait for deployment:**
- Should take 2-3 minutes
- Status will change from "Building" → "Ready"

---

### ✅ STEP 4: Test Everything (2 minutes)

**1. Test Backend Health:**
```bash
curl https://blogapi.scalezix.com/api/health
```

**Expected:**
```json
{"status":"ok","timestamp":"2026-02-08T..."}
```

**2. Test Frontend:**
- Open: https://aiblog.scalezix.com
- Press **F12** (open browser console)
- Refresh page
- Look for: `[API] Using API URL: https://blogapi.scalezix.com/api`

**3. Test Signup:**
- Click "Sign Up"
- Enter email: `test@example.com`
- Enter password: `test1234`
- Click "Sign Up"
- Should work without CORS errors ✅

**4. Test Affiliate Page:**
- Open: https://aiblog.scalezix.com/affiliate/
- Should redirect to: https://aiblog.scalezix.com/affiliate/login ✅

**5. Test SuperAdmin Page:**
- Open: https://aiblog.scalezix.com/superadmin/login
- Should load without errors ✅

**6. Test Content Generation:**
- Login to dashboard
- Go to Content Creation
- Enter topic: "AI in Healthcare"
- Click "Generate"
- Should complete in 2-4 minutes ✅
- Human score should be 85-95% ✅

---

## 🔍 Troubleshooting

### Problem: Frontend still shows wrong API URL

**Check:**
1. Did you add `VITE_API_URL` in Vercel?
2. Did you redeploy with cache disabled?
3. Did you wait for deployment to complete?

**Fix:**
- Go to Vercel → Settings → Environment Variables
- Delete `VITE_API_URL` if it exists
- Add it again: `https://blogapi.scalezix.com/api`
- Redeploy with cache disabled

---

### Problem: PM2 process crashes

**Check logs:**
```bash
pm2 logs aibloggen-backend --lines 100
```

**Common issues:**

**A. Port 3001 in use:**
```bash
sudo lsof -i :3001
sudo kill -9 <PID>
pm2 restart aibloggen-backend
```

**B. Missing .env file:**
```bash
cd /home/ec2-user/apps/aibloggen/server
ls -la .env
```

If missing, create it:
```bash
nano .env
```

Add:
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

---

### Problem: CORS errors still happening

**Update CORS in server.js:**
```bash
cd /home/ec2-user/apps/aibloggen/server
nano server.js
```

Find line ~150 and verify:
```javascript
const allowedOrigins = [
  'https://aiblog.scalezix.com',
  'https://aiblogfinal.vercel.app',
  'https://blogapi.scalezix.com'
];
```

Save and restart:
```bash
pm2 restart aibloggen-backend
```

---

### Problem: Can't SSH into AWS

**Check:**
1. Is your AWS instance running?
2. Do you have the correct IP address?
3. Do you have the SSH key file?

**Try:**
```bash
ssh -i /path/to/your-key.pem ec2-user@your-aws-ip
```

---

## ✅ Success Criteria

After completing all steps, you should have:

- ✅ Frontend console shows: `[API] Using API URL: https://blogapi.scalezix.com/api`
- ✅ PM2 shows backend as "online": `pm2 status`
- ✅ Backend health check works: `curl https://blogapi.scalezix.com/api/health`
- ✅ No CORS errors in browser console
- ✅ Can sign up successfully
- ✅ Can login successfully
- ✅ Affiliate page redirects properly
- ✅ SuperAdmin page loads
- ✅ Can generate content (2-4 min, 85-95% human)

---

## 📊 Quick Status Check

**Run these commands to check everything:**

```bash
# Check PM2 status
pm2 status

# Check backend logs
pm2 logs aibloggen-backend --lines 20

# Test backend health
curl http://localhost:3001/api/health
curl https://blogapi.scalezix.com/api/health

# Check Nginx (if using)
sudo systemctl status nginx
```

---

## 🎯 Final Verification

**Open these URLs and verify they work:**

1. ✅ https://aiblog.scalezix.com (Landing page)
2. ✅ https://aiblog.scalezix.com/signup (Signup page)
3. ✅ https://aiblog.scalezix.com/login (Login page)
4. ✅ https://aiblog.scalezix.com/affiliate/ (Redirects to /affiliate/login)
5. ✅ https://aiblog.scalezix.com/affiliate/login (Affiliate login)
6. ✅ https://aiblog.scalezix.com/superadmin/login (SuperAdmin login)
7. ✅ https://blogapi.scalezix.com/api/health (Backend health)

**Browser Console (F12):**
- ✅ No CORS errors
- ✅ Shows: `[API] Using API URL: https://blogapi.scalezix.com/api`
- ✅ No 404 errors

---

## 📞 Need Help?

**If you're stuck:**

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

4. **Read detailed guides:**
   - `QUICK_FIX.md` - Complete troubleshooting guide
   - `AWS_COMPLETE_FIX.md` - AWS deployment guide
   - `VERCEL_FIX_GUIDE.md` - Vercel deployment guide

---

## 🎉 You're Done!

Once all checkboxes are ✅, your website is fully deployed and working!

**What you can do now:**
- Generate AI content that looks 85-95% human
- Manage affiliates
- Access SuperAdmin dashboard
- Create unlimited blog posts
- All features working perfectly

---

**Last Updated:** February 8, 2026  
**Estimated Total Time:** 10-15 minutes  
**Difficulty:** Easy (just follow the steps)
