/**
 * OAuth Routes - Social Media Authentication Endpoints
 * @author HARSH J KUHIKAR
 * @copyright 2025 HARSH J KUHIKAR. All Rights Reserved.
 */

import express from 'express';
import jwt from 'jsonwebtoken';
import { TwitterOAuth, FacebookOAuth, InstagramOAuth, LinkedInOAuth } from './oauthService.js';
import { ConnectedAccount } from './socialModels.js';

const router = express.Router();

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware to verify JWT (for connect endpoints only)
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(403).json({ error: 'Invalid token' });
    }
};

// Initialize OAuth services
const twitterOAuth = new TwitterOAuth();
const facebookOAuth = new FacebookOAuth();
const instagramOAuth = new InstagramOAuth();
const linkedinOAuth = new LinkedInOAuth();

/**
 * TWITTER OAUTH FLOW
 */

// Step 1: Initiate Twitter OAuth (requires authentication)
router.get('/twitter/connect', authenticateToken, async (req, res) => {
    try {
        // Check if API keys are configured
        if (!process.env.TWITTER_API_KEY || process.env.TWITTER_API_KEY === 'your_twitter_api_key_here') {
            return res.status(400).json({ 
                error: 'Twitter API keys not configured. Please add TWITTER_API_KEY and TWITTER_API_SECRET to server/.env file.',
                needsConfig: true
            });
        }

        const userId = req.user.userId; // From JWT middleware
        const authUrl = await twitterOAuth.getAuthorizationURL(userId);
        res.json({ authUrl });
    } catch (error) {
        console.error('Twitter OAuth initiation error:', error);
        res.status(500).json({ error: 'Failed to initiate Twitter authentication' });
    }
});

// Step 2: Twitter OAuth Callback
router.get('/callback/twitter', async (req, res) => {
    try {
        const { code, state } = req.query;

        if (!code || !state) {
            return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/oauth/callback?error=oauth_failed`);
        }

        // Handle callback and get tokens
        const result = await twitterOAuth.handleCallback(code, state);

        // Save to database
        await ConnectedAccount.findOneAndUpdate(
            { userId: result.userId, platform: 'twitter' },
            {
                userId: result.userId,
                platform: 'twitter',
                username: result.username,
                displayName: result.displayName,
                accessToken: result.accessToken,
                refreshToken: result.refreshToken,
                tokenExpiry: new Date(Date.now() + result.expiresIn * 1000),
                profileImage: result.profileImage,
                connected: true,
                connectedAt: new Date()
            },
            { upsert: true, new: true }
        );

        // Redirect back to frontend OAuth callback
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/oauth/callback?success=twitter_connected`);
    } catch (error) {
        console.error('Twitter OAuth callback error:', error);
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/oauth/callback?error=twitter_failed`);
    }
});

/**
 * FACEBOOK OAUTH FLOW
 */

// Step 1: Initiate Facebook OAuth (requires authentication)
router.get('/facebook/connect', authenticateToken, async (req, res) => {
    try {
        // Check if API keys are configured
        if (!process.env.FACEBOOK_APP_ID || process.env.FACEBOOK_APP_ID === 'your_facebook_app_id_here') {
            return res.status(400).json({ 
                error: 'Facebook API keys not configured. Please add FACEBOOK_APP_ID and FACEBOOK_APP_SECRET to server/.env file.',
                needsConfig: true
            });
        }

        const userId = req.user.userId;
        const authUrl = facebookOAuth.getAuthorizationURL(userId);
        res.json({ authUrl });
    } catch (error) {
        console.error('Facebook OAuth initiation error:', error);
        res.status(500).json({ error: 'Failed to initiate Facebook authentication' });
    }
});

// Step 2: Facebook OAuth Callback
router.get('/callback/facebook', async (req, res) => {
    try {
        const { code, state } = req.query;

        if (!code || !state) {
            return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/oauth/callback?error=oauth_failed`);
        }

        // Handle callback and get tokens
        const result = await facebookOAuth.handleCallback(code, state);

        // Save each page as a separate connection
        for (const page of result.pages) {
            await ConnectedAccount.findOneAndUpdate(
                { userId: result.userId, platform: 'facebook', pageId: page.id },
                {
                    userId: result.userId,
                    platform: 'facebook',
                    username: page.name,
                    pageId: page.id,
                    accessToken: page.access_token,
                    connected: true,
                    connectedAt: new Date()
                },
                { upsert: true, new: true }
            );
        }

        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/oauth/callback?success=facebook_connected`);
    } catch (error) {
        console.error('Facebook OAuth callback error:', error);
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/oauth/callback?error=facebook_failed`);
    }
});

/**
 * INSTAGRAM OAUTH FLOW
 */

// Step 1: Initiate Instagram OAuth (requires authentication)
router.get('/instagram/connect', authenticateToken, async (req, res) => {
    try {
        // Check if API keys are configured (Instagram uses Facebook App ID)
        if (!process.env.FACEBOOK_APP_ID || process.env.FACEBOOK_APP_ID === 'your_facebook_app_id_here') {
            return res.status(400).json({ 
                error: 'Instagram requires Facebook API keys. Please add FACEBOOK_APP_ID and FACEBOOK_APP_SECRET to server/.env file.',
                needsConfig: true
            });
        }

        const userId = req.user.userId;
        const authUrl = instagramOAuth.getAuthorizationURL(userId);
        res.json({ authUrl });
    } catch (error) {
        console.error('Instagram OAuth initiation error:', error);
        res.status(500).json({ error: 'Failed to initiate Instagram authentication' });
    }
});

// Step 2: Instagram OAuth Callback
router.get('/callback/instagram', async (req, res) => {
    try {
        const { code, state } = req.query;

        if (!code || !state) {
            return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/oauth/callback?error=oauth_failed`);
        }

        // Handle callback and get tokens
        const result = await instagramOAuth.handleCallback(code, state);

        // Save to database
        await ConnectedAccount.findOneAndUpdate(
            { userId: result.userId, platform: 'instagram' },
            {
                userId: result.userId,
                platform: 'instagram',
                username: result.username,
                instagramUserId: result.instagramUserId,
                accessToken: result.accessToken,
                connected: true,
                connectedAt: new Date()
            },
            { upsert: true, new: true }
        );

        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/oauth/callback?success=instagram_connected`);
    } catch (error) {
        console.error('Instagram OAuth callback error:', error);
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/oauth/callback?error=instagram_failed`);
    }
});

/**
 * LINKEDIN OAUTH FLOW
 */

// Step 1: Initiate LinkedIn OAuth (requires authentication)
router.get('/linkedin/connect', authenticateToken, async (req, res) => {
    try {
        // Check if API keys are configured
        if (!process.env.LINKEDIN_CLIENT_ID || process.env.LINKEDIN_CLIENT_ID === 'your_linkedin_client_id_here') {
            return res.status(400).json({ 
                error: 'LinkedIn API keys not configured. Please add LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET to server/.env file.',
                needsConfig: true
            });
        }

        const userId = req.user.userId;
        const authUrl = linkedinOAuth.getAuthorizationURL(userId);
        res.json({ authUrl });
    } catch (error) {
        console.error('LinkedIn OAuth initiation error:', error);
        res.status(500).json({ error: 'Failed to initiate LinkedIn authentication' });
    }
});

// Step 2: LinkedIn OAuth Callback
router.get('/callback/linkedin', async (req, res) => {
    try {
        const { code, state } = req.query;

        if (!code || !state) {
            return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/oauth/callback?error=oauth_failed`);
        }

        // Handle callback and get tokens
        const result = await linkedinOAuth.handleCallback(code, state);

        // Save to database
        await ConnectedAccount.findOneAndUpdate(
            { userId: result.userId, platform: 'linkedin' },
            {
                userId: result.userId,
                platform: 'linkedin',
                username: result.username,
                displayName: result.displayName,
                linkedinId: result.linkedinId,
                accessToken: result.accessToken,
                tokenExpiry: new Date(Date.now() + result.expiresIn * 1000),
                profileImage: result.profileImage,
                email: result.email,
                connected: true,
                connectedAt: new Date()
            },
            { upsert: true, new: true }
        );

        // Redirect back to frontend OAuth callback
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/oauth/callback?success=linkedin_connected`);
    } catch (error) {
        console.error('LinkedIn OAuth callback error:', error);
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/oauth/callback?error=linkedin_failed`);
    }
});

/**
 * DISCONNECT ACCOUNT (requires authentication)
 */
router.delete('/:platform/disconnect', authenticateToken, async (req, res) => {
    try {
        const { platform } = req.params;
        const userId = req.user.userId;

        await ConnectedAccount.findOneAndUpdate(
            { userId, platform },
            { connected: false, disconnectedAt: new Date() }
        );

        res.json({ success: true, message: `${platform} disconnected successfully` });
    } catch (error) {
        console.error('Disconnect error:', error);
        res.status(500).json({ error: 'Failed to disconnect account' });
    }
});

export default router;
