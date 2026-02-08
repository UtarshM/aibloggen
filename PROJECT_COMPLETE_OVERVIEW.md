# 📊 Scalezix AI Blog - Complete Project Overview

## 🎯 Project Summary

**Project Name:** Scalezix AI Blog Automation Platform  
**Live Website:** https://aiblog.scalezix.com  
**Backend API:** https://blogapi.scalezix.com/api  
**Repository:** https://github.com/UtarshM/aiblogfinal  
**Version:** Enhanced Chaos Engine v2.0  
**Author:** HARSH J KUHIKAR  

---

## 🏗️ Architecture

### Frontend (Vercel)
- **Framework:** React 18.2.0 + Vite 7.2.2
- **Styling:** TailwindCSS 3.3.6
- **Deployment:** Vercel
- **URL:** https://aiblog.scalezix.com
- **Build:** `npm run build` → dist/

### Backend (AWS EC2)
- **Runtime:** Node.js + Express 4.18.2
- **Process Manager:** PM2
- **Deployment:** AWS EC2
- **URL:** https://blogapi.scalezix.com/api
- **Path:** `/var/www/scalezix-backend`

### Database
- **Type:** MongoDB Atlas (Cloud)
- **Connection:** Mongoose ODM
- **Fallback:** Works without DB (content generation still functions)

---

## 🚀 Key Features

### 1. Enhanced Chaos Engine v2.0
**Purpose:** Generate 85-95% human-scored content

**Features:**
- 3-pass humanization (vs 2 passes before)
- 15-second delays between passes
- Randomized word replacement (100+ AI words)
- Symmetry breaking (brain jumps)
- Burstiness optimization (45-55%)
- Processing time: 2-4 minutes per article

**Results:**
- Human Score: 85-95% (was 60-70%)
- Passes Originality.ai detection
- No AI vocabulary detected
- Natural, conversational tone

### 2. SEO Mega-Prompt Engine v3.0
**Purpose:** Professional SEO content generation

**Features:**
- 20+ years SEO expert methodology
- E-E-A-T compliance
- NLP & semantic SEO
- Featured snippet optimization
- Keyword density control (0.8-1.2%)
- FAQ section generation
- 4 SEO personas

### 3. Advanced Humanizer v2.0
**Purpose:** AI detection bypass

**Features:**
- Removes AI clichés
- Adds human voice markers
- Varies sentence lengths
- Applies contractions
- Breaks "Rule of Three" patterns
- Injects personality

### 4. WordPress Integration
**Purpose:** Auto-publishing to WordPress

**Features:**
- One-click publishing
- Bulk import from Excel
- Post scheduling
- Category/tag management
- Job history tracking
- Bulk delete functionality

### 5. Affiliate System
**Purpose:** Referral program management

**Features:**
- 20% commission on sales
- Unique referral links
- Click tracking
- Withdrawal management (₹50,000 minimum)
- Admin approval workflow
- Earnings dashboard

### 6. Authentication System
**Purpose:** Secure user management

**Features:**
- JWT-based authentication
- OTP verification via email
- OAuth (Google, GitHub)
- Role-based access (User, Admin, Affiliate, SuperAdmin)
- Password reset
- Token-based rate limiting

---

## 📁 Project Structure

```
scalezix-ai-blog/
├── src/                          # Frontend React app
│   ├── pages/                    # 19 page components
│   │   ├── Home.jsx
│   │   ├── ContentCreation.jsx
│   │   ├── JobHistory.jsx
│   │   ├── Profile.jsx
│   │   ├── Settings.jsx
│   │   ├── AffiliateAdmin.jsx
│   │   ├── SuperAdminDashboard.jsx
│   │   └── ...
│   ├── components/               # Reusable UI components
│   │   ├── AppLoader.jsx         # Brand loading screen
│   │   ├── ContentGenerationModal.jsx
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   ├── Layout.jsx
│   │   └── ...
│   ├── context/                  # React context providers
│   │   ├── PlanContext.jsx
│   │   ├── ThemeContext.jsx
│   │   ├── ToastContext.jsx
│   │   └── MaintenanceContext.jsx
│   ├── api/                      # API client
│   │   └── client.js             # 877 lines - all API calls
│   ├── utils/                    # Utility functions
│   ├── App.jsx                   # Main app component
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Global styles
│
├── server/                       # Backend Node.js app
│   ├── server.js                 # Main server (3800+ lines)
│   ├── database.js               # MongoDB models
│   ├── seoMegaPromptEngine.js   # SEO content generation
│   ├── advancedHumanizer.js     # AI humanization
│   ├── chaosEngine.js            # Ultimate humanization (1342 lines)
│   ├── aiServices.js             # AI API integrations
│   ├── authModels.js             # User & auth models
│   ├── affiliateRoutes.js        # Affiliate system
│   ├── wordpressRoutes.js        # WordPress integration
│   ├── emailService.js           # Email/OTP service
│   ├── stealthService.js         # StealthGPT integration
│   ├── undetectableService.js   # Undetectable.ai integration
│   ├── package.json              # Backend dependencies
│   ├── .env                      # Environment variables (local)
│   ├── .env.production           # Production env template
│   └── render.yaml               # Render deployment config
│
├── marketing/                    # Next.js marketing site
│   └── src/app/                  # Marketing pages
│
├── Documentation/                # 15+ guide files
│   ├── AWS_DEPLOYMENT_COMPLETE_GUIDE.md
│   ├── CLIENT_DEMO_SETUP.md
│   ├── SOLUTION_GUIDE.md
│   ├── API_KEYS_REFERENCE.md
│   ├── CURRENT_STATUS.md
│   ├── SCALEZIX_HUMAN_CONTENT_GUIDE.md
│   └── ...
│
├── package.json                  # Frontend dependencies
├── vite.config.js                # Vite configuration
├── vercel.json                   # Vercel deployment config
├── tailwind.config.js            # TailwindCSS config
└── README.md                     # Project readme
```

---

## 🔑 Environment Variables

### Required (Production)

```bash
# Server Configuration
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://aiblog.scalezix.com

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-marketing

# Security
JWT_SECRET=your-super-secure-random-string

# AI API Keys (need at least ONE)
GOOGLE_AI_KEY=your-google-ai-key
ANTHROPIC_API_KEY=your-anthropic-key
OPENROUTER_API_KEY=your-openrouter-key

# Email Service
BREVO_API_KEY=your-brevo-key
BREVO_EMAIL=sender@domain.com
```

### Optional (Advanced Features)

```bash
# AI Humanizers
STEALTHGPT_API_KEY=your-stealthgpt-key
UNDETECTABLE_API_KEY=your-undetectable-key

# OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Image Search
SERPAPI_KEY=your-serpapi-key
```

---

## 🚀 Deployment

### Local Development

```bash
# Start Backend
cd server
node server.js
# Running on http://localhost:3001

# Start Frontend (new terminal)
npm run dev
# Running on http://localhost:5173
```

### AWS Production Deployment

```bash
# 1. SSH into AWS
ssh ubuntu@your-aws-server-ip

# 2. Navigate to backend
cd /var/www/scalezix-backend

# 3. Pull latest code
git pull origin main

# 4. Update environment variables
nano server/.env

# 5. Restart PM2
pm2 restart scalezix-backend

# 6. Check logs
pm2 logs scalezix-backend --lines 50
```

### Vercel Frontend Deployment

**Automatic deployment on git push to main branch**

```bash
# Push to GitHub
git push origin main

# Vercel automatically:
# 1. Detects push
# 2. Runs npm run build
# 3. Deploys to https://aiblog.scalezix.com
```

---

## 📊 API Endpoints

### Authentication (40+ endpoints)
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/forgot-password` - Request password reset
- `GET /api/auth/me` - Get current user

### Content Generation (5 endpoints)
- `POST /api/content/generate` - Basic generation
- `POST /api/content/generate-human` - Advanced humanization
- `POST /api/content/generate-chaos` - **Ultimate (2-4 min, 85-95% human)**
- `POST /api/content/humanize` - Humanize existing content
- `POST /api/content/analyze-risk` - AI detection analysis

### WordPress (8 endpoints)
- `GET /api/wordpress/sites` - List connected sites
- `POST /api/wordpress/sites` - Add new site
- `POST /api/wordpress/publish` - Publish post
- `POST /api/wordpress/bulk-import` - Bulk import from Excel

### Affiliate (15+ endpoints)
- `POST /api/affiliate/apply` - Apply to become affiliate
- `POST /api/affiliate/login` - Affiliate login
- `GET /api/affiliate/dashboard` - Affiliate dashboard
- `GET /api/affiliate/admin/list` - Admin: List affiliates

### Dashboard (10+ endpoints)
- `GET /api/dashboard/stats` - User dashboard stats
- `GET /api/usage/balance` - Token balance
- `GET /api/usage/history` - Usage history

---

## 🎨 UI/UX Features

### Professional Design
- **Color Scheme:** Primary #52b2bf (teal)
- **Typography:** System fonts, clean hierarchy
- **Layout:** Full-width, responsive
- **Animations:** Framer Motion, smooth transitions

### Loading States
- **App Loader:** 1-second brand loading screen
- **Skeleton Loaders:** Professional loading placeholders
- **Progress Tracking:** Real-time generation progress

### User Experience
- **Toast Notifications:** Success/error messages
- **Modal Dialogs:** Clean, accessible modals
- **Form Validation:** Real-time validation
- **Responsive:** Works on desktop, tablet, mobile

---

## 🔧 Tech Stack

### Frontend
- React 18.2.0
- Vite 7.2.2
- TailwindCSS 3.3.6
- React Router 6.20.0
- Axios 1.13.2
- Framer Motion 12.23.24
- Lucide React (icons)
- jsPDF (PDF export)
- docx (Word export)

### Backend
- Node.js (ES modules)
- Express 4.18.2
- MongoDB + Mongoose 8.0.3
- JWT (jsonwebtoken 9.0.2)
- Bcrypt (bcryptjs 3.0.3)
- Helmet 8.1.0 (security)
- CORS 2.8.5
- Rate Limiting (express-rate-limit 8.2.1)
- Nodemailer 7.0.10 (email)
- Multer 2.0.2 (file uploads)
- XLSX 0.18.5 (Excel)

### AI Services
- Google AI (Gemini 2.0 Flash)
- Anthropic (Claude 3.5 Sonnet)
- OpenRouter (multi-model access)
- StealthGPT (optional humanizer)
- Undetectable.ai (optional humanizer)

---

## 📈 Performance Metrics

### Content Generation
- **Processing Time:** 2-4 minutes per article
- **Human Score:** 85-95% (Originality.ai)
- **Burstiness:** 45-55% (sentence variation)
- **Word Count:** 2000-5000 words
- **AI Vocabulary:** 0-3 words detected

### System Performance
- **Backend Response:** <100ms (health check)
- **Content Generation:** 120-240 seconds
- **Frontend Load:** <2 seconds
- **API Rate Limit:** 10 requests/minute (AI operations)

---

## 🔒 Security Features

### Backend Security
- Helmet.js (HTTP headers)
- CORS (cross-origin protection)
- Rate limiting (brute force prevention)
- MongoDB sanitization (NoSQL injection prevention)
- HPP (HTTP parameter pollution prevention)
- JWT authentication
- Password hashing (bcrypt)

### Frontend Security
- CSP headers
- X-Frame-Options
- X-XSS-Protection
- Referrer-Policy
- Secure token storage
- Input validation

---

## 📊 Current Status

### ✅ Working
- Frontend deployed on Vercel
- Backend running on AWS EC2
- Enhanced Chaos Engine v2.0 implemented
- All humanization features active
- WordPress integration functional
- Affiliate system operational
- Authentication system working

### ⚠️ Needs Attention
- MongoDB authentication (optional - fallback works)
- API key quotas (Google AI free tier)
- Email service configuration (optional)

### 🎯 Ready For
- Client demos
- Production use
- Content generation (85-95% human scores)
- WordPress auto-publishing
- Affiliate program launch

---

## 📞 Quick Commands

### Local Development
```bash
# Start everything
start-demo.bat

# Or manually:
cd server && node server.js  # Backend
npm run dev                   # Frontend (new terminal)
```

### AWS Deployment
```bash
ssh ubuntu@your-aws-server
cd /var/www/scalezix-backend
git pull origin main
pm2 restart scalezix-backend
pm2 logs scalezix-backend
```

### Testing
```bash
# Test API keys
cd server && node test-new-keys.js

# Test content generation
node test-enhanced-chaos.js

# Test health endpoint
curl https://blogapi.scalezix.com/api/health
```

---

## 🎉 Success Criteria

Your system is working correctly when:

- ✅ Frontend loads at https://aiblog.scalezix.com
- ✅ Backend responds at https://blogapi.scalezix.com/api/health
- ✅ Can create account and login
- ✅ Can generate content (2-4 minutes)
- ✅ Human score is 85-95%
- ✅ Content exports work (PDF, Word, Markdown)
- ✅ WordPress publishing works (if configured)

---

## 📚 Documentation Files

1. **AWS_DEPLOYMENT_COMPLETE_GUIDE.md** - AWS deployment steps
2. **CLIENT_DEMO_SETUP.md** - Client demo walkthrough
3. **SOLUTION_GUIDE.md** - Technical solutions
4. **API_KEYS_REFERENCE.md** - API key management
5. **CURRENT_STATUS.md** - Project status
6. **SCALEZIX_HUMAN_CONTENT_GUIDE.md** - Content generation guide
7. **AWS_API_KEY_UPDATE_GUIDE.md** - Update keys on AWS
8. **PROJECT_COMPLETE_OVERVIEW.md** - This file

---

## 🎯 Next Steps

1. **Deploy to AWS** (if not already done)
   - Follow AWS_DEPLOYMENT_COMPLETE_GUIDE.md
   - Takes 10-15 minutes

2. **Test Content Generation**
   - Generate a blog post
   - Verify 85-95% human score
   - Test with Originality.ai

3. **Configure Optional Features**
   - WordPress integration
   - Affiliate system
   - Email notifications

4. **Launch to Clients**
   - Use CLIENT_DEMO_SETUP.md
   - Show 2-4 minute generation
   - Demonstrate human scores

---

**Project Status:** ✅ Production Ready  
**Version:** Enhanced Chaos Engine v2.0  
**Last Updated:** February 7, 2026  
**Author:** HARSH J KUHIKAR
