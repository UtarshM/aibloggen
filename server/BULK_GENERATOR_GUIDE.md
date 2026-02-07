# Bulk Blog Generator - SaaS Integration Guide

## Overview

The Bulk Blog Generator is integrated into your SaaS platform. Clients:
1. Add their WordPress sites through the web UI
2. Upload Excel/CSV files with blog data
3. The system generates 10,000+ word human-like content
4. Content is automatically published to their WordPress sites

**No .env configuration needed for WordPress** - all client credentials are stored securely in the database.

---

## How It Works (Client Flow)

### 1. Client Adds WordPress Site (Web UI)
- Go to Settings → WordPress Sites
- Click "Add Site"
- Enter:
  - Site Name: "My Blog"
  - Site URL: https://myblog.com
  - Username: admin
  - Application Password: xxxx xxxx xxxx xxxx
- Click "Test Connection" then "Save"

### 2. Client Uploads Excel File (Web UI)
- Go to Content Creation → Bulk Import
- Select their WordPress site
- Upload Excel file with columns:
  - Title
  - H Tags (headings separated by |)
  - Keywords
  - Reference
  - EEAT
  - Date
  - Time

### 3. System Processes Each Row
- Generates 10,000+ word human-like content
- Uses Gemini 1.5 Flash AI
- Publishes to client's WordPress
- Schedules posts if date/time provided

---

## Excel File Format

| Column | Description | Example |
|--------|-------------|---------|
| Title | Blog post title | Best Coffee Machines 2024 |
| H Tags | Headings separated by \| | Why Coffee Matters\|Best Machines\|Buying Guide |
| Keywords | SEO keywords | coffee machine, espresso, best 2024 |
| Reference | Source URLs | https://example.com/guide |
| EEAT | Expertise statement | Written by certified barista |
| Date | Publish date | 2025-01-15 or 15/01/2025 |
| Time | Publish time | 09:00 |

---

## The Human Content Prompt

The system uses an advanced prompt designed to:

### Generate 10,000+ Words
- Each H2 section: 1,000-1,500 words
- Deep dive content, not summaries
- Personal stories and examples

### Pass AI Detection
- Sentence length variation (burstiness)
- Personal voice ("I", "You")
- Contractions everywhere
- Casual sentence starters
- 40+ banned AI words replaced with human alternatives

### SEO Optimization
- All keywords included naturally
- Table of Contents with anchor links
- Proper H2/H3 structure
- E-E-A-T compliance

---

## API Endpoints

### Generate Single Post
```
POST /api/content/generate-human
{
  "topic": "Best Coffee Machines 2024",
  "headings": "Why Coffee Matters|Best Machines|Buying Guide",
  "keywords": "coffee machine, espresso",
  "references": "https://example.com",
  "eeat": "Written by certified barista",
  "minWords": 10000
}
```

### Bulk Import (from Web UI)
```
POST /api/wordpress/bulk-import
FormData:
  - excel: [Excel file]
  - siteId: [WordPress site ID from database]
```

### Check Bulk Job Status
```
GET /api/wordpress/bulk-import/:jobId
```

---

## Database Models

### WordPressSite (per user)
```javascript
{
  userId: ObjectId,
  siteName: "My Blog",
  siteUrl: "https://myblog.com",
  username: "admin",
  applicationPassword: "xxxx xxxx xxxx xxxx",
  connected: true
}
```

### BulkImportJob
```javascript
{
  userId: ObjectId,
  wordpressSiteId: ObjectId,
  fileName: "blogs.xlsx",
  totalPosts: 10,
  processedPosts: 5,
  successfulPosts: 4,
  failedPosts: 1,
  status: "processing",
  posts: [
    {
      title: "Best Coffee Machines",
      status: "published",
      wordpressPostUrl: "https://myblog.com/best-coffee-machines/"
    }
  ]
}
```

---

## Server Requirements

### Required Environment Variables
```env
# AI (Required - at least one)
GOOGLE_AI_KEY=your-gemini-api-key
```

### No WordPress in .env
WordPress credentials are stored per-user in the database, not in environment variables. This allows:
- Multiple clients with different WordPress sites
- Secure credential storage
- Easy site management through UI

---

## Content Quality Features

### Banned AI Words (40+)
The prompt explicitly bans these AI giveaway words:
- delve, realm, landscape, robust, leverage
- comprehensive, game-changer, cutting-edge
- seamless, utilize, implement, facilitate
- moreover, furthermore, therefore, nevertheless
- And 25+ more...

### Human Writing Patterns
- Sentence burstiness (varied lengths)
- Personal pronouns (I, You)
- Contractions (don't, it's, we've)
- Casual starters (But, And, So, Now)
- Opinion phrases (I think, In my experience)

### Structure
- Table of Contents with anchor links
- 8-10 H2 sections
- 1,000-1,500 words per section
- "Parting Thoughts" ending (no "In Conclusion")

---

## Troubleshooting

### "AI services unavailable"
- Check GOOGLE_AI_KEY in .env
- Verify API key is valid at https://makersuite.google.com/app/apikey

### "WordPress site not found"
- Client needs to add their WordPress site through the UI first
- Check the site ID is correct

### Content less than 10,000 words
- Gemini may occasionally generate shorter content
- The prompt requests 10,000 words but actual output varies
- For guaranteed length, consider regenerating

### Rate Limits
- 5-second delay between posts
- Auto-retry on API failures (3 attempts)

---

## Support

**Developed by:** HARSH J KUHIKAR  
**Platform:** https://aiblog.scalezix.com  
**API:** https://blogapi.scalezix.com

---

*© 2025 HARSH J KUHIKAR. All Rights Reserved.*
