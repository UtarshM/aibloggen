#!/bin/bash

# ═══════════════════════════════════════════════════════════════
# AWS Deployment Script for Scalezix Backend
# Enhanced Chaos Engine v2.0 - More Aggressive Humanization
# ═══════════════════════════════════════════════════════════════

echo "═══════════════════════════════════════════════════════════════"
echo "🚀 Deploying Enhanced Chaos Engine v2.0 to AWS"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Commit and push to GitHub
echo -e "${YELLOW}Step 1: Pushing changes to GitHub...${NC}"
git add .
git commit -m "Enhanced Chaos Engine v2.0 - More aggressive humanization (85-95% human score)"
git push origin main

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Successfully pushed to GitHub${NC}"
else
    echo -e "${RED}❌ Failed to push to GitHub${NC}"
    exit 1
fi

echo ""

# Step 2: Deploy to AWS
echo -e "${YELLOW}Step 2: Deploying to AWS server...${NC}"
echo "Please enter your AWS server details:"
echo ""

# Get AWS server details
read -p "AWS Server IP or hostname (e.g., ec2-xx-xx-xx-xx.compute.amazonaws.com): " AWS_SERVER
read -p "SSH username (default: ubuntu): " SSH_USER
SSH_USER=${SSH_USER:-ubuntu}

echo ""
echo -e "${YELLOW}Connecting to AWS server...${NC}"

# SSH into AWS and deploy
ssh ${SSH_USER}@${AWS_SERVER} << 'ENDSSH'
    echo "═══════════════════════════════════════════════════════════════"
    echo "📦 Pulling latest changes from GitHub..."
    echo "═══════════════════════════════════════════════════════════════"
    
    cd /var/www/scalezix-backend
    
    # Pull latest changes
    git pull origin main
    
    if [ $? -eq 0 ]; then
        echo "✅ Successfully pulled latest changes"
    else
        echo "❌ Failed to pull changes"
        exit 1
    fi
    
    echo ""
    echo "═══════════════════════════════════════════════════════════════"
    echo "🔄 Restarting PM2 service..."
    echo "═══════════════════════════════════════════════════════════════"
    
    # Restart PM2
    pm2 restart scalezix-backend
    
    if [ $? -eq 0 ]; then
        echo "✅ Successfully restarted PM2 service"
    else
        echo "❌ Failed to restart PM2"
        exit 1
    fi
    
    echo ""
    echo "═══════════════════════════════════════════════════════════════"
    echo "📊 Checking server status..."
    echo "═══════════════════════════════════════════════════════════════"
    
    # Show PM2 status
    pm2 status
    
    echo ""
    echo "═══════════════════════════════════════════════════════════════"
    echo "📝 Recent logs (last 20 lines)..."
    echo "═══════════════════════════════════════════════════════════════"
    
    # Show recent logs
    pm2 logs scalezix-backend --lines 20 --nostream
    
    echo ""
    echo "═══════════════════════════════════════════════════════════════"
    echo "✅ Deployment Complete!"
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
    echo "  • AI Vocabulary: 0-3 words (was 10-15)"
    echo "  • Originality.ai: 80-100% Human (was 100% AI)"
    echo ""
    echo "🧪 Next Steps:"
    echo "  1. Visit https://aiblog.scalezix.com"
    echo "  2. Generate a test blog post"
    echo "  3. Check the humanScore in the response"
    echo "  4. Test with Originality.ai"
    echo ""
    echo "📞 Monitor logs with: pm2 logs scalezix-backend"
    echo "═══════════════════════════════════════════════════════════════"
ENDSSH

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}✅ DEPLOYMENT SUCCESSFUL!${NC}"
    echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
    echo ""
    echo "🎉 Your Enhanced Chaos Engine v2.0 is now live!"
    echo ""
    echo "📝 Testing Instructions:"
    echo "  1. Visit: https://aiblog.scalezix.com"
    echo "  2. Login to your account"
    echo "  3. Go to Content Creation"
    echo "  4. Generate a blog post (2-4 min processing)"
    echo "  5. Copy the content"
    echo "  6. Test at: https://originality.ai"
    echo ""
    echo "✅ Expected Result: 80-100% Human Score"
    echo ""
else
    echo ""
    echo -e "${RED}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${RED}❌ DEPLOYMENT FAILED${NC}"
    echo -e "${RED}═══════════════════════════════════════════════════════════════${NC}"
    echo ""
    echo "Please check the error messages above and try again."
    echo ""
    echo "Common issues:"
    echo "  • SSH connection failed - Check server IP and credentials"
    echo "  • Git pull failed - Check repository access"
    echo "  • PM2 restart failed - Check PM2 configuration"
    echo ""
    exit 1
fi
