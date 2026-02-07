# API Key Setup Guide

## Current Issue
Your Google AI API key has exceeded its free tier quota, and the OpenRouter key appears to be an Anthropic key instead.

## Solutions

### Option 1: Get New Google AI API Key (RECOMMENDED - FREE)

1. **Visit Google AI Studio**
   - Go to: https://makersuite.google.com/app/apikey
   - Or: https://aistudio.google.com/app/apikey

2. **Create API Key**
   - Click "Create API Key"
   - Select your Google Cloud project (or create new one)
   - Copy the API key (starts with `AIza...`)

3. **Update .env file**
   ```bash
   GOOGLE_AI_KEY=AIza...YOUR_NEW_KEY_HERE
   ```

4. **Restart backend server**
   - Stop the current server (Ctrl+C in terminal)
   - Run: `node server.js` in the `server` folder

5. **Test in browser**
   - Go to http://localhost:5173
   - Try generating content

---

### Option 2: Get OpenRouter API Key (FREE TIER AVAILABLE)

1. **Visit OpenRouter**
   - Go to: https://openrouter.ai/

2. **Sign Up**
   - Create account
   - Go to Keys section
   - Create new API key

3. **Copy API Key**
   - Key starts with `sk-or-v1-...`
   - NOT `sk-ant-...` (that's Anthropic)

4. **Update .env file**
   ```bash
   OPENROUTER_API_KEY=sk-or-v1-...YOUR_KEY_HERE
   ```

5. **Restart backend server**

---

### Option 3: Use Anthropic API Directly

If you have an Anthropic API key with credits (`sk-ant-api03-...`), I can modify the server code to use it directly.

**Your current Anthropic key:**
```
sk-ant-api03-xxxxx... (hidden for security)
```

Note: API key has been removed for security. Add your key to `server/.env` file.

---

## MongoDB Connection Issue (Optional)

Your MongoDB connection is also failing. To fix:

1. **Check your MongoDB Atlas password**
   - Current password in .env: `<Kuhikar@1122>`
   - I've URL-encoded it to: `%3CKuhikar%401122%3E`

2. **If password is wrong, get correct one:**
   - Go to: https://cloud.mongodb.com/
   - Go to Database Access
   - Reset password if needed
   - Update in .env file with URL encoding

3. **URL Encoding for special characters:**
   - `<` becomes `%3C`
   - `>` becomes `%3E`
   - `@` becomes `%40`
   - `#` becomes `%23`
   - `$` becomes `%24`
   - `%` becomes `%25`
   - `&` becomes `%26`

---

## Quick Test

After updating API keys, test with:

```bash
cd server
node test-api.js        # Test Google AI
node test-openrouter.js # Test OpenRouter
```

---

## Current Status

✅ Backend server running on http://localhost:3001
✅ Frontend running on http://localhost:5173
❌ Google AI API - Quota exceeded
❌ OpenRouter API - Invalid key (Anthropic key provided)
❌ MongoDB - Authentication failed

**Next Step:** Get a new Google AI API key (easiest and free) or let me add Anthropic API support.
