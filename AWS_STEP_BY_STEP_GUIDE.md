# AWS Deployment Guide - Step by Step

## Overview
This guide will help you deploy your AI Marketing Platform to AWS from scratch.

**What we'll deploy:**
- Frontend → AWS S3 + CloudFront (static website)
- Backend → AWS EC2 (Node.js server)
- Database → MongoDB Atlas (already configured)

**Estimated Time:** 30-45 minutes
**Cost:** ~$10-15/month for small traffic

---

## PART 1: Create AWS Account (Skip if you have one)

### Step 1.1: Go to AWS
1. Open: https://aws.amazon.com/
2. Click "Create an AWS Account" (top right)
3. Enter your email and password
4. Choose "Personal" account type
5. Enter your credit card (required, but free tier available)
6. Complete phone verification
7. Select "Basic Support - Free"

### Step 1.2: Sign In to Console
1. Go to: https://console.aws.amazon.com/
2. Sign in with your email and password
3. You'll see the AWS Management Console

---

## PART 2: Deploy Backend to EC2

### Step 2.1: Launch EC2 Instance
1. In AWS Console, search "EC2" in the search bar
2. Click "EC2" to open the EC2 Dashboard
3. Click "Launch Instance" (orange button)

### Step 2.2: Configure Instance
1. **Name:** `ai-marketing-backend`
2. **Application and OS Images:** 
   - Select "Ubuntu"
   - Choose "Ubuntu Server 22.04 LTS (Free tier eligible)"
3. **Instance type:** `t2.micro` (Free tier eligible)
4. **Key pair:**
   - Click "Create new key pair"
   - Name: `ai-marketing-key`
   - Type: RSA
   - Format: .pem
   - Click "Create key pair"
   - **SAVE THE DOWNLOADED FILE** (you'll need it to connect)

### Step 2.3: Network Settings
1. Click "Edit" next to Network settings
2. Check these boxes:
   - ✅ Allow SSH traffic from Anywhere
   - ✅ Allow HTTPS traffic from the internet
   - ✅ Allow HTTP traffic from the internet

### Step 2.4: Storage
1. Change storage to `20 GiB` (free tier allows up to 30GB)

### Step 2.5: Launch
1. Click "Launch Instance"
2. Wait for "Success" message
3. Click "View all instances"
4. Wait until "Instance state" shows "Running" (1-2 minutes)

### Step 2.6: Get Your Server IP
1. Click on your instance name
2. Copy the "Public IPv4 address" (e.g., `54.123.45.67`)
3. **Save this IP** - you'll need it later

---

## PART 3: Connect to Your Server

### Step 3.1: Connect via SSH (Windows)
1. Open PowerShell
2. Navigate to where you saved the .pem file:
   ```
   cd Downloads
   ```
3. Connect to your server:
   ```
   ssh -i "ai-marketing-key.pem" ubuntu@YOUR_IP_ADDRESS
   ```
   Replace `YOUR_IP_ADDRESS` with your EC2 public IP

4. Type "yes" when asked about fingerprint
5. You're now connected to your server!

### Step 3.2: Connect via SSH (Mac/Linux)
1. Open Terminal
2. Set permissions on key file:
   ```
   chmod 400 ~/Downloads/ai-marketing-key.pem
   ```
3. Connect:
   ```
   ssh -i ~/Downloads/ai-marketing-key.pem ubuntu@YOUR_IP_ADDRESS
   ```

---

## PART 4: Setup Server Environment

### Step 4.1: Update System
Run these commands one by one:
```bash
sudo apt update
sudo apt upgrade -y
```

### Step 4.2: Install Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
```

Verify installation:
```bash
node --version
npm --version
```

### Step 4.3: Install Git
```bash
sudo apt install -y git
```

### Step 4.4: Install PM2 (Process Manager)
```bash
sudo npm install -g pm2
```

---

## PART 5: Deploy Your Code

### Step 5.1: Clone Your Repository
```bash
cd ~
git clone https://github.com/harshkuhikar/Ai-Automation.git
cd Ai-Automation/server
```

### Step 5.2: Install Dependencies
```bash
npm install
```

### Step 5.3: Create Environment File
```bash
nano .env
```

Paste your environment variables (press Ctrl+Shift+V to paste):
```
MONGODB_URI=your_mongodb_connection_string
OPENROUTER_API_KEY=your_openrouter_api_key
SERPAPI_KEY=your_serpapi_key
GOOGLE_AI_KEY=your_google_ai_key
JWT_SECRET=your_jwt_secret_key
BREVO_API_KEY=your_brevo_api_key
BREVO_EMAIL=your_email@gmail.com
FRONTEND_URL=https://your-domain.com
NODE_ENV=production
PORT=3001
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
```

**Note:** Copy your actual values from Railway environment variables or your local `.env` file.

Save: Press `Ctrl+X`, then `Y`, then `Enter`

### Step 5.4: Start the Server
```bash
pm2 start server.js --name "ai-marketing-api"
pm2 save
pm2 startup
```

Copy the command it shows and run it (starts PM2 on boot)

### Step 5.5: Verify Server is Running
```bash
pm2 status
```
Should show "online" status

Test the API:
```bash
curl http://localhost:3001/api/health
```

---

## PART 6: Setup Nginx (Web Server)

### Step 6.1: Install Nginx
```bash
sudo apt install -y nginx
```

### Step 6.2: Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/ai-marketing
```

Paste this configuration:
```nginx
server {
    listen 80;
    server_name YOUR_IP_ADDRESS;

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        root /var/www/ai-marketing;
        try_files $uri $uri/ /index.html;
    }
}
```

Replace `YOUR_IP_ADDRESS` with your EC2 public IP.

Save: `Ctrl+X`, `Y`, `Enter`

### Step 6.3: Enable the Site
```bash
sudo ln -s /etc/nginx/sites-available/ai-marketing /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

---

## PART 7: Deploy Frontend

### Step 7.1: Build Frontend Locally
On your local computer (not the server), run:
```bash
cd E:\White-Label-AI-Automation
npm run build
```

### Step 7.2: Update API URL in Frontend
Before building, update `src/api/client.js` to use your EC2 IP:
```javascript
const API_URL = 'http://YOUR_EC2_IP:3001/api';
```

Then rebuild:
```bash
npm run build
```

### Step 7.3: Upload Frontend to Server
From your local computer:
```bash
scp -i "ai-marketing-key.pem" -r dist/* ubuntu@YOUR_IP:/tmp/frontend/
```

### Step 7.4: Move Files on Server
SSH into your server and run:
```bash
sudo mkdir -p /var/www/ai-marketing
sudo cp -r /tmp/frontend/* /var/www/ai-marketing/
sudo chown -R www-data:www-data /var/www/ai-marketing
```

---

## PART 8: Open Firewall Ports

### Step 8.1: Configure Security Group
1. Go to EC2 Dashboard in AWS Console
2. Click "Security Groups" in left sidebar
3. Click on your instance's security group
4. Click "Edit inbound rules"
5. Add these rules:
   - Type: HTTP, Port: 80, Source: Anywhere
   - Type: HTTPS, Port: 443, Source: Anywhere
   - Type: Custom TCP, Port: 3001, Source: Anywhere
6. Click "Save rules"

---

## PART 9: Test Your Deployment

### Step 9.1: Test Backend
Open in browser: `http://YOUR_EC2_IP:3001/api/health`

Should show:
```json
{"status":"ok","version":"2.1.0"}
```

### Step 9.2: Test Frontend
Open in browser: `http://YOUR_EC2_IP`

You should see your AI Marketing Platform!

---

## PART 10: Setup Custom Domain (Optional)

### Step 10.1: Buy a Domain
1. Go to: https://www.namecheap.com or https://www.godaddy.com
2. Search for your domain name
3. Purchase it (~$10-15/year)

### Step 10.2: Point Domain to EC2
1. In your domain registrar, go to DNS settings
2. Add an A record:
   - Host: @
   - Value: YOUR_EC2_IP
   - TTL: 300

### Step 10.3: Setup SSL (HTTPS)
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

Follow the prompts to get free SSL certificate.

---

## PART 11: Maintenance Commands

### View Logs
```bash
pm2 logs ai-marketing-api
```

### Restart Server
```bash
pm2 restart ai-marketing-api
```

### Update Code
```bash
cd ~/Ai-Automation
git pull
cd server
npm install
pm2 restart ai-marketing-api
```

### Check Server Status
```bash
pm2 status
```

---

## Troubleshooting

### Server not starting?
```bash
pm2 logs ai-marketing-api --lines 50
```

### Can't connect to server?
- Check security group has port 3001 open
- Check nginx is running: `sudo systemctl status nginx`

### Frontend not loading?
- Check files exist: `ls /var/www/ai-marketing`
- Check nginx config: `sudo nginx -t`

---

## Cost Summary

| Service | Monthly Cost |
|---------|-------------|
| EC2 t2.micro | Free (first year) or ~$8/month |
| Storage (20GB) | Free (first year) or ~$2/month |
| Data Transfer | Free (up to 100GB) |
| **Total** | **~$0-10/month** |

---

## Quick Reference

| Item | Value |
|------|-------|
| EC2 IP | YOUR_IP_HERE |
| SSH Command | `ssh -i "ai-marketing-key.pem" ubuntu@YOUR_IP` |
| Backend URL | `http://YOUR_IP:3001` |
| Frontend URL | `http://YOUR_IP` |
| PM2 Status | `pm2 status` |
| View Logs | `pm2 logs` |

---

**Congratulations!** Your AI Marketing Platform is now live on AWS! 🎉
