#!/bin/bash

# ═══════════════════════════════════════════════════════════════
# AI Marketing Platform - AWS Deployment Script
# Run this on your EC2 instance
# ═══════════════════════════════════════════════════════════════

set -e

echo "🚀 Starting AI Marketing Platform Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    echo -e "${RED}Please don't run as root. Run as ubuntu user.${NC}"
    exit 1
fi

# Update system
echo -e "${YELLOW}📦 Updating system packages...${NC}"
sudo apt update && sudo apt upgrade -y

# Install Node.js 22
echo -e "${YELLOW}📦 Installing Node.js 22...${NC}"
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
    sudo apt install -y nodejs
fi
echo -e "${GREEN}✅ Node.js $(node -v) installed${NC}"

# Install Python 3
echo -e "${YELLOW}📦 Installing Python 3...${NC}"
sudo apt install -y python3 python3-pip python3-venv
echo -e "${GREEN}✅ Python $(python3 --version) installed${NC}"

# Install PM2
echo -e "${YELLOW}📦 Installing PM2...${NC}"
sudo npm install -g pm2
echo -e "${GREEN}✅ PM2 installed${NC}"

# Install Nginx
echo -e "${YELLOW}📦 Installing Nginx...${NC}"
sudo apt install -y nginx
echo -e "${GREEN}✅ Nginx installed${NC}"

# Create app directory
echo -e "${YELLOW}📁 Setting up application directory...${NC}"
sudo mkdir -p /var/www/ai-marketing
sudo chown -R ubuntu:ubuntu /var/www/ai-marketing

# Create log directory
sudo mkdir -p /var/log/pm2
sudo chown -R ubuntu:ubuntu /var/log/pm2

# Install backend dependencies
echo -e "${YELLOW}📦 Installing backend dependencies...${NC}"
cd /var/www/ai-marketing/server
npm install

# Install Python dependencies
echo -e "${YELLOW}📦 Installing Python dependencies...${NC}"
pip3 install requests python-dotenv

# Install frontend dependencies and build
echo -e "${YELLOW}📦 Building frontend...${NC}"
cd /var/www/ai-marketing
npm install
npm run build

# Setup Nginx
echo -e "${YELLOW}🔧 Configuring Nginx...${NC}"
sudo tee /etc/nginx/sites-available/ai-marketing > /dev/null <<EOF
server {
    listen 80;
    server_name _;

    # Frontend
    location / {
        root /var/www/ai-marketing/dist;
        index index.html;
        try_files \$uri \$uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # File uploads
    client_max_body_size 50M;
}
EOF

sudo ln -sf /etc/nginx/sites-available/ai-marketing /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
echo -e "${GREEN}✅ Nginx configured${NC}"

# Start application with PM2
echo -e "${YELLOW}🚀 Starting application with PM2...${NC}"
cd /var/www/ai-marketing/server
pm2 delete ai-marketing-backend 2>/dev/null || true
pm2 start server.js --name "ai-marketing-backend"
pm2 save
pm2 startup | tail -1 | sudo bash
echo -e "${GREEN}✅ Application started${NC}"

# Print status
echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "📍 Your application is running at: ${YELLOW}http://$(curl -s ifconfig.me)${NC}"
echo ""
echo -e "📋 Next steps:"
echo -e "   1. Update ${YELLOW}/var/www/ai-marketing/server/.env${NC} with your production values"
echo -e "   2. Setup SSL with: ${YELLOW}sudo certbot --nginx -d yourdomain.com${NC}"
echo -e "   3. Update OAuth callback URLs with your domain"
echo ""
echo -e "📊 Useful commands:"
echo -e "   ${YELLOW}pm2 logs${NC}        - View logs"
echo -e "   ${YELLOW}pm2 status${NC}      - Check status"
echo -e "   ${YELLOW}pm2 restart all${NC} - Restart application"
echo ""
