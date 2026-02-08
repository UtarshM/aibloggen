#!/bin/bash

# ═══════════════════════════════════════════════════════════════
# AWS Deployment Script - Scalezix Enhanced Chaos Engine v2.0
# ═══════════════════════════════════════════════════════════════

echo "═══════════════════════════════════════════════════════════════"
echo "🚀 Deploying Enhanced Chaos Engine v2.0 to AWS"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Navigate to project directory
echo -e "${YELLOW}Step 1: Navigating to project directory...${NC}"
cd /home/ec2-user/apps/aibloggen

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ In project directory${NC}"
else
    echo -e "${RED}❌ Failed to navigate to project directory${NC}"
    exit 1
fi

echo ""

# Step 2: Pull latest code
echo -e "${YELLOW}Step 2: Pulling latest code from GitHub...${NC}"
git pull origin main

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Code updated successfully${NC}"
else
    echo -e "${RED}❌ Failed to pull code${NC}"
    exit 1
fi

echo ""

# Step 3: Install dependencies
echo -e "${YELLOW}Step 3: Installing dependencies...${NC}"
cd server
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependencies installed${NC}"
else
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi

echo ""

# Step 4: Check if PM2 process exists
echo -e "${YELLOW}Step 4: Checking PM2 status...${NC}"
pm2 describe aibloggen-backend > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "PM2 process exists, restarting..."
    pm2 restart aibloggen-backend
else
    echo "PM2 process doesn't exist, starting new..."
    pm2 start server.js --name aibloggen-backend
fi

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend started successfully${NC}"
else
    echo -e "${RED}❌ Failed to start backend${NC}"
    exit 1
fi

echo ""

# Step 5: Save PM2 configuration
echo -e "${YELLOW}Step 5: Saving PM2 configuration...${NC}"
pm2 save

echo ""

# Step 6: Show status
echo -e "${YELLOW}Step 6: Checking status...${NC}"
pm2 status

echo ""

# Step 7: Show recent logs
echo -e "${YELLOW}Step 7: Recent logs (last 20 lines)...${NC}"
pm2 logs aibloggen-backend --lines 20 --nostream

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo -e "${GREEN}✅ DEPLOYMENT COMPLETE!${NC}"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "🎯 What Changed:"
echo "  • Humanization passes: 2 → 3"
echo "  • Delay between passes: 10s → 15s"
echo "  • Voice frequency: 0.08 → 0.12 (50% increase)"
echo "  • Hedge frequency: 0.04 → 0.06 (50% increase)"
echo "  • Question frequency: 0.05 → 0.08 (60% increase)"
echo ""
echo "📊 Expected Results:"
echo "  • Human Score: 85-95% (was 60-70%)"
echo "  • Burstiness: 45-55% (was 35-40%)"
echo "  • Processing Time: 2-4 minutes"
echo ""
echo "🧪 Test Your Deployment:"
echo "  1. curl http://localhost:3001/api/health"
echo "  2. Visit: https://aiblog.scalezix.com"
echo "  3. Try signing up/logging in"
echo "  4. Generate a blog post"
echo ""
echo "📞 Monitor logs with: pm2 logs aibloggen-backend"
echo "═══════════════════════════════════════════════════════════════"
