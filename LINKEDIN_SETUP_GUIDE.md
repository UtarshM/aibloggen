# 🔗 LinkedIn OAuth Setup Guide

## ✅ LinkedIn OAuth is Now Implemented!

The LinkedIn OAuth routes have been added to your platform. To enable LinkedIn login for you and your clients, follow these steps:

---

## 📋 Step-by-Step Setup

### Step 1: Create LinkedIn Developer App

1. Go to: https://www.linkedin.com/developers/apps
2. Click **"Create app"**
3. Fill in the details:
   - **App name**: Your Platform Name
   - **LinkedIn Page**: Select or create a company page
   - **App logo**: Upload your logo
   - **Legal agreement**: Check the box
4. Click **"Create app"**

### Step 2: Get Your Credentials

1. In your app dashboard, go to **"Auth"** tab
2. Copy your:
   - **Client ID**
   - **Client Secret** (click "Generate" if needed)

### Step 3: Add Products

1. Go to **"Products"** tab
2. Request access to:
   - ✅ **Sign In with LinkedIn using OpenID Connect** (for login)
   - ✅ **Share on LinkedIn** (for posting)
3. Wait for approval (usually instant for OpenID Connect)

### Step 4: Set Redirect URL

1. Go to **"Auth"** tab
2. Under **"OAuth 2.0 settings"**
3. Add this **Redirect URL**:
   ```
   http://localhost:3001/api/social/callback/linkedin
   ```
4. For production, add your domain:
   ```
   https://yourdomain.com/api/social/callback/linkedin
   ```

### Step 5: Update Your .env File

Open `server/.env` and update these values:

```env
# LinkedIn OAuth 2.0
LINKEDIN_CLIENT_ID=your_actual_client_id_here
LINKEDIN_CLIENT_SECRET=your_actual_client_secret_here
LINKEDIN_CALLBACK_URL=http://localhost:3001/api/social/callback/linkedin
```

### Step 6: Restart Server

After updating .env, restart the backend server:
- The server will automatically pick up the new credentials

---

## 🎯 How It Works

### For Users:
1. Click **"Connect"** on LinkedIn in Social Media page
2. LinkedIn login popup opens
3. User authorizes your app
4. User is redirected back
5. Account is connected!

### OAuth Flow:
```
User clicks Connect → LinkedIn Auth Page → User Approves → 
Callback URL → Save Token → Account Connected
```

---

## 🔧 Technical Details

### Files Modified:
- `server/oauthService.js` - Added `LinkedInOAuth` class
- `server/oauthRoutes.js` - Added LinkedIn routes
- `server/.env` - Added LinkedIn credentials

### API Endpoints:
- `GET /api/social/linkedin/connect` - Initiates OAuth
- `GET /api/social/callback/linkedin` - Handles callback

### Scopes Used:
- `openid` - OpenID Connect
- `profile` - User profile info
- `email` - User email
- `w_member_social` - Post to LinkedIn

---

## ⚠️ Important Notes

### Development vs Production:

**Development (localhost):**
```
LINKEDIN_CALLBACK_URL=http://localhost:3001/api/social/callback/linkedin
```

**Production:**
```
LINKEDIN_CALLBACK_URL=https://yourdomain.com/api/social/callback/linkedin
```

### LinkedIn API Limitations:
- Free tier: Limited API calls
- Posting requires "Share on LinkedIn" product approval
- Some features require LinkedIn Partner Program

---

## 🧪 Testing

### Before LinkedIn Credentials:
- Clicking "Connect" shows: "LinkedIn API keys not configured"

### After LinkedIn Credentials:
- Clicking "Connect" opens LinkedIn login popup
- After approval, account shows as connected

---

## 📱 Current Status

| Platform | OAuth Status | Notes |
|----------|-------------|-------|
| Twitter | ✅ Ready | Needs API keys |
| Facebook | ✅ Ready | Configured |
| Instagram | ✅ Ready | Uses Facebook App |
| LinkedIn | ✅ Ready | Needs API keys |

---

## 🆘 Troubleshooting

### Error: "LinkedIn API keys not configured"
**Solution**: Add LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET to .env

### Error: "Invalid redirect URI"
**Solution**: Make sure the callback URL in LinkedIn app matches exactly:
`http://localhost:3001/api/social/callback/linkedin`

### Error: "Application not authorized"
**Solution**: Request "Sign In with LinkedIn using OpenID Connect" product

### Error: "Scope not authorized"
**Solution**: Request "Share on LinkedIn" product for posting

---

## 🔗 Useful Links

- LinkedIn Developer Portal: https://www.linkedin.com/developers/apps
- LinkedIn OAuth Documentation: https://learn.microsoft.com/en-us/linkedin/shared/authentication/authorization-code-flow
- LinkedIn API Documentation: https://learn.microsoft.com/en-us/linkedin/

---

## ✅ Quick Checklist

- [ ] Created LinkedIn Developer App
- [ ] Got Client ID and Client Secret
- [ ] Added "Sign In with LinkedIn using OpenID Connect" product
- [ ] Added "Share on LinkedIn" product (for posting)
- [ ] Added redirect URL in LinkedIn app
- [ ] Updated server/.env with credentials
- [ ] Restarted backend server
- [ ] Tested connection

---

**Once you add your LinkedIn credentials, the "Connect" button will work!**

© 2025 HARSH J KUHIKAR - All Rights Reserved
