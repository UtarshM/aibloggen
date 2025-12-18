# Human-Like Content Generation System
## Scalezix AI Blog Automation Platform

**Version:** 2.0  
**Last Updated:** December 2024  
**Developed by:** Scalezix Venture PVT LTD

---

## Executive Summary

This document explains the AI-powered content generation system that produces **human-like, SEO-optimized blog content** that passes AI detection tools and reads naturally.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                                   │
│                    https://aiblog.scalezix.com                          │
│                                                                          │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │  Content Creation Page                                           │   │
│   │  ├── Topic Input: "Best Coffee Machines 2024"                   │   │
│   │  ├── Tone Selection: Professional / Conversational / Casual     │   │
│   │  ├── Word Count: 1500 - 5000+ words                             │   │
│   │  └── Number of Images: 1-8 images                               │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                              │                                           │
│                              ▼                                           │
│                    [Generate Content Button]                             │
└──────────────────────────────┼──────────────────────────────────────────┘
                               │
                               │ HTTPS API Request
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         BACKEND SERVER                                   │
│                   https://blogapi.scalezix.com                          │
│                        (AWS EC2 + PM2)                                  │
│                                                                          │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │  POST /api/content/generate-human                                │   │
│   │                                                                  │   │
│   │  1. Validate Input                                               │   │
│   │  2. Build Human-Like Prompt                                      │   │
│   │  3. Call AI Service (OpenRouter → Google AI fallback)           │   │
│   │  4. Fetch Real Images (SerpAPI → Google Images)                 │   │
│   │  5. Insert Images into Content                                   │   │
│   │  6. Return Complete Article                                      │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## AI Services Used

### Primary: OpenRouter API
- **Model:** Claude 3 Haiku (Anthropic)
- **Why:** Fast, high-quality, cost-effective
- **Max Tokens:** 16,000
- **Temperature:** 0.7 (balanced creativity)

### Fallback: Google AI (Gemini)
- **Model:** Gemini 1.5 Flash
- **Why:** Reliable backup, good quality
- **Max Tokens:** 16,000

### Image Service: SerpAPI (Recommended)
- **Source:** Google Images via SerpAPI
- **Why:** Real, relevant, high-quality images that match your exact topic
- **Get Key:** https://serpapi.com/manage-api-key
- **Free Tier:** 100 searches/month
- **Fallback 1:** Google Custom Search API (if configured)
- **Fallback 2:** Picsum placeholder images (random, not topic-specific)

---

## The Human-Like Content Prompt (v2.0)

This is the exact prompt used to generate content that sounds human-written:

```
Write a blog post about "{topic}".

CRITICAL RULES - READ CAREFULLY:

1. START DIRECTLY WITH CONTENT
   - Do NOT write "Here is..." or "Here's a comprehensive..." or any intro line
   - Do NOT write any explanation of what you're about to write
   - Just start with the actual blog content immediately
   - First line should be the opening of the article itself

2. NO METADATA OR EXTRA SECTIONS
   - Do NOT include any "---METADATA---" blocks
   - Do NOT include JSON-LD or schema markup
   - Do NOT include word counts or read times
   - Just write the blog post content, nothing else

3. TABLE OF CONTENTS (Required)
   - After the opening paragraph, add a Table of Contents
   - Format: <div class="toc"><h3>Table of Contents</h3><ul><li><a href="#section1">Heading 1</a></li>...</ul></div>
   - Link each item to its corresponding H2 section

4. WRITE LIKE A REAL PERSON
   - Use simple, everyday English words
   - Write like you're explaining to a friend
   - Use "you" and "your" to talk directly to reader
   - Use contractions: "don't", "won't", "it's", "you're", "they're"
   - Keep sentences short and clear
   - Mix short sentences with longer ones
   - Start some sentences with "And", "But", "So", "Now"
   - Add personal touches: "I've seen", "In my experience", "What works for me"
   - Ask questions: "Sound familiar?", "Know what I mean?", "Ever noticed that?"

5. WORDS TO NEVER USE (AI giveaways):
   - "comprehensive" - say "complete" or "full"
   - "crucial" - say "important" or "key"
   - "leverage" - say "use"
   - "utilize" - say "use"
   - "implement" - say "set up" or "start"
   - "facilitate" - say "help" or "make easier"
   - "robust" - say "strong" or "solid"
   - "seamless" - say "smooth" or "easy"
   - "cutting-edge" - say "new" or "latest"
   - "game-changer" - just describe what it does
   - "dive deep" - say "look at" or "explore"
   - "landscape" - say "world" or "area"
   - "realm" - say "area" or "field"
   - "plethora" - say "many" or "lots of"
   - "myriad" - say "many"
   - "delve" - say "look into"
   - "embark" - say "start"
   - "foster" - say "build" or "grow"
   - "Moreover" - say "Also" or "Plus"
   - "Furthermore" - say "And" or "Also"
   - "However" - say "But"
   - "Therefore" - say "So"
   - "Nevertheless" - say "Still" or "But"

6. STRUCTURE
   - Opening: Hook the reader with something interesting (not "Welcome to this guide")
   - Table of Contents: After opening paragraph
   - Body: Use the provided headings or create natural ones
   - Each section: 200-400 words with real information
   - Closing: End naturally, no "In conclusion" or summary lists

HTML FORMAT:
- <h2 id="section1"> for main headings (add id for TOC links)
- <h3> for sub-headings
- <p> for paragraphs
- <ul><li> for bullet lists (use sparingly)
- <strong> for bold text
- <a href="url"> for links
```

### Excel Data Support

The system now supports custom data from Excel files:

| Field | Description | Example |
|-------|-------------|---------|
| `headings` | Custom H2/H3 headings | "Why Coffee Matters\nBest Machines\nBuying Guide" |
| `keywords` | SEO keywords to include | "coffee machine, espresso maker, best 2024" |
| `references` | URLs to cite | "https://example.com/coffee-guide" |
| `eeat` | Expertise/Authority info | "Written by certified barista with 10 years experience" |
| `scheduleDate` | Publish date | "2024-12-25" |
| `scheduleTime` | Publish time | "09:00" |

---

## Key Differentiators

### What Makes Our Content Human-Like

| AI-Generated (Bad) | Human-Like (Our System) |
|-------------------|-------------------------|
| "In today's digital landscape..." | "Look, here's what nobody tells you..." |
| "This comprehensive guide will..." | "I've been doing this for years, and..." |
| "It is important to note that..." | "Here's the thing though..." |
| "Let's dive deep into..." | "So what actually works?" |
| "In conclusion..." | "Bottom line?" |
| Perfect grammar always | Occasional "And" or "But" sentence starters |
| Same paragraph length | Varied - some short, some longer |
| Formal tone throughout | Conversational with personality |
| Generic examples | Specific names, numbers, real companies |
| No opinions | "I think," "In my experience" |

---

## Content Output Structure

### Generated Content Includes:

1. **HTML-Formatted Article**
   - Proper H2/H3 heading hierarchy
   - SEO-optimized structure
   - Embedded images with captions

2. **Real Images**
   - Sourced from Google Images via SerpAPI
   - Relevant to the topic
   - Properly captioned

3. **Metadata**
   - Word count
   - Title
   - Topic

---

## Image Integration Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    IMAGE FETCHING PROCESS                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Extract topic from user input                               │
│                    │                                             │
│                    ▼                                             │
│  2. Query SerpAPI (Google Images)                               │
│     GET https://serpapi.com/search.json?engine=google_images    │
│     &q={topic}&num={count}                                      │
│                    │                                             │
│                    ▼                                             │
│  3. Receive image URLs, titles, sources                         │
│                    │                                             │
│                    ▼                                             │
│  4. Insert images after H2 sections in content                  │
│     <figure>                                                     │
│       <img src="{url}" alt="{topic description}" />             │
│       <figcaption>{caption}</figcaption>                        │
│     </figure>                                                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## API Endpoint Details

### POST /api/content/generate-human

**Request:**
```json
{
  "topic": "Best Coffee Machines 2024",
  "tone": "conversational",
  "minWords": 3000,
  "numImages": 4
}
```

**Response:**
```json
{
  "content": "<h2>Why Your Morning Coffee...</h2><p>Look, I've tested...</p>...",
  "title": "Best Coffee Machines 2024",
  "wordCount": 3542,
  "topic": "Best Coffee Machines 2024",
  "images": [
    {
      "url": "https://...",
      "alt": "Best Coffee Machines 2024 - Image 1"
    }
  ]
}
```

---

## Environment Configuration

### Required API Keys

| Service | Purpose | Get Key From |
|---------|---------|--------------|
| OpenRouter | AI Content Generation | https://openrouter.ai/keys |
| Google AI | Backup AI Generation | https://makersuite.google.com/app/apikey |
| SerpAPI | Real Google Images | https://serpapi.com/manage-api-key |
| Brevo | Email OTP Service | https://app.brevo.com/settings/keys/api |

### Server Environment (.env)
```env
NODE_ENV=production
PORT=3001

# Database
MONGODB_URI=mongodb+srv://...

# AI Services (need at least one)
OPENROUTER_API_KEY=sk-or-v1-...
GOOGLE_AI_KEY=AIza...

# Images
SERPAPI_KEY=...

# Email
BREVO_API_KEY=xkeysib-...
BREVO_EMAIL=sender@domain.com

# Security
JWT_SECRET=...
FRONTEND_URL=https://aiblog.scalezix.com
```

---

## Quality Assurance

### AI Detection Bypass

The prompt is specifically designed to:

1. **Vary sentence structure** - Not every sentence follows the same pattern
2. **Use contractions** - "don't" instead of "do not"
3. **Include opinions** - Real humans have opinions
4. **Add imperfections** - Starting sentences with "And" or "But"
5. **Use casual language** - "Here's the thing" instead of "It is important"
6. **Reference specifics** - Real names, numbers, companies
7. **Avoid AI clichés** - No "digital landscape" or "comprehensive guide"

### SEO Optimization

- Topic-specific H2 headings (not generic)
- Natural keyword distribution
- Proper HTML structure for WordPress
- Image alt text optimization
- Readable paragraph length

---

## Deployment Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    Frontend     │     │    Backend      │     │   Database      │
│    (Vercel)     │────▶│   (AWS EC2)     │────▶│ (MongoDB Atlas) │
│                 │     │                 │     │                 │
│ aiblog.         │     │ blogapi.        │     │ Cloud Database  │
│ scalezix.com    │     │ scalezix.com    │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               │
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
       ┌───────────┐    ┌───────────┐    ┌───────────┐
       │ OpenRouter│    │ Google AI │    │  SerpAPI  │
       │  (Claude) │    │ (Gemini)  │    │ (Images)  │
       └───────────┘    └───────────┘    └───────────┘
```

---

## Usage Instructions

### For Content Creators:

1. Navigate to **Content Creation** page
2. Enter your **topic** (be specific for better results)
3. Select **tone** (conversational recommended)
4. Set **word count** (3000+ for comprehensive articles)
5. Choose **number of images** (4 recommended)
6. Click **Generate**
7. Wait 30-60 seconds for content generation
8. Review and edit as needed
9. Publish to WordPress or copy HTML

### Best Practices:

- **Be specific with topics**: "Best Budget Smartphones Under $500 in 2024" > "Smartphones"
- **Use conversational tone** for blog posts
- **Request 4+ images** for visual appeal
- **Review and personalize** the generated content
- **Add your own examples** to make it more authentic

---

## Support & Maintenance

**Developed by:** Scalezix Venture PVT LTD  
**Platform:** https://aiblog.scalezix.com  
**API:** https://blogapi.scalezix.com  

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Nov 2024 | Initial release |
| 2.0 | Dec 2024 | Ultra human-like prompt, banned AI phrases, conversational style |

---

*© 2025 Scalezix Venture PVT LTD. All Rights Reserved.*
