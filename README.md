# AI Marketing Platform

A comprehensive AI-powered marketing platform for content creation, social media management, and SEO automation.

## Features

- 🤖 **AI Content Generation** - Generate human-like content (1500+ words)
- 📱 **Social Media Management** - Post to Facebook, LinkedIn, Twitter, Instagram
- 📝 **WordPress Integration** - Bulk publish to WordPress sites
- 🔍 **SEO Automation** - Analyze and optimize website SEO
- 📊 **Client Management** - Multi-tenant architecture for agencies
- 📧 **Email Services** - OTP verification, password reset, notifications

## Tech Stack

- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas
- **AI**: Google AI, OpenRouter
- **Email**: Gmail / AWS SES

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.8+
- MongoDB Atlas account

### Installation

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/ai-marketing-platform.git
cd ai-marketing-platform

# Install dependencies
npm install
cd server && npm install && cd ..

# Configure environment
cp server/.env.production.example server/.env
# Edit server/.env with your credentials

# Start development
npm run dev          # Frontend (port 5173)
cd server && npm start  # Backend (port 3001)
```

### Production Deployment

See `AWS_DEPLOYMENT_GUIDE.md` for detailed AWS EC2 deployment instructions.

```bash
# On EC2 server
chmod +x deploy.sh
./deploy.sh
```

## Documentation

| File | Description |
|------|-------------|
| `AWS_DEPLOYMENT_GUIDE.md` | AWS EC2 deployment guide |
| `MULTI_TENANT_GUIDE.md` | Multi-client architecture |
| `EXCEL_TEMPLATE_GUIDE.md` | Bulk import format |
| `LINKEDIN_SETUP_GUIDE.md` | LinkedIn OAuth setup |
| `INSTAGRAM_SETUP_GUIDE.md` | Instagram OAuth setup |

## Environment Variables

See `server/.env.production.example` for all required variables.

## Auto-Deployment (GitHub Actions)

Push to `main` branch automatically deploys to your server. See `.github/workflows/deploy.yml`.

## License

Proprietary - All rights reserved to HARSH J KUHIKAR

## Author

**HARSH J KUHIKAR**
- © 2025 All Rights Reserved
