# 🚀 AWS Complete Fix Guide - Scalezix

## 🔍 Issues Found:

1. ❌ **PM2 not running** - No backend process
2. ❌ **Frontend pointing to Railway** - Old API URL
3. ❌ **CORS error** - Backend not configured
4. ❌ **Wrong path in docs** - Actual path is `/home/ec2-user/apps/aibloggen`

---

## ✅ COMPLETE FIX - Follow These Steps

### STEP 1: Pull Latest Code on AWS

```bash
# You're already in the right directory
cd /home/ec2-user/apps/aibloggen

# Pull latest code
git pull origin main
```

**Expected Output:**
```
Updating xxxxx..xxxxx
Fast-forward
 88 files changed, 2568 insertions(+), 168 deletions(-)
```

---

### STEP 2: Update Backend Environment Variables

```bash
# Edit the .env file
cd /home/ec2-user/apps/aibloggen/server
nano .env
```

**Make sure these lines are correct:**

```bash
# CRITICAL: Update these
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://aiblog.scalezix.com

# Your MongoDB connection
MONGODB_URI=your_mongodb_connection_string_here

# JWT Secret (MUST be different from local)
JWT_SECRET=your-super-secure-production-secret-here

# AI API Keys (at least ONE required)
GOOGLE_AI_KEY=your_google_ai_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here
OPENROUTER_API_KEY=your_openrouter_key_here
```

**Save and Exit:**
- Press `Ctrl + X`
- Press `Y`
- Press `Enter`

---

### STEP 3: Check Backend CORS Configuration

```bash
# Check if CORS is configured correctly
cd /home/ec2-user/apps/aibloggen/server
grep -A 10 "allowedOrigins" server.js
```

**Should show:**
```javascript
const allowedOrigins = [
  'https://aiblog.scalezix.com',
  'https://blogapi.scalezix.com'
];
```

**If it shows Railway or Render URLs, we need to update it.**

---

### STEP 4: Start Backend with PM2

```bash
# Navigate to server directory
cd /home/ec2-user/apps/aibloggen/server

# Install dependencies (if needed)
npm install

# Start with PM2
pm2 start server.js --name aibloggen-backend

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Copy and run the command it gives you
```

**Expected Output:**
```
[PM2] Starting server.js in fork_mode (1 instance)
[PM2] Done.
┌─────┬──────────────────────┬─────────┬─────────┬──────────┐
│ id  │ name                 │ status  │ restart │ uptime   │
├─────┼──────────────────────┼─────────┼─────────┼──────────┤
│ 0   │ aibloggen-backend    │ online  │ 0       │ 0s       │
└─────┴──────────────────────┴─────────┴─────────┴──────────┘
```

---

### STEP 5: Check Backend Logs

```bash
# View logs
pm2 logs aibloggen-backend --lines 50
```

**Look for these SUCCESS messages:**
```
✅ Server running on http://localhost:3001
✅ API available at http://localhost:3001/api
✅ MongoDB Atlas connected (or fallback mode)
✅ AI Services: Google AI, Anthropic, OpenRouter
✅ Enhanced Chaos Engine v2.0 loaded
```

**If you see errors, check:**
- API keys are correct
- MongoDB connection string is correct
- Port 3001 is not in use

---

### STEP 6: Test Backend API

```bash
# Test from AWS server
curl http://localhost:3001/api/health

# Expected response:
# {"status":"ok","timestamp":"2026-02-07T..."}
```

---

### STEP 7: Configure Nginx (If Using)

**Check if Nginx is running:**
```bash
sudo systemctl status nginx
```

**If Nginx is running, check configuration:**
```bash
sudo nano /etc/nginx/sites-available/default
```

**Should have:**
```nginx
server {
    listen 80;
    server_name blogapi.scalezix.com;

    location /api {
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

**Restart Nginx:**
```bash
sudo systemctl restart nginx
```

---

### STEP 8: Update Vercel Environment Variables

**Go to Vercel Dashboard:**
1. Open: https://vercel.com/dashboard
2. Select your project: `aiblogfinal`
3. Go to **Settings** → **Environment Variables**
4. Add/Update:

```
VITE_API_URL = https://blogapi.scalezix.com/api
```

5. Click **Save**
6. Go to **Deployments** tab
7. Click **Redeploy** on the latest deployment

---

### STEP 9: Verify Everything Works

**Test Backend:**
```bash
# From your computer
curl https://blogapi.scalezix.com/api/health
```

**Test Frontend:**
1. Open: https://aiblog.scalezix.com
2. Try to sign up
3. Should work without CORS errors

---

## 🔧 Troubleshooting

### Issue: PM2 process keeps crashing

```bash
# Check logs
pm2 logs aibloggen-backend --lines 100

# Common issues:
# 1. Port 3001 in use
sudo lsof -i :3001
sudo kill -9 <PID>

# 2. Missing dependencies
cd /home/ec2-user/apps/aibloggen/server
npm install

# 3. Wrong Node version
node --version  # Should be 16+
```

### Issue: CORS errors still happening

**Update server.js CORS configuration:**

```bash
cd /home/ec2-user/apps/aibloggen/server
nano server.js
```

**Find the CORS section and update:**

```javascript
const allowedOrigins = [
  'https://aiblog.scalezix.com',
  'https://aiblogfinal.vercel.app',
  'https://blogapi.scalezix.com'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight requests
app.options('*', cors());
```

**Restart PM2:**
```bash
pm2 restart aibloggen-backend
```

### Issue: Vercel still showing old API URL

**Force rebuild:**
1. Go to Vercel dashboard
2. Settings → Environment Variables
3. Verify `VITE_API_URL=https://blogapi.scalezix.com/api`
4. Deployments → Click "..." → Redeploy
5. Check "Use existing Build Cache" is **UNCHECKED**
6. Click Redeploy

---

## 📋 Quick Commands Reference

```bash
# SSH into AWS
ssh ec2-user@your-aws-ip

# Navigate to project
cd /home/ec2-user/apps/aibloggen

# Pull latest code
git pull origin main

# Start backend
cd server
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
```

---

## ✅ Success Checklist

After following all steps:

- [ ] Backend running: `pm2 status` shows "online"
- [ ] No errors in logs: `pm2 logs aibloggen-backend`
- [ ] Health check works: `curl https://blogapi.scalezix.com/api/health`
- [ ] Frontend loads: https://aiblog.scalezix.com
- [ ] Can sign up without CORS errors
- [ ] Can login successfully
- [ ] Can generate content

---

## 🎯 Expected Results

After fix:
- ✅ Backend running on AWS at port 3001
- ✅ Frontend on Vercel connecting to AWS backend
- ✅ No CORS errors
- ✅ Sign up/login working
- ✅ Content generation working (2-4 min, 85-95% human)

---

**Last Updated:** February 7, 2026  
**AWS Path:** `/home/ec2-user/apps/aibloggen`  
**PM2 Process:** `aibloggen-backend`
