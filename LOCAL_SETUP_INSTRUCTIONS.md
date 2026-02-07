# Local Development Setup Instructions

## Current Status

✅ **Backend Server**: Running on http://localhost:3001
✅ **Frontend Server**: Running on http://localhost:5173

⚠️ **MongoDB**: Not connected (you need to add your connection string)
⚠️ **AI API Keys**: Not configured (you need to add at least one)

---

## Required Setup Steps

### 1. Configure MongoDB (Required)

Edit `server/.env` and add your MongoDB connection string:

```env
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/ai-marketing?retryWrites=true&w=majority
```

**How to get MongoDB connection string:**
1. Go to https://cloud.mongodb.com/
2. Create a free cluster (if you don't have one)
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database password

### 2. Configure AI API Key (Required for Content Generation)

You need **at least ONE** of these API keys:

#### Option A: Google AI (Recommended - Free)
1. Go to https://makersuite.google.com/app/apikey
2. Create an API key
3. Add to `server/.env`:
```env
GOOGLE_AI_KEY=your-google-ai-key-here
```

#### Option B: OpenRouter (Alternative)
1. Go to https://openrouter.ai/keys
2. Create an API key
3. Add to `server/.env`:
```env
OPENROUTER_API_KEY=your-openrouter-api-key-here
```

### 3. Restart Backend Server

After adding the API keys:

```bash
# Stop the current server (Ctrl+C in the terminal)
# Or use:
pm2 stop all

# Start again:
cd server
npm start
```

---

## Testing Content Generation

### Step 1: Create an Account

1. Open http://localhost:5173 in your browser
2. Click "Sign Up"
3. Create a test account
4. Verify your email (if email is configured) or check the backend logs for the OTP

### Step 2: Generate Content

1. Login to your account
2. Go to "Content Creation" page
3. Click "AI Generate" button
4. Fill in the form:
   - **Topic**: "Digital Marketing Strategies for Small Businesses"
   - **Keywords**: "digital marketing small business"
   - **Word Count**: 2000
   - **Tone**: Professional
   - **Persona**: SEO Expert
5. Click "Generate Content"
6. Wait 2-4 minutes for the content to generate

### Step 3: Check the Results

The system will:
1. Generate SEO-optimized content using the SEO Mega-Prompt Engine v3.0
2. Apply Advanced Humanization v2.0
3. Apply Chaos Engine randomization
4. Show you the final content with:
   - Human Score (0-100)
   - Word Count
   - Processing Time

---

## API Endpoint for Direct Testing

You can also test the API directly using curl or Postman:

```bash
POST http://localhost:3001/api/content/generate-chaos
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
  "topic": "Digital Marketing Strategies for Small Businesses",
  "keywords": "digital marketing small business",
  "secondaryKeywords": "online marketing, social media marketing",
  "lsiKeywords": "SEO, content marketing, email marketing",
  "searchIntent": "informational",
  "targetAudience": "small business owners",
  "country": "USA",
  "tone": "professional",
  "minWords": 2000,
  "persona": "seoExpert"
}
```

---

## Troubleshooting

### Backend won't start
- Check if port 3001 is already in use
- Check `server/.env` file exists and has correct format
- Check MongoDB connection string is valid

### Frontend won't start
- Check if port 5173 is already in use
- Check `.env.development` points to `http://localhost:3001/api`

### Content generation fails
- Check backend logs: `pm2 logs` or check the terminal
- Verify you have at least one AI API key configured
- Check your API key is valid and has credits

### MongoDB connection error
- Verify your connection string is correct
- Check your IP is whitelisted in MongoDB Atlas
- Check your database password is correct

---

## Current File Structure

```
server/
├── .env                          # Your local environment variables (EDIT THIS)
├── .env.production.example       # Example production config
├── server.js                     # Main server file
├── seoMegaPromptEngine.js       # SEO Mega-Prompt Engine v3.0 (NEW)
├── advancedHumanizer.js         # Advanced Humanizer v2.0 (NEW)
├── chaosEngine.js               # Chaos Engine v2.0
├── humanContentEngine.js        # Human Content Engine
└── megaPromptEngine.js          # Original Mega-Prompt Engine

src/
├── pages/
│   └── ContentCreation.jsx      # Content creation UI (updated)
└── api/
    └── client.js                # API client

.env.development                  # Frontend environment (points to local backend)
```

---

## Next Steps

1. ✅ Add MongoDB connection string to `server/.env`
2. ✅ Add Google AI API key to `server/.env`
3. ✅ Restart backend server
4. ✅ Open http://localhost:5173 in browser
5. ✅ Create account and test content generation

---

## Need Help?

Check the backend logs for detailed error messages:
```bash
# If using pm2:
pm2 logs

# Or check the terminal where you ran npm start
```

---

© 2025 HARSH J KUHIKAR - All Rights Reserved
