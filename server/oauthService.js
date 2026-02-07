/**
 * OAuth Service - Multi-Tenant Social Media Authentication
 * Handles Twitter, Facebook, and Instagram OAuth flows
 * @author HARSH J KUHIKAR
 * @copyright 2025 HARSH J KUHIKAR. All Rights Reserved.
 */

import { TwitterApi } from 'twitter-api-v2';
import axios from 'axios';
import crypto from 'crypto';

// Store OAuth states temporarily (use Redis in production)
const oauthStates = new Map();

/**
 * Twitter OAuth 2.0 Flow
 */
export class TwitterOAuth {
    constructor() {
        this.clientId = process.env.TWITTER_API_KEY;
        this.clientSecret = process.env.TWITTER_API_SECRET;
        this.callbackURL = process.env.TWITTER_CALLBACK_URL || 'http://localhost:3001/api/social/callback/twitter';
    }

    /**
     * Generate OAuth URL for user authorization
     */
    async getAuthorizationURL(userId) {
        const state = crypto.randomBytes(32).toString('hex');
        const codeVerifier = crypto.randomBytes(32).toString('base64url');
        const codeChallenge = crypto
            .createHash('sha256')
            .update(codeVerifier)
            .digest('base64url');

        // Store state and verifier
        oauthStates.set(state, {
            userId,
            codeVerifier,
            platform: 'twitter',
            timestamp: Date.now()
        });

        const params = new URLSearchParams({
            response_type: 'code',
            client_id: this.clientId,
            redirect_uri: this.callbackURL,
            scope: 'tweet.read tweet.write users.read offline.access',
            state,
            code_challenge: codeChallenge,
            code_challenge_method: 'S256'
        });

        return `https://twitter.com/i/oauth2/authorize?${params.toString()}`;
    }

    /**
     * Handle OAuth callback and get access token
     */
    async handleCallback(code, state) {
        const stateData = oauthStates.get(state);
        if (!stateData) {
            throw new Error('Invalid or expired state');
        }

        oauthStates.delete(state);

        const params = new URLSearchParams({
            code,
            grant_type: 'authorization_code',
            client_id: this.clientId,
            redirect_uri: this.callbackURL,
            code_verifier: stateData.codeVerifier
        });

        const response = await axios.post(
            'https://api.twitter.com/2/oauth2/token',
            params.toString(),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`
                }
            }
        );

        const { access_token, refresh_token, expires_in } = response.data;

        // Get user info
        const userInfo = await this.getUserInfo(access_token);

        return {
            userId: stateData.userId,
            accessToken: access_token,
            refreshToken: refresh_token,
            expiresIn: expires_in,
            username: userInfo.username,
            displayName: userInfo.name,
            profileImage: userInfo.profile_image_url
        };
    }

    /**
     * Get user information
     */
    async getUserInfo(accessToken) {
        const client = new TwitterApi(accessToken);
        const user = await client.v2.me({
            'user.fields': ['username', 'name', 'profile_image_url']
        });
        return user.data;
    }

    /**
     * Post tweet with media
     */
    async postTweet(accessToken, text, mediaBuffer = null) {
        const client = new TwitterApi(accessToken);

        if (mediaBuffer) {
            // Upload media first
            const mediaId = await client.v1.uploadMedia(mediaBuffer, {
                mimeType: 'image/jpeg'
            });

            // Post tweet with media
            return await client.v2.tweet({
                text,
                media: { media_ids: [mediaId] }
            });
        } else {
            // Post text-only tweet
            return await client.v2.tweet({ text });
        }
    }

    /**
     * Refresh access token
     */
    async refreshAccessToken(refreshToken) {
        const params = new URLSearchParams({
            refresh_token: refreshToken,
            grant_type: 'refresh_token',
            client_id: this.clientId
        });

        const response = await axios.post(
            'https://api.twitter.com/2/oauth2/token',
            params.toString(),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`
                }
            }
        );

        return response.data;
    }
}

/**
 * Facebook OAuth 2.0 Flow
 */
export class FacebookOAuth {
    constructor() {
        this.appId = process.env.FACEBOOK_APP_ID;
        this.appSecret = process.env.FACEBOOK_APP_SECRET;
        this.callbackURL = process.env.FACEBOOK_CALLBACK_URL || 'http://localhost:3001/api/social/callback/facebook';
    }

    /**
     * Generate OAuth URL for user authorization
     */
    getAuthorizationURL(userId) {
        const state = crypto.randomBytes(32).toString('hex');

        oauthStates.set(state, {
            userId,
            platform: 'facebook',
            timestamp: Date.now()
        });

        const params = new URLSearchParams({
            client_id: this.appId,
            redirect_uri: this.callbackURL,
            state,
            scope: 'pages_manage_posts,pages_read_engagement,pages_show_list'
        });

        return `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`;
    }

    /**
     * Handle OAuth callback and get access token
     */
    async handleCallback(code, state) {
        const stateData = oauthStates.get(state);
        if (!stateData) {
            throw new Error('Invalid or expired state');
        }

        oauthStates.delete(state);

        // Exchange code for access token
        const params = new URLSearchParams({
            client_id: this.appId,
            client_secret: this.appSecret,
            redirect_uri: this.callbackURL,
            code
        });

        const response = await axios.get(
            `https://graph.facebook.com/v18.0/oauth/access_token?${params.toString()}`
        );

        const { access_token } = response.data;

        // Get user info and pages
        const userInfo = await this.getUserInfo(access_token);
        const pages = await this.getUserPages(access_token);

        return {
            userId: stateData.userId,
            accessToken: access_token,
            username: userInfo.name,
            facebookUserId: userInfo.id,
            pages: pages
        };
    }

    /**
     * Get user information
     */
    async getUserInfo(accessToken) {
        const response = await axios.get(
            `https://graph.facebook.com/v18.0/me?fields=id,name,picture&access_token=${accessToken}`
        );
        return response.data;
    }

    /**
     * Get user's Facebook pages
     */
    async getUserPages(accessToken) {
        const response = await axios.get(
            `https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}`
        );
        return response.data.data;
    }

    /**
     * Post to Facebook page
     */
    async postToPage(pageAccessToken, pageId, message, imageUrl = null) {
        const params = {
            message,
            access_token: pageAccessToken
        };

        if (imageUrl) {
            params.url = imageUrl;
            return await axios.post(
                `https://graph.facebook.com/v18.0/${pageId}/photos`,
                params
            );
        } else {
            return await axios.post(
                `https://graph.facebook.com/v18.0/${pageId}/feed`,
                params
            );
        }
    }
}

/**
 * Instagram OAuth 2.0 Flow (via Instagram Basic Display API)
 */
export class InstagramOAuth {
    constructor() {
        // Instagram uses its own App ID from Instagram Basic Display settings
        // Falls back to Facebook App ID if Instagram-specific not set
        this.appId = process.env.INSTAGRAM_APP_ID || process.env.FACEBOOK_APP_ID;
        this.appSecret = process.env.INSTAGRAM_APP_SECRET || process.env.FACEBOOK_APP_SECRET;
        this.callbackURL = process.env.INSTAGRAM_CALLBACK_URL || 'http://localhost:3001/api/social/callback/instagram';
    }

    /**
     * Generate OAuth URL for user authorization
     */
    getAuthorizationURL(userId) {
        const state = crypto.randomBytes(32).toString('hex');

        oauthStates.set(state, {
            userId,
            platform: 'instagram',
            timestamp: Date.now()
        });

        const params = new URLSearchParams({
            client_id: this.appId,
            redirect_uri: this.callbackURL,
            scope: 'instagram_basic,instagram_content_publish',
            response_type: 'code',
            state
        });

        return `https://api.instagram.com/oauth/authorize?${params.toString()}`;
    }

    /**
     * Handle OAuth callback and get access token
     */
    async handleCallback(code, state) {
        const stateData = oauthStates.get(state);
        if (!stateData) {
            throw new Error('Invalid or expired state');
        }

        oauthStates.delete(state);

        // Exchange code for access token
        const params = new URLSearchParams({
            client_id: this.appId,
            client_secret: this.appSecret,
            grant_type: 'authorization_code',
            redirect_uri: this.callbackURL,
            code
        });

        const response = await axios.post(
            'https://api.instagram.com/oauth/access_token',
            params
        );

        const { access_token, user_id } = response.data;

        // Get long-lived token
        const longLivedToken = await this.getLongLivedToken(access_token);

        // Get user info
        const userInfo = await this.getUserInfo(longLivedToken);

        return {
            userId: stateData.userId,
            accessToken: longLivedToken,
            instagramUserId: user_id,
            username: userInfo.username
        };
    }

    /**
     * Exchange short-lived token for long-lived token
     */
    async getLongLivedToken(shortLivedToken) {
        const params = new URLSearchParams({
            grant_type: 'ig_exchange_token',
            client_secret: this.appSecret,
            access_token: shortLivedToken
        });

        const response = await axios.get(
            `https://graph.instagram.com/access_token?${params.toString()}`
        );

        return response.data.access_token;
    }

    /**
     * Get user information
     */
    async getUserInfo(accessToken) {
        const response = await axios.get(
            `https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}`
        );
        return response.data;
    }

    /**
     * Post to Instagram
     */
    async postToInstagram(accessToken, instagramUserId, imageUrl, caption) {
        // Step 1: Create media container
        const containerResponse = await axios.post(
            `https://graph.instagram.com/v18.0/${instagramUserId}/media`,
            {
                image_url: imageUrl,
                caption,
                access_token: accessToken
            }
        );

        const creationId = containerResponse.data.id;

        // Step 2: Publish media
        const publishResponse = await axios.post(
            `https://graph.instagram.com/v18.0/${instagramUserId}/media_publish`,
            {
                creation_id: creationId,
                access_token: accessToken
            }
        );

        return publishResponse.data;
    }
}

/**
 * LinkedIn OAuth 2.0 Flow
 */
export class LinkedInOAuth {
    constructor() {
        this.clientId = process.env.LINKEDIN_CLIENT_ID;
        this.clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
        this.callbackURL = process.env.LINKEDIN_CALLBACK_URL || 'http://localhost:3001/api/social/callback/linkedin';
    }

    /**
     * Generate OAuth URL for user authorization
     */
    getAuthorizationURL(userId) {
        const state = crypto.randomBytes(32).toString('hex');

        oauthStates.set(state, {
            userId,
            platform: 'linkedin',
            timestamp: Date.now()
        });

        const params = new URLSearchParams({
            response_type: 'code',
            client_id: this.clientId,
            redirect_uri: this.callbackURL,
            state,
            scope: 'openid profile email w_member_social'
        });

        return `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
    }

    /**
     * Handle OAuth callback and get access token
     */
    async handleCallback(code, state) {
        const stateData = oauthStates.get(state);
        if (!stateData) {
            throw new Error('Invalid or expired state');
        }

        oauthStates.delete(state);

        // Exchange code for access token
        const params = new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            client_id: this.clientId,
            client_secret: this.clientSecret,
            redirect_uri: this.callbackURL
        });

        const response = await axios.post(
            'https://www.linkedin.com/oauth/v2/accessToken',
            params.toString(),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        const { access_token, expires_in } = response.data;

        // Get user info
        const userInfo = await this.getUserInfo(access_token);

        return {
            userId: stateData.userId,
            accessToken: access_token,
            expiresIn: expires_in,
            linkedinId: userInfo.sub,
            username: userInfo.name || userInfo.email,
            displayName: userInfo.name,
            email: userInfo.email,
            profileImage: userInfo.picture
        };
    }

    /**
     * Get user information using OpenID Connect
     */
    async getUserInfo(accessToken) {
        const response = await axios.get(
            'https://api.linkedin.com/v2/userinfo',
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        );
        return response.data;
    }

    /**
     * Post to LinkedIn
     */
    async postToLinkedIn(accessToken, linkedinId, text, imageUrl = null) {
        const postData = {
            author: `urn:li:person:${linkedinId}`,
            lifecycleState: 'PUBLISHED',
            specificContent: {
                'com.linkedin.ugc.ShareContent': {
                    shareCommentary: {
                        text: text
                    },
                    shareMediaCategory: imageUrl ? 'IMAGE' : 'NONE'
                }
            },
            visibility: {
                'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
            }
        };

        if (imageUrl) {
            // For image posts, we need to upload the image first
            // This is a simplified version - full implementation requires image upload
            postData.specificContent['com.linkedin.ugc.ShareContent'].media = [{
                status: 'READY',
                originalUrl: imageUrl
            }];
        }

        const response = await axios.post(
            'https://api.linkedin.com/v2/ugcPosts',
            postData,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    'X-Restli-Protocol-Version': '2.0.0'
                }
            }
        );

        return response.data;
    }
}

/**
 * Google OAuth 2.0 Flow
 */
export class GoogleOAuth {
    constructor() {
        this.clientId = process.env.GOOGLE_CLIENT_ID;
        this.clientSecret = process.env.GOOGLE_CLIENT_SECRET;
        this.callbackURL = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3001/api/auth/callback/google';
    }

    /**
     * Generate OAuth URL for user authorization
     */
    getAuthorizationURL() {
        const state = crypto.randomBytes(32).toString('hex');

        oauthStates.set(state, {
            platform: 'google',
            timestamp: Date.now()
        });

        const params = new URLSearchParams({
            client_id: this.clientId,
            redirect_uri: this.callbackURL,
            response_type: 'code',
            scope: 'openid email profile',
            state,
            access_type: 'offline',
            prompt: 'consent'
        });

        return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    }

    /**
     * Handle OAuth callback and get access token
     */
    async handleCallback(code, state) {
        const stateData = oauthStates.get(state);
        if (!stateData) {
            throw new Error('Invalid or expired state');
        }

        oauthStates.delete(state);

        // Exchange code for access token
        const params = new URLSearchParams({
            code,
            client_id: this.clientId,
            client_secret: this.clientSecret,
            redirect_uri: this.callbackURL,
            grant_type: 'authorization_code'
        });

        const response = await axios.post(
            'https://oauth2.googleapis.com/token',
            params.toString(),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        const { access_token, refresh_token, id_token } = response.data;

        // Get user info
        const userInfo = await this.getUserInfo(access_token);

        return {
            accessToken: access_token,
            refreshToken: refresh_token,
            idToken: id_token,
            googleId: userInfo.sub,
            email: userInfo.email,
            name: userInfo.name,
            picture: userInfo.picture,
            emailVerified: userInfo.email_verified
        };
    }

    /**
     * Get user information
     */
    async getUserInfo(accessToken) {
        const response = await axios.get(
            'https://www.googleapis.com/oauth2/v3/userinfo',
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        );
        return response.data;
    }
}

/**
 * Clean up expired OAuth states (run periodically)
 */
export function cleanupExpiredStates() {
    const now = Date.now();
    const maxAge = 10 * 60 * 1000; // 10 minutes

    for (const [state, data] of oauthStates.entries()) {
        if (now - data.timestamp > maxAge) {
            oauthStates.delete(state);
        }
    }
}

// Clean up every 5 minutes
setInterval(cleanupExpiredStates, 5 * 60 * 1000);
